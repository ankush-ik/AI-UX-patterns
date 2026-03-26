export interface Pattern {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  categoryId: string;
  sourceUrl?: string;
  content: {
    description: string;
    designConsiderations: string;
    relatedPatterns: string[];
    relatedPatternDetails?: Record<
      string,
      {
        title?: string;
        description?: string;
      }
    >;
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

