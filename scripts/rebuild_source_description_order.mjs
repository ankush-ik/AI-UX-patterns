import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { extname } from 'node:path';

const PATTERNS_PATH = 'src/content/patterns.json';
const PUBLIC_PATTERNS_DIR = 'public/patterns';

const DEFAULT_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function decode(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('\u00a0', ' ')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&rsquo;', "'")
    .replaceAll('&ldquo;', '"')
    .replaceAll('&rdquo;', '"')
    .replaceAll('&mdash;', '-')
    .replaceAll('&ndash;', '-');
}

function cleanInline(fragment) {
  return decode(
    fragment
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, (_, inner) => cleanInline(inner))
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, inner) => `**${cleanInline(inner)}**`)
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, inner) => cleanInline(inner))
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value) {
  return (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanCaptionText(value, fallback = '') {
  const text = cleanInline(value || '').trim();
  if (!text) return '';
  if (fallback && normalizeText(text) === normalizeText(fallback)) return '';
  if (text.length < 8) return '';
  return text;
}

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const end = html.indexOf(endMarker, start);
  if (end === -1) return null;
  return html.slice(start, end);
}

function extractAttr(attrs, name) {
  const quoted = new RegExp(`${name}="([^"]*)"`, 'i');
  const single = new RegExp(`${name}='([^']*)'`, 'i');
  const unquoted = new RegExp(`${name}=([^\s>]+)`, 'i');

  const quotedMatch = attrs.match(quoted);
  if (quotedMatch) return quotedMatch[1];

  const singleMatch = attrs.match(single);
  if (singleMatch) return singleMatch[1];

  const unquotedMatch = attrs.match(unquoted);
  if (unquotedMatch) return unquotedMatch[1];

  return null;
}

function cleanAltText(alt, fallback) {
  const candidate = (alt || '').replace(/[\[\]"]+/g, ' ').replace(/\s+/g, ' ').trim();
  const looksLikeAttrFragment = /(=|\bloading\b|\bsrc\b|\bdata-)/i.test(candidate);
  const hasMeaningfulText = /[a-z0-9]/i.test(candidate);

  if (!candidate || looksLikeAttrFragment || !hasMeaningfulText) {
    return (fallback || 'Pattern source image').replace(/[\[\]]/g, '').trim();
  }

  return candidate;
}

function pickSrcFromAttrs(attrs) {
  const srcset = extractAttr(attrs, 'data-srcset') || extractAttr(attrs, 'srcset');
  if (srcset) {
    const first = srcset.split(',').map((part) => part.trim()).find(Boolean);
    if (first) {
      const [candidate] = first.split(/\s+/);
      if (candidate) return candidate;
    }
  }

  return (
    extractAttr(attrs, 'data-src')
    || extractAttr(attrs, 'data-original')
    || extractAttr(attrs, 'data-lazy-src')
    || extractAttr(attrs, 'src')
  );
}

function normalizeImageUrl(baseUrl, raw) {
  if (!raw) return null;
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return null;
  try {
    return new URL(raw.trim(), baseUrl).toString();
  } catch {
    return null;
  }
}

function isLikelyContentImage(url) {
  const lower = url.toLowerCase();
  if (lower.includes('gravatar') || lower.includes('avatar') || lower.includes('/logo')) {
    return false;
  }
  return /\.(png|jpe?g|webp|gif|avif|svg)(\?|$)/i.test(lower) || lower.includes('cdn.prod.website-files.com');
}

function extractCaptionAfterImage(segment, startIndex, fallbackText) {
  const remainder = segment.slice(startIndex);
  const nextImageIndex = remainder.search(/<img\b/i);
  const nextHeadingIndex = remainder.search(/<h[1-4]\b/i);
  const nextBoundaryCandidates = [nextImageIndex, nextHeadingIndex].filter((value) => value >= 0);
  const boundaryIndex = nextBoundaryCandidates.length > 0 ? Math.min(...nextBoundaryCandidates) : Math.min(remainder.length, 1200);
  const localWindow = remainder.slice(0, boundaryIndex >= 0 ? boundaryIndex : 1200);

  const figcaptionMatch = localWindow.match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i);
  if (figcaptionMatch) return cleanCaptionText(figcaptionMatch[1], fallbackText);

  const paragraphMatch = localWindow.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraphMatch) return cleanCaptionText(paragraphMatch[1], fallbackText);

  return '';
}

function extensionFromContentType(contentType) {
  if (!contentType) return '.jpg';
  const normalized = contentType.toLowerCase();
  if (normalized.includes('image/png')) return '.png';
  if (normalized.includes('image/webp')) return '.webp';
  if (normalized.includes('image/avif')) return '.avif';
  if (normalized.includes('image/gif')) return '.gif';
  if (normalized.includes('image/svg+xml')) return '.svg';
  if (normalized.includes('image/jpeg') || normalized.includes('image/jpg')) return '.jpg';
  return '.jpg';
}

function extensionFromUrl(url, fallback) {
  const pathname = new URL(url).pathname;
  const ext = extname(pathname).toLowerCase();
  if (ext && /^\.[a-z0-9]+$/.test(ext)) {
    return ext;
  }
  return fallback;
}

async function downloadImageToLocalPath(patternId, imageUrl) {
  const hash = createHash('sha1').update(imageUrl).digest('hex').slice(0, 16);
  const patternDir = `${PUBLIC_PATTERNS_DIR}/${patternId}`;
  const fallbackExt = extensionFromUrl(imageUrl, '.jpg');

  await mkdir(patternDir, { recursive: true });

  const response = await fetch(imageUrl, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    return { localPath: `/patterns/${patternId}/${hash}${fallbackExt}`, downloaded: false, skipped: true };
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return { localPath: `/patterns/${patternId}/${hash}${fallbackExt}`, downloaded: false, skipped: true };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const ext = extensionFromUrl(imageUrl, extensionFromContentType(contentType));
  const fileName = `${hash}${ext}`;
  const filePath = `${patternDir}/${fileName}`;

  if (!existsSync(filePath)) {
    await writeFile(filePath, buffer);
    return { localPath: `/patterns/${patternId}/${fileName}`, downloaded: true, skipped: false };
  }

  return { localPath: `/patterns/${patternId}/${fileName}`, downloaded: false, skipped: false };
}

function parseDescriptionBlocks(sourceUrl, sectionHtml) {
  const blocks = [];
  const matcher = /<(p|h2|h3|h4|li)[^>]*>([\s\S]*?)<\/\1>|<img\b([^>]*)>/gi;
  let listBuffer = null;
  let match;

  const flushList = () => {
    if (listBuffer && listBuffer.items.length > 0) {
      blocks.push({ type: 'list', items: listBuffer.items.slice() });
    }
    listBuffer = null;
  };

  while ((match = matcher.exec(sectionHtml)) !== null) {
    if (match[1]) {
      const kind = match[1].toLowerCase();
      const text = cleanInline(match[2]);
      if (!text) continue;

      if (kind === 'li') {
        if (!listBuffer) {
          listBuffer = { items: [] };
        }
        listBuffer.items.push(text);
        continue;
      }

      flushList();

      if (kind === 'h2' || kind === 'h3') {
        blocks.push({ type: 'heading', text });
        continue;
      }

      if (kind === 'h4') {
        blocks.push({ type: 'subheading', text });
        continue;
      }

      blocks.push({ type: 'paragraph', text });
      continue;
    }

    if (match[3]) {
      flushList();
      const attrs = match[3];
      const source = pickSrcFromAttrs(attrs);
      const imageUrl = normalizeImageUrl(sourceUrl, source);
      if (!imageUrl || !isLikelyContentImage(imageUrl)) {
        continue;
      }

      const alt = cleanAltText(cleanInline(extractAttr(attrs, 'alt') || ''), 'Pattern source image');
      const caption = extractCaptionAfterImage(sectionHtml, matcher.lastIndex, alt);
      blocks.push({ type: 'image', imageUrl, alt, caption });
    }
  }

  flushList();
  return blocks;
}

function emitMarkdown(blocks) {
  const out = [];
  for (const block of blocks) {
    if (block.type === 'heading') {
      out.push(`### ${block.text}`);
      continue;
    }

    if (block.type === 'subheading') {
      out.push(`#### ${block.text}`);
      continue;
    }

    if (block.type === 'list') {
      out.push(block.items.map((item) => `- ${item}`).join('\n'));
      continue;
    }

    if (block.type === 'paragraph') {
      out.push(block.text);
      continue;
    }

    if (block.type === 'image') {
      const imageLine = `![${block.alt}](${block.localPath || block.imageUrl})`;
      if (block.caption) {
        out.push(`${imageLine}\n*${block.caption}*`);
      } else {
        out.push(imageLine);
      }
    }
  }

  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.text();
}

function parseArgs(argv) {
  const idsArg = argv.find((arg) => arg.startsWith('--ids='));
  const ids = idsArg ? idsArg.replace('--ids=', '').split(',').map((id) => id.trim()).filter(Boolean) : [];
  return { ids };
}

async function main() {
  const { ids } = parseArgs(process.argv.slice(2));
  if (ids.length === 0) {
    throw new Error('Provide target pattern ids with --ids=id1,id2');
  }

  const raw = await readFile(PATTERNS_PATH, 'utf8');
  const data = JSON.parse(raw);

  let updated = 0;
  let downloaded = 0;

  for (const id of ids) {
    const pattern = data.patterns.find((item) => item.id === id);
    if (!pattern) {
      process.stdout.write(`[skip] ${id}: not found\n`);
      continue;
    }

    const sourceUrl = pattern.sourceUrl || pattern.sources?.find((item) => item?.url?.includes('shapeof.ai'))?.url;
    if (!sourceUrl || !sourceUrl.includes('shapeof.ai')) {
      process.stdout.write(`[skip] ${id}: no shapeof source\n`);
      continue;
    }

    const html = await fetchHtml(sourceUrl);
    const section = extractBetween(html, '<div id="description"', '<div id="common-best-practices"');
    if (!section) {
      process.stdout.write(`[skip] ${id}: missing description section\n`);
      continue;
    }

    const blocks = parseDescriptionBlocks(sourceUrl, section);
    for (const block of blocks) {
      if (block.type !== 'image') continue;
      const localResult = await downloadImageToLocalPath(id, block.imageUrl);
      block.localPath = localResult.localPath;
      if (localResult.downloaded) downloaded += 1;
    }

    const markdown = emitMarkdown(blocks);
    if (markdown && markdown !== (pattern.content?.description || '')) {
      pattern.content.description = markdown;
      updated += 1;
      process.stdout.write(`[ok] ${id}: description rebuilt (${blocks.length} blocks)\n`);
    } else {
      process.stdout.write(`[skip] ${id}: no change\n`);
    }
  }

  await writeFile(PATTERNS_PATH, `${JSON.stringify(data, null, 2)}\n`);
  process.stdout.write(`\nupdated=${updated}\n`);
  process.stdout.write(`downloaded=${downloaded}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
