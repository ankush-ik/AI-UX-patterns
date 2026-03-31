import type { Pattern, PatternExample, PatternSource } from "@/lib/patterns";
import { readContent, writeContent } from "@/lib/contentWriter";
import { resetCache } from "@/lib/patternRepository";

function normalizeOptionalString(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function normalizeSources(value: unknown): PatternSource[] | undefined {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const normalized = value
    .map((entry) => {
      if (!entry || typeof entry !== "object") {
        return null;
      }

      const url = normalizeOptionalString((entry as { url?: unknown }).url);
      if (!url) {
        return null;
      }

      return {
        name: normalizeOptionalString((entry as { name?: unknown }).name) ?? "Source",
        url,
      };
    })
    .filter((entry): entry is PatternSource => Boolean(entry));

  return normalized.length > 0 ? normalized : undefined;
}

function normalizeRelatedPatterns(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((entry): entry is string => typeof entry === "string")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function normalizeExamples(value: unknown): PatternExample[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value as PatternExample[];
}

function hasCategoryId(categories: unknown[], categoryId: string): boolean {
  return categories.some((category) => {
    if (!category || typeof category !== "object") {
      return false;
    }

    return (category as { id?: unknown }).id === categoryId;
  });
}

/**
 * PATCH /api/patterns/[id]/edit
 * Partially update a pattern's fields in patterns.json
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = body as Partial<Pattern>;

  if (payload.id && payload.id !== id) {
    return Response.json({ error: "Pattern id is immutable" }, { status: 400 });
  }

  const data = await readContent();
  const index = data.patterns.findIndex((p) => p.id === id);

  if (index === -1) {
    return Response.json({ error: "Pattern not found" }, { status: 404 });
  }

  const normalizedCategoryId =
    "categoryId" in payload ? normalizeOptionalString(payload.categoryId) : undefined;

  if (normalizedCategoryId && !hasCategoryId(data.categories, normalizedCategoryId)) {
    return Response.json({ error: `Unknown categoryId \"${normalizedCategoryId}\"` }, { status: 400 });
  }

  const contentPatch = payload.content
    ? {
      description:
        "description" in payload.content
          ? normalizeOptionalString(payload.content.description) ?? ""
          : undefined,
      designConsiderations:
        "designConsiderations" in payload.content
          ? normalizeOptionalString(payload.content.designConsiderations) ?? ""
          : undefined,
      userArchetype:
        "userArchetype" in payload.content
          ? normalizeOptionalString(payload.content.userArchetype)
          : undefined,
      relatedPatterns:
        "relatedPatterns" in payload.content
          ? normalizeRelatedPatterns(payload.content.relatedPatterns)
          : undefined,
      examples:
        "examples" in payload.content
          ? normalizeExamples(payload.content.examples)
          : undefined,
    }
    : undefined;

  const normalizedPatch: Partial<Pattern> = {
    ...payload,
    title: "title" in payload ? normalizeOptionalString(payload.title) ?? "" : undefined,
    description:
      "description" in payload ? normalizeOptionalString(payload.description) ?? "" : undefined,
    thumbnail: "thumbnail" in payload ? normalizeOptionalString(payload.thumbnail) ?? "" : undefined,
    categoryId: "categoryId" in payload ? normalizedCategoryId ?? "" : undefined,
    sourceUrl:
      "sourceUrl" in payload ? normalizeOptionalString(payload.sourceUrl) : undefined,
    sources: "sources" in payload ? normalizeSources(payload.sources) : undefined,
    content: contentPatch,
  };

  // Merge top-level fields; merge content sub-object if provided
  const existing = data.patterns[index];
  const updated: Pattern = {
    ...existing,
    ...normalizedPatch,
    content: normalizedPatch.content
      ? { ...existing.content, ...normalizedPatch.content }
      : existing.content,
  };

  data.patterns[index] = updated;
  await writeContent(data);
  resetCache();

  return Response.json({ pattern: updated });
}

/**
 * DELETE /api/patterns/[id]/edit
 * Remove a pattern from patterns.json
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const data = await readContent();
  const index = data.patterns.findIndex((p) => p.id === id);

  if (index === -1) {
    return Response.json({ error: "Pattern not found" }, { status: 404 });
  }

  data.patterns.splice(index, 1);
  await writeContent(data);
  resetCache();

  return Response.json({ deleted: id });
}
