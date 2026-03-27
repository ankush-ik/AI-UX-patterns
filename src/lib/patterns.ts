export interface PatternSource {
  name: string;
  url: string;
}

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
    examples: Array<{
      image: string;
      description: string;
    }>;
  };
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

