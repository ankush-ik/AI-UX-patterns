import { getCMSAdapter } from "@/lib/cms/manager";
import type { Category, Pattern } from "@/lib/patterns";

export interface PatternWithCategory extends Pattern {
  category: Category;
}

/**
 * Pattern Repository
 * Provides a data access layer abstracted from the underlying CMS provider.
 * All content access goes through the configured CMS adapter (Local JSON, Contentful, Sanity, etc.)
 */

// Note: The following caches are built lazily on first call.
// For static builds, LocalJsonAdapter loads synchronously, so this works fine.
// For dynamic CMS sources (Contentful, Sanity), you may want to implement cache invalidation.
let categoriesCache: Category[] | null = null;
let patternsCache: Pattern[] | null = null;
let patternIndex: Map<string, Pattern> | null = null;
let categoryIndex: Map<string, Category> | null = null;
let cacheLoadPromise: Promise<void> | null = null;

function hasLoadedCache() {
  return Boolean(categoriesCache && patternsCache && patternIndex && categoryIndex);
}

async function loadCache() {
  const adapter = getCMSAdapter();
  const [categories, patterns] = await Promise.all([
    adapter.getCategories(),
    adapter.getPatterns(),
  ]);

  categoriesCache = categories;
  patternsCache = patterns;
  categoryIndex = new Map(categories.map((category) => [category.id, category]));
  patternIndex = new Map(patterns.map((pattern) => [pattern.id, pattern]));
}

async function ensureCacheLoaded() {
  if (hasLoadedCache()) return;

  if (!cacheLoadPromise) {
    cacheLoadPromise = loadCache().finally(() => {
      cacheLoadPromise = null;
    });
  }

  await cacheLoadPromise;
}

export async function getCategories() {
  await ensureCacheLoaded();
  if (!categoriesCache) {
    throw new Error("Failed to load categories");
  }
  return categoriesCache;
}

export async function getCategoryById(categoryId: string) {
  await ensureCacheLoaded();
  if (!categoryIndex) {
    throw new Error("Failed to load categories");
  }
  return categoryIndex.get(categoryId);
}

export async function getPatterns() {
  await ensureCacheLoaded();
  if (!patternsCache) {
    throw new Error("Failed to load patterns");
  }
  return patternsCache;
}

export async function getPatternById(patternId: string) {
  await ensureCacheLoaded();
  if (!patternIndex) {
    throw new Error("Failed to load patterns");
  }
  return patternIndex.get(patternId);
}

export async function getPatternsByCategory(categoryId: string) {
  await ensureCacheLoaded();
  if (!patternsCache) {
    throw new Error("Failed to load patterns");
  }
  return patternsCache.filter((pattern) => pattern.categoryId === categoryId);
}

export async function getPatternWithCategory(patternId: string) {
  const pattern = await getPatternById(patternId);
  if (!pattern) return undefined;

  const category = await getCategoryById(pattern.categoryId);
  if (!category) return undefined;

  return {
    ...pattern,
    category,
  };
}

export async function getPatternsWithCategory() {
  await ensureCacheLoaded();
  if (!patternsCache || !categoryIndex) {
    throw new Error("Failed to load patterns");
  }
  return patternsCache.flatMap((pattern) => {
    const category = categoryIndex?.get(pattern.categoryId);
    return category ? [{ ...pattern, category }] : [];
  });
}

export async function getRelatedPatterns(patternId: string) {
  const pattern = await getPatternById(patternId);
  if (!pattern) {
    return [];
  }

  const relatedPatterns = await Promise.all(
    pattern.content.relatedPatterns.map((relatedPatternId) => getPatternById(relatedPatternId))
  );

  return relatedPatterns.filter((p): p is Pattern => Boolean(p));
}

export async function getPatternReferenceCounts() {
  await ensureCacheLoaded();
  if (!patternsCache) {
    throw new Error("Failed to load patterns");
  }
  const counts = new Map<string, number>();

  for (const pattern of patternsCache) {
    for (const relatedPatternId of pattern.content.relatedPatterns) {
      counts.set(relatedPatternId, (counts.get(relatedPatternId) ?? 0) + 1);
    }
  }

  return counts;
}

export function resetCache() {
  categoriesCache = null;
  patternsCache = null;
  patternIndex = null;
  categoryIndex = null;
  cacheLoadPromise = null;
}
