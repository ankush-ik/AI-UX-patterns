import contentData from "@/content/patterns.json";
import type { Category, Pattern } from "@/lib/patterns";
import type { ICMSAdapter, PatternContentSnapshot } from "@/lib/cms/adapter";

/**
 * Local JSON File Adapter
 * Loads pattern content from src/content/patterns.json
 * Fast, static, no external dependencies - good for local development and static sites
 * Note: Loads synchronously since the data is embedded in the build
 */
export class LocalJsonAdapter implements ICMSAdapter {
  private snapshot: PatternContentSnapshot | null = null;
  private patternIndex: Map<string, Pattern> | null = null;
  private categoryIndex: Map<string, Category> | null = null;

  private loadSnapshot(): PatternContentSnapshot {
    if (this.snapshot) {
      return this.snapshot;
    }

    const data = contentData as { categories: Category[]; patterns: Pattern[] };
    this.snapshot = {
      categories: data.categories,
      patterns: data.patterns,
      timestamp: Date.now(),
      source: this.getName(),
    };

    // Build indices for fast lookups
    this.patternIndex = new Map(this.snapshot.patterns.map((p) => [p.id, p]));
    this.categoryIndex = new Map(this.snapshot.categories.map((c) => [c.id, c]));

    return this.snapshot;
  }

  async getCategories(): Promise<Category[]> {
    const snapshot = this.loadSnapshot();
    return snapshot.categories;
  }

  async getCategoryById(categoryId: string): Promise<Category | undefined> {
    this.loadSnapshot();
    return this.categoryIndex?.get(categoryId);
  }

  async getPatterns(): Promise<Pattern[]> {
    const snapshot = this.loadSnapshot();
    return snapshot.patterns;
  }

  async getPatternById(patternId: string): Promise<Pattern | undefined> {
    this.loadSnapshot();
    return this.patternIndex?.get(patternId);
  }

  async getPatternsByCategory(categoryId: string): Promise<Pattern[]> {
    const patterns = await this.getPatterns();
    return patterns.filter((p) => p.categoryId === categoryId);
  }

  async getPatternWithCategory(patternId: string): Promise<{ pattern: Pattern; category: Category } | undefined> {
    const pattern = await this.getPatternById(patternId);
    if (!pattern) return undefined;

    const category = await this.getCategoryById(pattern.categoryId);
    if (!category) return undefined;

    return { pattern, category };
  }

  getName(): string {
    return "LocalJsonAdapter";
  }

  async isHealthy(): Promise<boolean> {
    try {
      const snapshot = this.loadSnapshot();
      return snapshot.categories.length > 0 && snapshot.patterns.length > 0;
    } catch {
      return false;
    }
  }
}
