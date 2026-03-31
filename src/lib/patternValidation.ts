import { hasPatternSource, type Category, type Pattern } from "@/lib/patterns";
import {
  getCategories,
  getPatternById,
  getPatternReferenceCounts,
  getPatterns,
} from "@/lib/patternRepository";

export interface CategoryHealth {
  category: Category;
  patternCount: number;
  withExamplesCount: number;
  withSourceCount: number;
}

export interface RelatedPatternIssue {
  patternId: string;
  missingRelatedPatternId: string;
}

export interface ContentReport {
  totalCategories: number;
  totalPatterns: number;
  patternsWithoutExamples: Pattern[];
  patternsWithoutSourceUrl: Pattern[];
  patternsWithoutRelatedPatterns: Pattern[];
  orphanPatterns: Pattern[];
  brokenRelatedPatterns: RelatedPatternIssue[];
  duplicatePatternIds: string[];
  categoryHealth: CategoryHealth[];
  mostReferencedPatterns: Array<{
    pattern: Pattern;
    count: number;
  }>;
}

export async function getContentReport(): Promise<ContentReport> {
  const categories = await getCategories();
  const patterns = await getPatterns();
  const referenceCounts = await getPatternReferenceCounts();
  const seenIds = new Set<string>();
  const duplicateIds = new Set<string>();
  const brokenRelatedPatterns: RelatedPatternIssue[] = [];

  for (const pattern of patterns) {
    if (seenIds.has(pattern.id)) {
      duplicateIds.add(pattern.id);
    }

    seenIds.add(pattern.id);

    for (const relatedPatternId of pattern.content.relatedPatterns) {
      const relatedPattern = await getPatternById(relatedPatternId);
      if (!relatedPattern) {
        brokenRelatedPatterns.push({
          patternId: pattern.id,
          missingRelatedPatternId: relatedPatternId,
        });
      }
    }
  }

  const patternsWithoutExamples = patterns.filter(
    (pattern) => pattern.content.examples.length === 0
  );
  const patternsWithoutSourceUrl = patterns.filter(
    (pattern) => !hasPatternSource(pattern)
  );
  const patternsWithoutRelatedPatterns = patterns.filter(
    (pattern) => pattern.content.relatedPatterns.length === 0
  );
  const orphanPatterns = patterns.filter(
    (pattern) => (referenceCounts.get(pattern.id) ?? 0) === 0
  );

  const categoryHealth = categories.map((category) => {
    const categoryPatterns = patterns.filter(
      (pattern) => pattern.categoryId === category.id
    );

    return {
      category,
      patternCount: categoryPatterns.length,
      withExamplesCount: categoryPatterns.filter(
        (pattern) => pattern.content.examples.length > 0
      ).length,
      withSourceCount: categoryPatterns.filter(
        (pattern) => hasPatternSource(pattern)
      )
        .length,
    };
  });

  const mostReferencedPatterns = [...referenceCounts.entries()]
    .map(async ([patternId, count]) => {
      const pattern = await getPatternById(patternId);
      return pattern ? { pattern, count } : null;
    });

  // Resolve all promises
  const resolvedReferences = await Promise.all(mostReferencedPatterns);
  const topReferences = resolvedReferences
    .filter((entry): entry is { pattern: Pattern; count: number } => Boolean(entry))
    .sort((left, right) => right.count - left.count)
    .slice(0, 8);

  return {
    totalCategories: categories.length,
    totalPatterns: patterns.length,
    patternsWithoutExamples,
    patternsWithoutSourceUrl,
    patternsWithoutRelatedPatterns,
    orphanPatterns,
    brokenRelatedPatterns,
    duplicatePatternIds: [...duplicateIds],
    categoryHealth,
    mostReferencedPatterns: topReferences,
  };
}
