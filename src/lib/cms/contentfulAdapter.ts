import type { Category, Pattern } from "@/lib/patterns";
import type { ICMSAdapter } from "@/lib/cms/adapter";

/**
 * Contentful CMS Adapter (Template)
 * This is a template for connecting to Contentful.
 * To use this, set CMS_PROVIDER=contentful and provide CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN
 *
 * Implementation steps:
 * 1. Install: npm install contentful
 * 2. Set environment variables in .env.local
 * 3. Map Contentful content types to Category and Pattern interfaces
 * 4. Implement the adapter methods below
 */
/* eslint-disable @typescript-eslint/no-unused-vars */
export class ContentfulAdapter implements ICMSAdapter {
  private spaceId: string;
  private accessToken: string;

  constructor(spaceId: string, accessToken: string) {
    this.spaceId = spaceId;
    this.accessToken = accessToken;
  }

  async getCategories(): Promise<Category[]> {
    // TODO: Implement Contentful API call
    // const response = await fetch(`https://cdn.contentful.com/spaces/${this.spaceId}/entries?content_type=category`, {
    //   headers: { Authorization: `Bearer ${this.accessToken}` }
    // });
    // Map response.items to Category[]
    throw new Error("ContentfulAdapter not yet implemented. Install contentful SDK, add env vars, and implement this method.");
  }

  async getCategoryById(_categoryId: string): Promise<Category | undefined> {
    // TODO: Implement Contentful API call
    throw new Error("ContentfulAdapter not yet implemented");
  }

  async getPatterns(): Promise<Pattern[]> {
    // TODO: Implement Contentful API call
    throw new Error("ContentfulAdapter not yet implemented");
  }

  async getPatternById(_patternId: string): Promise<Pattern | undefined> {
    // TODO: Implement Contentful API call
    throw new Error("ContentfulAdapter not yet implemented");
  }

  async getPatternsByCategory(_categoryId: string): Promise<Pattern[]> {
    // TODO: Implement Contentful API call with query filters
    throw new Error("ContentfulAdapter not yet implemented");
  }

  async getPatternWithCategory(_patternId: string): Promise<{ pattern: Pattern; category: Category } | undefined> {
    // TODO: Implement Contentful API call with relates query
    throw new Error("ContentfulAdapter not yet implemented");
  }

  getName(): string {
    return "ContentfulAdapter";
  }

  async isHealthy(): Promise<boolean> {
    try {
      // TODO: Make a simple health check call to Contentful
      return true;
    } catch {
      return false;
    }
  }
}
