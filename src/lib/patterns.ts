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

