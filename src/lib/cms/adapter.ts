import type { Category, Pattern } from "@/lib/patterns";

/**
 * CMS Adapter Interface
 * Defines the contract that all content sources must implement.
 * This enables easy switching between different CMS providers (JSON, Contentful, Sanity, etc.)
 */
export interface ICMSAdapter {
  /**
   * Get all categories
   */
  getCategories(): Promise<Category[]>;

  /**
   * Get a specific category by ID
   */
  getCategoryById(categoryId: string): Promise<Category | undefined>;

  /**
   * Get all patterns
   */
  getPatterns(): Promise<Pattern[]>;

  /**
   * Get a specific pattern by ID
   */
  getPatternById(patternId: string): Promise<Pattern | undefined>;

  /**
   * Get patterns filtered by category ID
   */
  getPatternsByCategory(categoryId: string): Promise<Pattern[]>;

  /**
   * Get a pattern with its enriched category information
   */
  getPatternWithCategory(patternId: string): Promise<{ pattern: Pattern; category: Category } | undefined>;

  /**
   * Get the name/identifier of this adapter for logging/debugging
   */
  getName(): string;

  /**
   * Health check - verify the adapter can access content
   */
  isHealthy(): Promise<boolean>;
}

/**
 * Content snapshot for caching/precomputation
 */
export interface PatternContentSnapshot {
  categories: Category[];
  patterns: Pattern[];
  timestamp: number; // When this snapshot was created
  source: string; // Which adapter provided this
}
