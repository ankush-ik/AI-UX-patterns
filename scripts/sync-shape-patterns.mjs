import { readFileSync, writeFileSync } from 'node:fs';

const slugToCategory = new Map([
  ['action-plan', 'governors'],
  ['branches', 'governors'],
  ['citations', 'governors'],
  ['controls', 'governors'],
  ['cost-estimates', 'governors'],
  ['draft-mode', 'governors'],
  ['memory', 'governors'],
  ['references', 'governors'],
  ['sample-response', 'governors'],
  ['shared-vision', 'governors'],
  ['stream-of-thought', 'governors'],
  ['variations', 'governors'],
  ['verification', 'governors'],
  ['caveat', 'trust-builders'],
  ['consent', 'trust-builders'],
  ['data-ownership', 'trust-builders'],
  ['disclosure', 'trust-builders'],
  ['footprints', 'trust-builders'],
  ['incognito-mode', 'trust-builders'],
  ['watermark', 'trust-builders'],
  ['avatar', 'identifiers'],
  ['color', 'identifiers'],
  ['iconography', 'identifiers'],
  ['name', 'identifiers'],
  ['personality', 'identifiers'],
]);

const sourcePath = 'src/content/patterns.json';
const source = JSON.parse(readFileSync(sourcePath, 'utf8'));
const existingIds = new Set(source.patterns.map((pattern) => pattern.id));
const replacementIds = new Set(slugToCategory.keys());
const validRelatedIds = new Set([...existingIds, ...replacementIds]);

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
    .replaceAll('&#x60;', '`')
    .replaceAll('&#x2F;', '/')
    .replaceAll('&#x3A;', ':')
    .replaceAll('&#x3B;', ';')
    .replaceAll('&#x3D;', '=')
    .replaceAll('&#x2B;', '+')
    .replaceAll('&#x2019;', "'")
    .replaceAll('&#8217;', "'")
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
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/gi, (_, inner) => `__BOLD_START__${cleanInline(inner)}__BOLD_END__`)
      .replace(/<em[^>]*>([\s\S]*?)<\/em>/gi, (_, inner) => cleanInline(inner))
      .replace(/<br\s*\/?>/gi, ' ')
      .replace(/<[^>]+>/g, '')
  )
    .replaceAll('‍', '')
    .replaceAll('__BOLD_START__', '**')
    .replaceAll('__BOLD_END__', '**')
    .replace(/\s+/g, ' ')
    .replace(/\*\*\*\*/g, '')
    .replace(/([^\s(\[{])\*\*([^*]+)\*\*/g, '$1 **$2**')
    .replace(/\*\*([^*]+)\*\*(?=[A-Za-z0-9])/g, '**$1** ')
    .trim();
}

function richtextToMarkdown(fragment) {
  const blocks = [];
  const matches = fragment.matchAll(/<(p|h3|li)[^>]*>([\s\S]*?)<\/\1>/gi);

  for (const match of matches) {
    const kind = match[1].toLowerCase();
    const text = cleanInline(match[2]);

    if (!text) {
      continue;
    }

    if (kind === 'li') {
      const last = blocks.at(-1);
      if (last?.type === 'list') {
        last.items.push(text);
      } else {
        blocks.push({ type: 'list', items: [text] });
      }
      continue;
    }

    if (kind === 'h3') {
      blocks.push({ type: 'heading', text });
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

      return block.text;
    })
    .join('\n\n')
    .trim();
}

function extract(html, pattern, label) {
  const match = html.match(pattern);
  if (!match) {
    throw new Error(`Failed to extract ${label}`);
  }
  return match[1];
}

function extractSection(html, startMarker, endMarker, label) {
  const startIndex = html.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error(`Missing ${label} start marker`);
  }

  const endIndex = html.indexOf(endMarker, startIndex);
  if (endIndex === -1) {
    throw new Error(`Missing ${label} end marker`);
  }

  return html.slice(startIndex, endIndex);
}

async function fetchPattern(slug) {
  const url = `https://www.shapeof.ai/patterns/${slug}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  const html = await response.text();
  const title = cleanInline(extract(html, /<h1 class="pattern-title-small">([\s\S]*?)<\/h1>/i, `${slug} title`));
  const description = cleanInline(extract(html, /<meta content="([^"]+)" name="description"/i, `${slug} description`));

  let thumbnail;
  try {
    thumbnail = extract(html, /<img[^>]+class="content-header-image-img"[^>]+src="([^"]+)"/i, `${slug} thumbnail`);
  } catch {
    thumbnail = extract(html, /<img[^>]+src="([^"]+)"[^>]+class="content-header-image-img"/i, `${slug} thumbnail`);
  }

  const descriptionSection = extractSection(html, '<div id="description"', '<div id="common-best-practices"', `${slug} description section`);
  const descriptionHtml = extract(descriptionSection, /<div class="[^"]*w-richtext[^"]*">([\s\S]*?)<\/div>/i, `${slug} description html`);

  const designSection = extractSection(html, '<div id="common-best-practices"', '<div id="similar-patterns"', `${slug} design section`);
  const designHtml = extract(designSection, /<div class="[^"]*w-richtext[^"]*">([\s\S]*?)<\/div>/i, `${slug} design html`);

  const relatedSection = extractSection(html, '<div id="similar-patterns"', '<div id="pattern-examples"', `${slug} related section`);
  const relatedPatterns = [...relatedSection.matchAll(/href="\/patterns\/([^"]+)"/g)]
    .map((match) => match[1])
    .filter((relatedSlug, index, list) => relatedSlug !== slug && list.indexOf(relatedSlug) === index)
    .filter((relatedSlug) => validRelatedIds.has(relatedSlug));

  const examples = [...html.matchAll(/<div role="listitem" class="pattern-lightbox-single-wrap w-dyn-item">[\s\S]*?<img src="([^"]+)"[\s\S]*?<div class="pattern-lightbox-description w-richtext">([\s\S]*?)<\/div>\s*<\/div>/gi)]
    .map((match) => ({
      image: match[1],
      description: cleanInline(match[2]),
    }));

  return {
    id: slug,
    title,
    description,
    thumbnail,
    categoryId: slugToCategory.get(slug),
    sourceUrl: url,
    content: {
      description: richtextToMarkdown(descriptionHtml),
      designConsiderations: richtextToMarkdown(designHtml),
      relatedPatterns,
      examples,
    },
  };
}

async function main() {
  const replacements = new Map();

  for (const slug of slugToCategory.keys()) {
    const pattern = await fetchPattern(slug);
    replacements.set(slug, pattern);
    process.stdout.write(`Synced ${slug}\n`);
  }

  source.patterns = source.patterns.map((pattern) => replacements.get(pattern.id) ?? pattern);
  writeFileSync(sourcePath, `${JSON.stringify(source, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
