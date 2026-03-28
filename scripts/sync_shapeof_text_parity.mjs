import { readFileSync, writeFileSync } from 'node:fs';

const PATTERNS_PATH = 'src/content/patterns.json';
const AUDIT_PATH = 'scripts/audit_shapeof_parity.output.json';
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
    .replace(/\s+/g, ' ')
    .trim();
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

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

function getFailIds() {
  const report = JSON.parse(readFileSync(AUDIT_PATH, 'utf8'));
  return report.results.filter((result) => result.status === 'fail').map((result) => result.id);
}

function isDualSourcePattern(pattern) {
  return Array.isArray(pattern.sources)
    && pattern.sources.some((source) => source?.url?.includes('shapeof.ai'))
    && pattern.sources.some((source) => source?.url?.includes('aiuxpatterns.com'));
}

async function main() {
  const failIds = new Set(getFailIds());
  const source = JSON.parse(readFileSync(PATTERNS_PATH, 'utf8'));

  let updated = 0;

  for (const pattern of source.patterns) {
    if (!failIds.has(pattern.id)) continue;
    if (isDualSourcePattern(pattern)) {
      process.stdout.write(`[skip] ${pattern.id}: dual-source pattern requires merge flow\n`);
      continue;
    }

    const sourceUrl = pattern.sourceUrl || pattern.sources?.find((s) => s?.url?.includes('shapeof.ai'))?.url;
    if (!sourceUrl || !sourceUrl.includes('shapeof.ai')) continue;

    const html = await fetchHtml(sourceUrl);

    const descriptionSection = extractSection(html, '<div id="description"', '<div id="common-best-practices"', 'description');
    const designSection = extractSection(html, '<div id="common-best-practices"', '<div id="similar-patterns"', 'design');

    const sourceDescription = richtextToMarkdown(extractRichText(descriptionSection, 'description'));
    const sourceDesign = richtextToMarkdown(extractRichText(designSection, 'design'));

    pattern.content.description = sourceDescription;
    pattern.content.designConsiderations = sourceDesign;

    updated += 1;
    process.stdout.write(`[updated] ${pattern.id}\n`);
  }

  writeFileSync(PATTERNS_PATH, `${JSON.stringify(source, null, 2)}\n`);
  process.stdout.write(`\nupdated=${updated}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
