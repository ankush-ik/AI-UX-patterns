import {
  getCategoryById,
  getPatternById,
  getRelatedPatterns,
} from "@/lib/patternRepository";
import { PatternDetailClient } from "@/components/PatternDetailClient";
import { notFound } from "next/navigation";

export default async function PatternDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const patternId = params.id;

  const pattern = await getPatternById(patternId);
  const category = pattern ? await getCategoryById(pattern.categoryId) : null;
  const relatedPatterns = pattern ? await getRelatedPatterns(patternId) : [];

  if (!pattern || !category) {
    notFound();
  }

  return (
    <PatternDetailClient
      pattern={pattern}
      category={category}
      relatedPatterns={relatedPatterns}
    />
  );
}
