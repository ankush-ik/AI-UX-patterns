import { readFileSync, writeFileSync } from 'node:fs';

const PATTERNS_PATH = 'src/content/patterns.json';
const OUTPUT_PATH = 'scripts/audit_shapeof_parity.output.json';
const DEFAULT_HEADERS = {
  'user-agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36',
  accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const CORRUPTION_PATTERNS = [
  { kind: 'zero-width-artifacts', regex: /[\u200B-\u200D\uFEFF]/ },
  { kind: 'malformed-image-alt', regex: /!\[\/\]\(/ },
  { kind: 'dangling-bold-markers', regex: /(^|\n)\*{4,}(?=\S)|([.!?:])\*{4,}(?=\s|$)|\*{4,}(?=\n|$)/m },
];

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

function cleanCaptionText(value, fallback = '') {
  const text = cleanInline(value || '').replace(/[\u200B-\u200D\uFEFF]/g, '').trim();

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

function normalizeText(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function containsNormalizedParagraph(markdown, paragraph) {
  return normalizeText(markdown).includes(normalizeText(paragraph));
}

function getWordSet(value) {
  return new Set(normalizeText(value).split(' ').filter((word) => word.length > 2));
}

function headingScore(a, b) {
  const setA = getWordSet(a);
  const setB = getWordSet(b);
  if (setA.size === 0 || setB.size === 0) return 0;

  let overlap = 0;
  for (const word of setA) {
    if (setB.has(word)) overlap += 1;
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
  const srcset = extractAttr(attrs, 'data-srcset') || extractAttr(attrs, 'srcset');
  if (srcset) {
    const first = srcset.split(',').map((part) => part.trim()).find(Boolean);
    if (first) {
      const [candidate] = first.split(/\s+/);
      if (candidate) return candidate;
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
  const segment = extractSection(html, '<div id="description"', '<div id="common-best-practices"', 'description');
  const matcher = /<h([1-4])\b[^>]*>([\s\S]*?)<\/h\1>|<p\b[^>]*>([\s\S]*?)<\/p>|<img\b([^>]*)>/gi;
  const tokens = [];
  const seen = new Set();

  let activeHeading = '';
  let activeParagraph = '';
  let imageOrder = 0;
  let match;
  while ((match = matcher.exec(segment)) !== null) {
    if (match[2] !== undefined) {
      const headingText = cleanInline(match[2]);
      if (headingText) activeHeading = headingText;
      continue;
    }

    if (match[3] !== undefined) {
      const paragraphText = cleanInline(match[3]);
      if (paragraphText) activeParagraph = paragraphText;
      continue;
    }

    if (match[4] !== undefined) {
      const attrs = match[4];
      const source = pickSrcFromAttrs(attrs);
      const imageUrl = normalizeImageUrl(sourceUrl, source);
      if (!imageUrl || !isLikelyContentImage(imageUrl) || seen.has(imageUrl)) {
        continue;
      }

      const alt = cleanInline(extractAttr(attrs, 'alt') || '') || activeHeading || 'Pattern source image';
      const caption = extractCaptionAfterImage(segment, matcher.lastIndex, `${alt} ${activeHeading}`.trim());

      seen.add(imageUrl);
      tokens.push({
        imageUrl,
        headingContext: activeHeading || '(intro)',
        paragraphContext: activeParagraph,
        caption,
        order: imageOrder,
      });
      imageOrder += 1;
    }
  }

  return tokens;
}

function getSourceUrl(pattern) {
  if (Array.isArray(pattern.sources)) {
    const source = pattern.sources.find((item) => item?.url?.includes('shapeof.ai'));
    if (source?.url) return source.url;
  }
  if (pattern.sourceUrl?.includes('shapeof.ai')) return pattern.sourceUrl;
  return null;
}

function getSourceUrls(pattern) {
  const shapeofUrl = getSourceUrl(pattern);
  const aiuxUrl = pattern.sources?.find((item) => item?.url?.includes('aiuxpatterns.com'))?.url || null;
  return { shapeofUrl, aiuxUrl };
}

function splitLines(markdown) {
  return (markdown || '').split('\n').map((line) => line.trim()).filter(Boolean);
}

function getHeadings(markdown) {
  return splitLines(markdown)
    .filter((line) => line.startsWith('### '))
    .map((line) => line.slice(4).trim());
}

function countListItems(markdown) {
  const lines = splitLines(markdown);
  const unordered = lines.filter((line) => /^-\s+/.test(line)).length;
  const ordered = lines.filter((line) => /^\d+\.\s+/.test(line)).length;
  return { unordered, ordered };
}

function getImageHeadingMap(markdown) {
  const lines = (markdown || '').split('\n');
  const map = new Map();
  let activeHeading = '(intro)';

  const findPriorContextLine = (startIndex) => {
    for (let index = startIndex; index >= 0; index -= 1) {
      const line = lines[index].trim();
      if (!line) continue;
      if (line.startsWith('### ') || line.startsWith('#### ') || line.startsWith('![') || /^\*.+\*$/.test(line)) {
        continue;
      }
      return line;
    }
    return '';
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();
    if (trimmed.startsWith('### ')) {
      activeHeading = trimmed.slice(4).trim();
      continue;
    }

    const imageMatch = trimmed.match(/^!\[[^\]]*\]\(([^)]+)\)$/);
    if (imageMatch) {
      const nextLine = lines[index + 1]?.trim() ?? '';
      const captionMatch = nextLine.match(/^\*(.+)\*$/);
      const block = {
        imagePath: imageMatch[1].trim(),
        caption: captionMatch ? captionMatch[1].trim() : '',
        captionNorm: captionMatch ? normalizeText(captionMatch[1]) : '',
        contextLine: findPriorContextLine(index - 1),
      };

      if (!map.has(activeHeading)) {
        map.set(activeHeading, []);
      }
      map.get(activeHeading).push(block);
    }
  }

  return map;
}

function mapSourceImagesToExpectedHeadings(sourceImages, currentHeadings) {
  const expectedByHeading = new Map();

  for (const sourceImage of sourceImages) {
    let bestHeading = '(intro)';
    let bestScore = 0;

    for (const heading of currentHeadings) {
      const score = headingScore(sourceImage.headingContext, heading);
      if (score > bestScore) {
        bestScore = score;
        bestHeading = heading;
      }
    }

    if (!expectedByHeading.has(bestHeading)) {
      expectedByHeading.set(bestHeading, []);
    }
    expectedByHeading.get(bestHeading).push(sourceImage);
  }

  return expectedByHeading;
}

function findOrderedMatches(sourceValues, currentValues) {
  const positions = [];
  const used = new Set();

  for (const sourceValue of sourceValues) {
    if (!sourceValue) continue;
    let foundIndex = -1;

    for (let index = 0; index < currentValues.length; index += 1) {
      if (used.has(index)) continue;
      const candidate = currentValues[index];
      if (!candidate) continue;

      if (candidate.includes(sourceValue) || sourceValue.includes(candidate)) {
        foundIndex = index;
        break;
      }
    }

    if (foundIndex !== -1) {
      positions.push(foundIndex);
      used.add(foundIndex);
    }
  }

  const ordered = positions.every((value, index) => index === 0 || value > positions[index - 1]);
  return {
    matchedCount: positions.length,
    ordered,
    positions,
  };
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

  const seen = new Set();
  return paragraphs.filter((paragraph) => {
    const normalized = normalizeText(paragraph);
    if (!normalized || seen.has(normalized)) {
      return false;
    }
    seen.add(normalized);
    return true;
  });
}

function findCorruptionIssues(sectionName, markdown) {
  return CORRUPTION_PATTERNS
    .filter(({ regex }) => regex.test(markdown || ''))
    .map(({ kind }) => ({ kind, section: sectionName }));
}

async function fetchHtml(url) {
  const response = await fetch(url, { headers: DEFAULT_HEADERS });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.text();
}

function compareHeadings(sourceHeadings, currentHeadings) {
  const missing = [];
  for (const sourceHeading of sourceHeadings) {
    const found = currentHeadings.some((heading) => headingScore(sourceHeading, heading) > 0);
    if (!found) missing.push(sourceHeading);
  }
  return missing;
}

function compareImagePlacement(sourceImages, currentImageMap, currentHeadings) {
  const expectedByHeading = mapSourceImagesToExpectedHeadings(sourceImages, currentHeadings);

  const placementIssues = [];
  for (const [heading, expectedImages] of expectedByHeading.entries()) {
    const expectedCount = expectedImages.length;
    const actualCount = (currentImageMap.get(heading) || []).length;
    if (actualCount < expectedCount) {
      placementIssues.push({
        heading,
        expectedCount,
        actualCount,
        kind: 'missing-or-misplaced-images',
      });
    }
  }

  return { expectedByHeading, placementIssues };
}

function compareImageSequences(sourceImages, currentImageMap, currentHeadings) {
  const expectedByHeading = mapSourceImagesToExpectedHeadings(sourceImages, currentHeadings);
  const issues = [];

  for (const [heading, expectedImages] of expectedByHeading.entries()) {
    if (expectedImages.length <= 1) {
      continue;
    }

    const currentBlocks = currentImageMap.get(heading) || [];
    if (currentBlocks.length <= 1) {
      continue;
    }

    const sourceCaptions = expectedImages
      .map((item) => normalizeText(item.caption || ''))
      .filter((value) => value.length > 0);
    const currentCaptions = currentBlocks
      .map((item) => item.captionNorm)
      .filter((value) => value.length > 0);

    if (sourceCaptions.length > 1 && currentCaptions.length > 1) {
      const captionMatches = findOrderedMatches(sourceCaptions, currentCaptions);
      if (captionMatches.matchedCount >= 2 && !captionMatches.ordered) {
        issues.push({
          kind: 'image-caption-order-mismatch',
          heading,
          positions: captionMatches.positions,
        });
      }
    }

    const sourceContexts = expectedImages
      .map((item) => normalizeText(item.paragraphContext || ''))
      .filter((value) => value.length >= 24);
    const currentContexts = currentBlocks
      .map((item) => normalizeText(item.contextLine || ''))
      .filter((value) => value.length >= 24);

    if (sourceContexts.length > 1 && currentContexts.length > 1) {
      const contextMatches = findOrderedMatches(sourceContexts, currentContexts);
      if (contextMatches.matchedCount >= 2 && !contextMatches.ordered) {
        issues.push({
          kind: 'image-context-order-mismatch',
          heading,
          positions: contextMatches.positions,
        });
      }
    }
  }

  return issues;
}

async function auditPattern(pattern) {
  const { shapeofUrl: sourceUrl, aiuxUrl } = getSourceUrls(pattern);
  if (!sourceUrl) {
    return null;
  }

  const [html, aiuxHtml] = await Promise.all([
    fetchHtml(sourceUrl),
    aiuxUrl ? fetchHtml(aiuxUrl) : Promise.resolve(null),
  ]);
  const descriptionSection = extractSection(html, '<div id="description"', '<div id="common-best-practices"', 'description');
  const designSection = extractSection(html, '<div id="common-best-practices"', '<div id="similar-patterns"', 'design');

  const sourceDescription = richtextToMarkdown(extractRichText(descriptionSection, 'description'));
  const sourceDesign = richtextToMarkdown(extractRichText(designSection, 'design'));

  const currentDescription = pattern.content?.description || '';
  const currentDesign = pattern.content?.designConsiderations || '';

  const sourceDescriptionHeadings = getHeadings(sourceDescription);
  const currentDescriptionHeadings = getHeadings(currentDescription);
  const sourceDesignHeadings = getHeadings(sourceDesign);
  const currentDesignHeadings = getHeadings(currentDesign);

  const missingDescriptionHeadings = compareHeadings(sourceDescriptionHeadings, currentDescriptionHeadings);
  const missingDesignHeadings = compareHeadings(sourceDesignHeadings, currentDesignHeadings);

  const sourceDescriptionLists = countListItems(sourceDescription);
  const currentDescriptionLists = countListItems(currentDescription);
  const sourceDesignLists = countListItems(sourceDesign);
  const currentDesignLists = countListItems(currentDesign);

  const sourceImages = extractSourceImageCandidates(sourceUrl, html);
  const currentImageMap = getImageHeadingMap(currentDescription);
  const { placementIssues } = compareImagePlacement(sourceImages, currentImageMap, currentDescriptionHeadings);
  const sequenceIssues = compareImageSequences(sourceImages, currentImageMap, currentDescriptionHeadings);

  const issues = [];

  issues.push(...findCorruptionIssues('description', currentDescription));
  issues.push(...findCorruptionIssues('designConsiderations', currentDesign));

  if (missingDescriptionHeadings.length > 0) {
    issues.push({ kind: 'missing-description-headings', headings: missingDescriptionHeadings });
  }

  if (missingDesignHeadings.length > 0) {
    issues.push({ kind: 'missing-design-headings', headings: missingDesignHeadings });
  }

  if (currentDescriptionLists.unordered < sourceDescriptionLists.unordered) {
    issues.push({
      kind: 'description-bullets-underrepresented',
      source: sourceDescriptionLists.unordered,
      current: currentDescriptionLists.unordered,
    });
  }

  if (currentDesignLists.unordered < sourceDesignLists.unordered) {
    issues.push({
      kind: 'design-bullets-underrepresented',
      source: sourceDesignLists.unordered,
      current: currentDesignLists.unordered,
    });
  }

  if (currentDescriptionLists.ordered < sourceDescriptionLists.ordered) {
    issues.push({
      kind: 'description-ordered-list-underrepresented',
      source: sourceDescriptionLists.ordered,
      current: currentDescriptionLists.ordered,
    });
  }

  if (placementIssues.length > 0) {
    issues.push({ kind: 'image-placement', details: placementIssues });
  }

  if (sequenceIssues.length > 0) {
    issues.push({ kind: 'image-sequence', details: sequenceIssues });
  }

  if (aiuxHtml) {
    const aiuxOverview = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'Overview'));
    const aiuxConsiderations = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'Considerations'));
    const aiuxArchetype = extractAiuxParagraphs(extractAiuxSectionHtml(aiuxHtml, 'User Archetype'));

    if (aiuxOverview.length > 0 && !/\*\*More\*\*/.test(currentDescription)) {
      issues.push({ kind: 'missing-more-block', section: 'description' });
    }

    if (aiuxConsiderations.length > 0 && !/\*\*More\*\*/.test(currentDesign)) {
      issues.push({ kind: 'missing-more-block', section: 'designConsiderations' });
    }

    const missingOverview = aiuxOverview.filter((paragraph) => !containsNormalizedParagraph(currentDescription, paragraph));
    if (missingOverview.length > 0) {
      issues.push({
        kind: 'missing-aiux-overview-content',
        missingCount: missingOverview.length,
        samples: missingOverview.slice(0, 2),
      });
    }

    const missingConsiderations = aiuxConsiderations.filter((paragraph) => !containsNormalizedParagraph(currentDesign, paragraph));
    if (missingConsiderations.length > 0) {
      issues.push({
        kind: 'missing-aiux-considerations-content',
        missingCount: missingConsiderations.length,
        samples: missingConsiderations.slice(0, 2),
      });
    }

    if (aiuxArchetype.length > 0 && !containsNormalizedParagraph(pattern.content?.userArchetype || '', aiuxArchetype.join(' '))) {
      issues.push({
        kind: 'missing-aiux-user-archetype',
        sample: aiuxArchetype[0],
      });
    }
  }

  const status = issues.length === 0 ? 'pass' : 'fail';

  return {
    id: pattern.id,
    sourceUrl,
    status,
    summary: {
      sourceHeadings: {
        description: sourceDescriptionHeadings.length,
        design: sourceDesignHeadings.length,
      },
      currentHeadings: {
        description: currentDescriptionHeadings.length,
        design: currentDesignHeadings.length,
      },
      sourceImages: sourceImages.length,
      currentInlineImages: Array.from(currentImageMap.values()).reduce((sum, value) => sum + value.length, 0),
    },
    issues,
  };
}

async function main() {
  const source = JSON.parse(readFileSync(PATTERNS_PATH, 'utf8'));
  const shapePatterns = source.patterns.filter((pattern) => Boolean(getSourceUrl(pattern)));

  const results = [];
  for (const pattern of shapePatterns) {
    try {
      const result = await auditPattern(pattern);
      if (result) {
        results.push(result);
        process.stdout.write(`[${result.status}] ${result.id} (${result.issues.length} issue group(s))\n`);
      }
    } catch (error) {
      results.push({
        id: pattern.id,
        sourceUrl: getSourceUrl(pattern),
        status: 'error',
        issues: [{ kind: 'audit-error', message: error.message }],
      });
      process.stdout.write(`[error] ${pattern.id}: ${error.message}\n`);
    }
  }

  const passCount = results.filter((item) => item.status === 'pass').length;
  const failCount = results.filter((item) => item.status === 'fail').length;
  const errorCount = results.filter((item) => item.status === 'error').length;

  const report = {
    generatedAt: new Date().toISOString(),
    total: results.length,
    passCount,
    failCount,
    errorCount,
    results,
  };

  writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`);

  process.stdout.write('\n');
  process.stdout.write(`Audit report written to ${OUTPUT_PATH}\n`);
  process.stdout.write(`total=${report.total} pass=${passCount} fail=${failCount} error=${errorCount}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
