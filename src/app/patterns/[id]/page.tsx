import {
  getCategoryById,
  getPatternById,
  getRelatedPatterns,
} from "@/lib/patternRepository";
import { PatternDetailClient } from "@/components/PatternDetailClient";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata(props: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await props.params;
  const pattern = await getPatternById(id);
  if (!pattern) return {};

  const category = await getCategoryById(pattern.categoryId);

  return {
    title: pattern.title,
    description: pattern.description,
    openGraph: {
      title: pattern.title,
      description: pattern.description,
      type: "article",
      ...(category && { tags: [category.name, "AI UX", "Design Pattern"] }),
    },
    twitter: {
      card: "summary_large_image",
      title: pattern.title,
      description: pattern.description,
    },
  };
}

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
