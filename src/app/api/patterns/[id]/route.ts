import {
  getPatternById,
  getPatternWithCategory,
  getRelatedPatterns,
} from "@/lib/patternRepository";

export const dynamic = "force-static";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(request.url);
  const includeSet = new Set(
    (searchParams.get("include") ?? "")
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );
  const includeRelated = includeSet.has("related");
  const includeCategory = includeSet.has("category");

  const pattern = includeCategory
    ? await getPatternWithCategory(id)
    : await getPatternById(id);

  if (!pattern) {
    return Response.json({ error: "Pattern not found" }, { status: 404 });
  }

  return Response.json({
    pattern,
    relatedPatterns: includeRelated ? await getRelatedPatterns(id) : undefined,
  });
}
