import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname } from 'node:path';

const PATTERNS_PATH = 'src/content/patterns.json';
const PUBLIC_PATTERNS_DIR = 'public/patterns';

const DEFAULT_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

function decodeHtmlEntities(value) {
  return value
    .replaceAll('&nbsp;', ' ')
    .replaceAll('&#x27;', "'")
    .replaceAll('&#39;', "'")
    .replaceAll('&quot;', '"')
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

function stripTags(value) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

function cleanCaptionText(value, fallback = '') {
  const text = stripTags(value || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

  if (!text) {
    return '';
  }

  if (fallback && normalizeText(text) === normalizeText(fallback)) {
    return '';
  }

  if (text.length < 8) {
    return '';
  }

  return text;
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getWordSet(value) {
  return new Set(normalizeText(value).split(' ').filter((word) => word.length > 2));
}

function headingScore(a, b) {
  const setA = getWordSet(a);
  const setB = getWordSet(b);

  if (setA.size === 0 || setB.size === 0) {
    return 0;
  }

  let overlap = 0;
  for (const word of setA) {
    if (setB.has(word)) {
      overlap += 1;
    }
  }

  return overlap;
}

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const end = html.indexOf(endMarker, start);
  if (end === -1) return null;
  return html.slice(start, end);
}

function getContentSegment(sourceUrl, html) {
  const hostname = new URL(sourceUrl).hostname;

  if (hostname.includes('shapeof.ai')) {
    const segment = extractBetween(
      html,
      '<div id="description"',
      '<div id="common-best-practices"'
    );
    if (segment) return segment;
  }

  const main = html.match(/<main[\s\S]*?<\/main>/i);
  if (main) return main[0];

  const article = html.match(/<article[\s\S]*?<\/article>/i);
  if (article) return article[0];

  const body = html.match(/<body[\s\S]*?<\/body>/i);
  if (body) return body[0];

  return html;
}

function extractAttr(attrs, name) {
  const quoted = new RegExp(`${name}="([^"]+)"`, 'i');
  const single = new RegExp(`${name}='([^']+)'`, 'i');
  const unquoted = new RegExp(`${name}=([^\s>]+)`, 'i');

  const quotedMatch = attrs.match(quoted);
  if (quotedMatch) return quotedMatch[1];

  const singleMatch = attrs.match(single);
  if (singleMatch) return singleMatch[1];

  const unquotedMatch = attrs.match(unquoted);
  if (unquotedMatch) return unquotedMatch[1];

  return null;
}

function pickSrcFromAttrs(attrs) {
  const srcset =
    extractAttr(attrs, 'data-srcset') ||
    extractAttr(attrs, 'srcset');

  if (srcset) {
    const first = srcset.split(',').map((part) => part.trim()).find(Boolean);
    if (first) {
      const [candidate] = first.split(/\s+/);
      if (candidate) {
        return candidate;
      }
    }
  }

  return (
    extractAttr(attrs, 'data-src') ||
    extractAttr(attrs, 'data-original') ||
    extractAttr(attrs, 'data-lazy-src') ||
    extractAttr(attrs, 'src')
  );
}

function normalizeImageUrl(baseUrl, raw) {
  if (!raw) return null;
  if (raw.startsWith('data:') || raw.startsWith('blob:')) return null;

  const cleaned = raw.trim();
  try {
    return new URL(cleaned, baseUrl).toString();
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
  if (figcaptionMatch) {
    return cleanCaptionText(figcaptionMatch[1], fallbackText);
  }

  const paragraphMatch = localWindow.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
  if (paragraphMatch) {
    return cleanCaptionText(paragraphMatch[1], fallbackText);
  }

  return '';
}

function extractSourceImageCandidates(sourceUrl, html) {
  const segment = getContentSegment(sourceUrl, html);
  const tokens = [];
  const matcher = /<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>|<p\b[^>]*>([\s\S]*?)<\/p>|<img\b([^>]*)>/gi;

  let activeHeading = '';
  let activeParagraph = '';
  let imageOrder = 0;
  let match;
  while ((match = matcher.exec(segment)) !== null) {
    if (match[2] !== undefined) {
      const headingText = stripTags(match[2]);
      if (headingText) {
        activeHeading = headingText;
      }
      continue;
    }

    if (match[3] !== undefined) {
      const paragraphText = stripTags(match[3]);
      if (paragraphText) {
        activeParagraph = paragraphText;
      }
      continue;
    }

    if (match[4] !== undefined) {
      const attrs = match[4];
      const source = pickSrcFromAttrs(attrs);
      const imageUrl = normalizeImageUrl(sourceUrl, source);
      if (!imageUrl || !isLikelyContentImage(imageUrl)) {
        continue;
      }

      const alt = stripTags(extractAttr(attrs, 'alt') || '') || activeHeading || 'Pattern source image';
      const caption = extractCaptionAfterImage(segment, matcher.lastIndex, `${alt} ${activeHeading}`.trim());
      tokens.push({
        imageUrl,
        headingContext: activeHeading,
        paragraphContext: activeParagraph,
        alt,
        caption,
        order: imageOrder,
      });
      imageOrder += 1;
    }
  }

  const unique = [];
  const seen = new Set();
  for (const token of tokens) {
    if (seen.has(token.imageUrl)) continue;
    seen.add(token.imageUrl);
    unique.push(token);
  }

  return unique;
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

async function downloadImageToLocalPath(patternId, imageUrl, apply) {
  const hash = createHash('sha1').update(imageUrl).digest('hex').slice(0, 16);
  const patternDir = `${PUBLIC_PATTERNS_DIR}/${patternId}`;
  const fallbackExt = extensionFromUrl(imageUrl, '.jpg');

  if (!apply) {
    return {
      localPath: `/patterns/${patternId}/${hash}${fallbackExt}`,
      downloaded: false,
      skipped: false,
    };
  }

  await mkdir(patternDir, { recursive: true });

  const response = await fetch(imageUrl, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    return { localPath: null, downloaded: false, skipped: true, reason: `image ${response.status}` };
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.startsWith('image/')) {
    return { localPath: null, downloaded: false, skipped: true, reason: `not-image ${contentType}` };
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  if (buffer.length < 3000) {
    return { localPath: null, downloaded: false, skipped: true, reason: 'too-small' };
  }

  const ext = extensionFromUrl(imageUrl, extensionFromContentType(contentType));
  const fileName = `${hash}${ext}`;
  const filePath = `${patternDir}/${fileName}`;

  if (!existsSync(filePath)) {
    await writeFile(filePath, buffer);
    return {
      localPath: `/patterns/${patternId}/${fileName}`,
      downloaded: true,
      skipped: false,
    };
  }

  return {
    localPath: `/patterns/${patternId}/${fileName}`,
    downloaded: false,
    skipped: false,
  };
}

function extractHeadingLines(descriptionLines) {
  const headingLines = [];
  for (let index = 0; index < descriptionLines.length; index += 1) {
    const line = descriptionLines[index].trim();
    if (line.startsWith('### ')) {
      headingLines.push({
        lineIndex: index,
        text: line.slice(4).trim(),
      });
    }
  }
  return headingLines;
}

function introAnchorLine(descriptionLines, headingLines) {
  if (headingLines.length > 0) {
    return Math.max(0, headingLines[0].lineIndex - 1);
  }

  for (let index = descriptionLines.length - 1; index >= 0; index -= 1) {
    if (descriptionLines[index].trim()) {
      return index;
    }
  }

  return 0;
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

function findParagraphAnchorLine(descriptionLines, paragraphContext) {
  const normalizedContext = normalizeText(paragraphContext || '');
  if (normalizedContext.length < 24) {
    return null;
  }

  const contextWords = new Set(normalizedContext.split(' ').filter((word) => word.length > 2));
  if (contextWords.size < 5) {
    return null;
  }

  let best = null;
  for (let index = 0; index < descriptionLines.length; index += 1) {
    const line = descriptionLines[index].trim();
    if (!line) continue;
    if (line.startsWith('### ') || line.startsWith('#### ') || line.startsWith('![') || /^\*.+\*$/.test(line)) {
      continue;
    }

    const normalizedLine = normalizeText(line);
    if (!normalizedLine) continue;

    const lineWords = new Set(normalizedLine.split(' ').filter((word) => word.length > 2));
    if (lineWords.size === 0) continue;

    let overlap = 0;
    for (const word of contextWords) {
      if (lineWords.has(word)) {
        overlap += 1;
      }
    }

    if (overlap < 4) {
      continue;
    }

    if (!best || overlap > best.overlap) {
      best = { lineIndex: index, overlap };
    }
  }

  return best?.lineIndex ?? null;
}

function chooseAnchorLine(candidate, headingLines, fallbackCursor, descriptionLines) {
  const paragraphAnchor = findParagraphAnchorLine(descriptionLines, candidate.paragraphContext);
  if (paragraphAnchor !== null) {
    return {
      lineIndex: paragraphAnchor,
      fallbackCursor,
      score: 0,
      sourceHeading: candidate.headingContext || '',
      targetHeading: null,
      reason: 'paragraph-context',
    };
  }

  const headingContext = candidate.headingContext || '';

  if (headingContext && headingLines.length > 0) {
    let best = null;
    for (let index = 0; index < headingLines.length; index += 1) {
      const heading = headingLines[index];
      const score = headingScore(headingContext, heading.text);
      if (!best || score > best.score) {
        best = { lineIndex: heading.lineIndex, score, headingText: heading.text };
      }
    }

    if (best && best.score > 0) {
      return {
        lineIndex: best.lineIndex,
        fallbackCursor,
        score: best.score,
        sourceHeading: headingContext,
        targetHeading: best.headingText,
        reason: 'semantic',
      };
    }
  }

  if (headingLines.length > 0) {
    const normalizedCursor = fallbackCursor % headingLines.length;
    const heading = headingLines[normalizedCursor];
    return {
      lineIndex: heading.lineIndex,
      fallbackCursor: normalizedCursor + 1,
      score: 0,
      sourceHeading: headingContext,
      targetHeading: heading.text,
      reason: headingContext ? 'round-robin-no-semantic-match' : 'round-robin-no-source-heading',
    };
  }

  return {
    lineIndex: introAnchorLine(descriptionLines, headingLines),
    fallbackCursor,
    score: 0,
    sourceHeading: headingContext,
    targetHeading: null,
    reason: 'intro-fallback-no-headings',
  };
}

function getSourceUrls(pattern) {
  const sourceSet = new Set();

  if (Array.isArray(pattern.sources)) {
    for (const source of pattern.sources) {
      if (source?.url) {
        sourceSet.add(source.url);
      }
    }
  }

  if (pattern.sourceUrl) {
    sourceSet.add(pattern.sourceUrl);
  }

  return [...sourceSet];
}

function existingMarkdownImagePaths(description) {
  const matches = description.matchAll(/!\[[^\]]*\]\(([^)]+)\)/g);
  const paths = new Set();

  for (const match of matches) {
    const value = (match[1] || '').trim();
    if (value) {
      paths.add(value);
    }
  }

  return paths;
}

function parseExistingImageBlocks(descriptionLines) {
  const blocks = new Map();

  for (let index = 0; index < descriptionLines.length; index += 1) {
    const imageMatch = descriptionLines[index].trim().match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (!imageMatch) {
      continue;
    }

    const path = imageMatch[1].trim();
    const nextLine = descriptionLines[index + 1]?.trim() ?? '';
    const hasCaption = /^\*(.+)\*$/.test(nextLine);

    blocks.set(path, {
      lineIndex: index,
      captionLineIndex: hasCaption ? index + 1 : null,
      hasCaption,
    });
  }

  return blocks;
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

function parseArgs(argv) {
  const args = new Set(argv.slice(2));
  return {
    apply: args.has('--apply'),
    verbose: args.has('--verbose'),
  };
}

async function main() {
  const { apply, verbose } = parseArgs(process.argv);
  const raw = await readFile(PATTERNS_PATH, 'utf8');
  const data = JSON.parse(raw);

  let processed = 0;
  let changed = 0;
  let downloaded = 0;
  let inserted = 0;
  let skippedNoSource = 0;

  for (const pattern of data.patterns) {
    const sourceUrls = getSourceUrls(pattern);
    if (sourceUrls.length === 0) {
      skippedNoSource += 1;
      continue;
    }

    processed += 1;

    const description = pattern.content?.description ?? '';
    const lines = description.split('\n');
    const headingLines = extractHeadingLines(lines);
    const existingPaths = existingMarkdownImagePaths(description);
    const existingBlocks = parseExistingImageBlocks(lines);

    let fallbackCursor = 0;
    let insertionOrder = 0;
    const insertions = [];
    const captionUpdates = [];
    const seenImageUrls = new Set();

    for (const sourceUrl of sourceUrls) {
      let html;
      try {
        html = await fetchHtml(sourceUrl);
      } catch (error) {
        process.stdout.write(`[warn] ${pattern.id}: failed ${sourceUrl} (${error.message})\n`);
        continue;
      }

      const candidates = extractSourceImageCandidates(sourceUrl, html);

      for (const candidate of candidates) {
        if (seenImageUrls.has(candidate.imageUrl)) {
          continue;
        }
        seenImageUrls.add(candidate.imageUrl);

        const localResult = await downloadImageToLocalPath(pattern.id, candidate.imageUrl, apply);
        if (localResult.skipped || !localResult.localPath) {
          continue;
        }

        const alt = cleanAltText(candidate.alt, `${pattern.title} source image`);
        const caption = cleanCaptionText(candidate.caption, alt);
        const deterministicPath = localResult.localPath.replace(/\.img$/, extname(localResult.localPath) || '');
        const localPath = localResult.localPath;
        const existingBlock = existingBlocks.get(localPath) || existingBlocks.get(deterministicPath);
        if (existingBlock) {
          if (caption && !existingBlock.hasCaption) {
            captionUpdates.push({
              lineIndex: existingBlock.lineIndex,
              caption,
            });
          }
          downloaded += localResult.downloaded ? 1 : 0;
          continue;
        }

        if (existingPaths.has(localPath) || existingPaths.has(deterministicPath)) {
          downloaded += localResult.downloaded ? 1 : 0;
          continue;
        }

        downloaded += localResult.downloaded ? 1 : 0;

        const anchor = chooseAnchorLine(candidate, headingLines, fallbackCursor, lines);
        fallbackCursor = anchor.fallbackCursor;

        if (verbose) {
          const sourceHeading = anchor.sourceHeading || '(none)';
          const targetHeading = anchor.targetHeading || '(intro)';
          process.stdout.write(
            `[plan] ${pattern.id}: ${anchor.reason}; sourceHeading="${sourceHeading}" -> targetHeading="${targetHeading}"; score=${anchor.score}; image=${candidate.imageUrl}\n`
          );
        }

        insertions.push({
          lineIndex: anchor.lineIndex,
          order: insertionOrder,
          markdown: caption
            ? `![${alt}](${localPath})\n*${caption}*`
            : `![${alt}](${localPath})`,
        });
        insertionOrder += 1;
      }
    }

    if (insertions.length === 0) {
      if (captionUpdates.length === 0) {
        process.stdout.write(`[skip] ${pattern.id}: no new images\n`);
        continue;
      }
    }

    captionUpdates.sort((a, b) => b.lineIndex - a.lineIndex);

    for (const update of captionUpdates) {
      const nextLine = lines[update.lineIndex + 1]?.trim() ?? '';
      if (/^\*(.+)\*$/.test(nextLine)) {
        continue;
      }

      lines.splice(update.lineIndex + 1, 0, `*${update.caption}*`);
      inserted += 1;
    }

    if (insertions.length === 0 && captionUpdates.length === 0) {
      continue;
    }

    insertions.sort((a, b) => {
      if (a.lineIndex !== b.lineIndex) {
        return b.lineIndex - a.lineIndex;
      }
      // Preserve source order when multiple images anchor to the same line.
      return b.order - a.order;
    });

    for (const insertion of insertions) {
      const target = Math.min(Math.max(insertion.lineIndex + 1, 0), lines.length);
      lines.splice(target, 0, '', insertion.markdown, '');
      inserted += 1;
    }

    pattern.content.description = lines.join('\n').replace(/\n{4,}/g, '\n\n\n').trim();
    changed += 1;

    process.stdout.write(`[ok] ${pattern.id}: +${insertions.length} inline image(s), +${captionUpdates.length} caption(s)\n`);
  }

  if (apply && changed > 0) {
    await writeFile(PATTERNS_PATH, `${JSON.stringify(data, null, 2)}\n`);
  }

  process.stdout.write('\n');
  process.stdout.write(`mode=${apply ? 'apply' : 'dry-run'}\n`);
  process.stdout.write(`processed=${processed}\n`);
  process.stdout.write(`changed=${changed}\n`);
  process.stdout.write(`inserted=${inserted}\n`);
  process.stdout.write(`downloaded=${downloaded}\n`);
  process.stdout.write(`skippedNoSource=${skippedNoSource}\n`);

  if (!apply) {
    process.stdout.write('\nRun with --apply to persist changes.\n');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
