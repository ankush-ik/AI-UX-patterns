import {
  getPatternWithCategory,
  getPatterns,
  getPatternsByCategory,
} from "@/lib/patternRepository";

export const dynamic = "force-static";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("q")?.trim().toLowerCase();
  const includeSet = new Set(
    (searchParams.get("include") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const includeCategory = includeSet.has("category");

  let patterns = categoryId ? await getPatternsByCategory(categoryId) : await getPatterns();

  if (searchQuery) {
    patterns = patterns.filter((pattern) =>
      [
        pattern.title,
        pattern.description,
        pattern.categoryId,
        pattern.content.description,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery)
    );
  }

  if (includeCategory) {
    const patternsWithCategory = await Promise.all(
      patterns.map(async (pattern) => {
        const entry = await getPatternWithCategory(pattern.id);
        return entry ? entry : null;
      })
    );
    return Response.json({
      patterns: patternsWithCategory.filter(Boolean),
      total: patternsWithCategory.filter(Boolean).length,
    });
  }

  return Response.json({
    patterns,
    total: patterns.length,
  });
}
