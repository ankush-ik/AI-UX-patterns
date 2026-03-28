import { readFileSync, writeFileSync } from 'node:fs';

const PATTERNS_PATH = 'src/content/patterns.json';
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
      .replace(/<figure[\s\S]*?<\/figure>/gi, '')
      .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, (_, inner) => cleanInline(inner))
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, inner) => `**${cleanInline(inner)}**`)
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, inner) => cleanInline(inner))
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\*\*\*\*:\*\*/g, '**:')
    .replace(/\*\*\*\*:/g, '**:')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeImageAltText(markdown) {
  return (markdown || '').replace(/!\[([^\]]*)\]\(/g, (match, alt) => {
    const cleanedAlt = alt.replace(/[\[\]"]+/g, ' ').replace(/\s+/g, ' ').trim();
    return /[a-z0-9]/i.test(cleanedAlt) ? match : '![](';
  });
}

function normalizeMarkdown(value) {
  return normalizeImageAltText(value || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/(^|\n)\*{4,}(?=\S)/g, '$1')
    .replace(/([.!?:])\*{4,}(?=\s|$)/g, '$1')
    .replace(/\*{4,}(?=\n|$)/g, '')
    .replace(/(\*\*[^*\n]+[.!?:]\*\*)(?=\S)/g, '$1 ')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizePlainText(value) {
  return (value || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function dedupeParagraphs(paragraphs) {
  const seen = new Set();
  const unique = [];

  for (const paragraph of paragraphs) {
    const normalized = normalizeText(paragraph);
    if (!normalized || seen.has(normalized)) {
      continue;
    }
    seen.add(normalized);
    unique.push(paragraph);
  }

  return unique;
}

function extractBetween(html, startMarker, endMarker) {
  const start = html.indexOf(startMarker);
  if (start === -1) return null;
  const end = html.indexOf(endMarker, start);
  if (end === -1) return null;
  return html.slice(start, end);
}

function extractSection(html, startMarker, endMarker, label) {
  const section = extractBetween(html, startMarker, endMarker);
  if (!section) throw new Error(`Missing section: ${label}`);
  return section;
}

function extractRichText(section, label) {
  const match = section.match(/<div class="[^"]*w-richtext[^"]*">([\s\S]*?)<\/div>/i);
  if (!match) throw new Error(`Missing richtext block: ${label}`);
  return match[1];
}

function richtextToMarkdown(fragment) {
  const blocks = [];
  const matches = fragment.matchAll(/<(p|h2|h3|h4|li)[^>]*>([\s\S]*?)<\/\1>/gi);

  for (const match of matches) {
    const kind = match[1].toLowerCase();
    const text = cleanInline(match[2]);
    if (!text) continue;

    if (kind === 'li') {
      const last = blocks.at(-1);
      if (last?.type === 'list') {
        last.items.push(text);
      } else {
        blocks.push({ type: 'list', items: [text] });
      }
      continue;
    }

    if (kind === 'h2' || kind === 'h3') {
      blocks.push({ type: 'heading', text });
      continue;
    }

    if (kind === 'h4') {
      blocks.push({ type: 'subheading', text });
      continue;
    }

    blocks.push({ type: 'paragraph', text });
  }

  return blocks
    .map((block) => {
      if (block.type === 'list') {
        return block.items.map((item) => `- ${item}`).join('\n');
      }
      if (block.type === 'heading') {
        return `### ${block.text}`;
      }
      if (block.type === 'subheading') {
        return `#### ${block.text}`;
      }
      return block.text;
    })
    .join('\n\n')
    .trim();
}

function markdownToParagraphs(markdown) {
  return dedupeParagraphs(
    markdown
      .split(/\n\n+/)
      .map((section) => section.trim())
      .filter(Boolean)
  );
}

function getSourceUrls(pattern) {
  const shapeofUrl = pattern.sourceUrl?.includes('shapeof.ai')
    ? pattern.sourceUrl
    : pattern.sources?.find((source) => source?.url?.includes('shapeof.ai'))?.url;
  const aiuxUrl = pattern.sources?.find((source) => source?.url?.includes('aiuxpatterns.com'))?.url;
  return { shapeofUrl, aiuxUrl };
}

function extractAiuxSectionHtml(html, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<h5[^>]*>\\s*${escapedHeading}\\s*<\\/h5>([\\s\\S]*?)(?=<h5|Made by the AI|<footer|<\\/main>|<\\/body>)`, 'i');
  const match = html.match(pattern);
  return match?.[1] ?? '';
}

function extractAiuxParagraphs(fragment) {
  const paragraphs = [];
  for (const match of fragment.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)) {
    const text = cleanInline(match[1]);
    if (text) {
      paragraphs.push(text);
    }
  }
  return dedupeParagraphs(paragraphs);
}

function buildMoreBlock(baseMarkdown, extraParagraphs) {
  if (extraParagraphs.length === 0) {
    return normalizeMarkdown(baseMarkdown);
  }

  const baseNormalized = normalizeText(baseMarkdown);
  const newParagraphs = extraParagraphs.filter((paragraph) => !baseNormalized.includes(normalizeText(paragraph)));
  if (newParagraphs.length === 0) {
    return normalizeMarkdown(baseMarkdown);
  }

  return normalizeMarkdown(`${baseMarkdown}\n\n**More**\n\n${newParagraphs.join('\n\n')}`);
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

async function mergePattern(pattern) {
  const { shapeofUrl, aiuxUrl } = getSourceUrls(pattern);
  if (!shapeofUrl || !aiuxUrl) {
    return false;
  }

  const [shapeofHtml, aiuxHtml] = await Promise.all([
    fetchHtml(shapeofUrl),
    fetchHtml(aiuxUrl),
  ]);

  const descriptionSection = extractSection(shapeofHtml, '<div id="description"', '<div id="common-best-practices"', 'description');
  const designSection = extractSection(shapeofHtml, '<div id="common-best-practices"', '<div id="similar-patterns"', 'design');

  const sourceDescription = richtextToMarkdown(extractRichText(descriptionSection, 'description'));
  const sourceDesign = richtextToMarkdown(extractRichText(designSection, 'design'));

  const aiuxOverview = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'Overview'));
  const aiuxArchetype = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'User Archetype'));
  const aiuxConsiderations = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'Considerations'));

  pattern.content.description = buildMoreBlock(sourceDescription, aiuxOverview);
  pattern.content.designConsiderations = buildMoreBlock(sourceDesign, aiuxConsiderations);
  if (aiuxArchetype.length > 0) {
    pattern.content.userArchetype = normalizePlainText(aiuxArchetype.join(' '));
  }

  return true;
}

async function main() {
  const source = JSON.parse(readFileSync(PATTERNS_PATH, 'utf8'));
  let updated = 0;

  for (const pattern of source.patterns) {
    const isDualSource = Array.isArray(pattern.sources)
      && pattern.sources.some((sourceItem) => sourceItem?.url?.includes('shapeof.ai'))
      && pattern.sources.some((sourceItem) => sourceItem?.url?.includes('aiuxpatterns.com'));

    if (!isDualSource) {
      continue;
    }

    const changed = await mergePattern(pattern);
    if (changed) {
      updated += 1;
      process.stdout.write(`[merged] ${pattern.id}\n`);
    }
  }

  writeFileSync(PATTERNS_PATH, `${JSON.stringify(source, null, 2)}\n`);
  process.stdout.write(`\nupdated=${updated}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});