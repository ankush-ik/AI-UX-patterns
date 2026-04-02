export interface PatternSource {
  name: string;
  url: string;
}

export interface PatternImageExample {
  type?: "image";
  image: string;
  description: string;
  title?: string;
  href?: string;
}

export interface PatternEmbedExample {
  type: "embed";
  description: string;
  title?: string;
  embedUrl: string;
  href?: string;
  provider?: string;
  image?: string;
  aspectRatio?: string;
}

export type PatternExample = PatternImageExample | PatternEmbedExample;

export interface Pattern {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  /** @deprecated Use `sources` for multi-source patterns. Kept for single-source patterns. */
  sourceUrl?: string;
  sources?: PatternSource[];
  searchKeywords?: string[];
  content: {
    description: string;
    designConsiderations: string;
    userArchetype?: string;
    relatedPatterns: string[];
    examples: PatternExample[];
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface PatternFeedback {
  id: string;
  patternId: string;
  rating: "helpful" | "not-helpful";
  comment?: string;
  createdAt: string;
}

type PatternSourceLike = Pick<Pattern, "sourceUrl" | "sources">;

function getLegacySourceName(sourceUrl: string): string {
  const defaultName = "Source";

  try {
    const hostname = new URL(sourceUrl).hostname.toLowerCase();

    if (hostname === "shapeof.ai" || hostname === "www.shapeof.ai") {
      return "Shapeof.ai";
    }

    const normalizedHostname = hostname.replace(/^www\./, "");
    return normalizedHostname || defaultName;
  } catch {
    return defaultName;
  }
}

/**
 * Returns normalized sources while keeping backward compatibility with legacy sourceUrl.
 */
export function getPatternSources(pattern: PatternSourceLike): PatternSource[] {
  const multiSources = (pattern.sources ?? []).filter((source) => {
    return Boolean(source?.url);
  });

  if (multiSources.length > 0) {
    return multiSources;
  }

  if (pattern.sourceUrl) {
    return [
      {
        name: getLegacySourceName(pattern.sourceUrl),
        url: pattern.sourceUrl,
      },
    ];
  }

  return [];
}

export function hasPatternSource(pattern: PatternSourceLike): boolean {
  return getPatternSources(pattern).length > 0;
}

