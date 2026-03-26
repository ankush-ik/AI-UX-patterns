import contentData from "@/content/patterns.json";
import type { Category, Pattern } from "@/lib/patterns";

export interface PatternContentSnapshot {
  categories: Category[];
  patterns: Pattern[];
}

const snapshot = contentData as PatternContentSnapshot;

export function getContentSnapshot(): PatternContentSnapshot {
  return snapshot;
}
