import type { ICMSAdapter } from "@/lib/cms/adapter";
import { LocalJsonAdapter } from "@/lib/cms/localJsonAdapter";
import { ContentfulAdapter } from "@/lib/cms/contentfulAdapter";

/**
 * CMS Manager
 * Singleton that selects and manages the appropriate CMS adapter
 * based on environment configuration.
 *
 * Environment variables:
 * - CMS_PROVIDER: "local-json" (default) | "contentful" | "sanity"
 * - For Contentful: CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN
 *
 * Note:
 * - "local-json" is the only fully implemented provider in this repository.
 * - "contentful" and "sanity" are scaffolding paths and require implementation.
 */

let instance: ICMSAdapter | null = null;

function normalizeProvider(value: string) {
  const normalized = value.trim().toLowerCase();

  if (normalized === "local_json" || normalized === "localjson") {
    return "local-json";
  }

  return normalized;
}

function createAdapter(): ICMSAdapter {
  const provider = normalizeProvider(process.env.CMS_PROVIDER || "local-json");

  switch (provider) {
    case "local-json":
      return new LocalJsonAdapter();

    case "contentful": {
      const spaceId = process.env.CONTENTFUL_SPACE_ID;
      const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
      if (!spaceId || !accessToken) {
        throw new Error("Missing CONTENTFUL_SPACE_ID or CONTENTFUL_ACCESS_TOKEN environment variables");
      }
      return new ContentfulAdapter(spaceId, accessToken);
    }

    case "sanity":
      throw new Error('Sanity adapter not yet implemented. Use CMS_PROVIDER="local-json" for now.');

    default:
      throw new Error(
        `Unknown CMS provider: ${provider}. Use "local-json" (aliases: local_json, localjson).`
      );
  }
}

/**
 * Get the current CMS adapter instance
 */
export function getCMSAdapter(): ICMSAdapter {
  if (!instance) {
    instance = createAdapter();
  }
  return instance;
}

/**
 * For testing: reset the adapter instance
 */
export function resetAdapter(): void {
  instance = null;
}

/**
 * Get the current provider name for debugging
 */
export function getCurrentProvider(): string {
  return getCMSAdapter().getName();
}
