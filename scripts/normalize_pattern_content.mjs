import { readFileSync, writeFileSync } from 'node:fs';

const PATTERNS_PATH = 'src/content/patterns.json';

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

function main() {
  const source = JSON.parse(readFileSync(PATTERNS_PATH, 'utf8'));
  let updated = 0;

  for (const pattern of source.patterns) {
    const nextDescription = normalizeMarkdown(pattern.content?.description || '');
    const nextDesign = normalizeMarkdown(pattern.content?.designConsiderations || '');
    const nextArchetype = normalizePlainText(pattern.content?.userArchetype || '');

    if (pattern.content?.description !== nextDescription) {
      pattern.content.description = nextDescription;
      updated += 1;
    }

    if (pattern.content?.designConsiderations !== nextDesign) {
      pattern.content.designConsiderations = nextDesign;
      updated += 1;
    }

    if ((pattern.content?.userArchetype || '') !== nextArchetype) {
      pattern.content.userArchetype = nextArchetype;
      updated += 1;
    }
  }

  writeFileSync(PATTERNS_PATH, `${JSON.stringify(source, null, 2)}\n`);
  process.stdout.write(`updated=${updated}\n`);
}

main();