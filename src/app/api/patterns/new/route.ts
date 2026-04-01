import type { Pattern, PatternExample, PatternSource } from "@/lib/patterns";
import { readContent, writeContent } from "@/lib/contentWriter";
import { resetCache } from "@/lib/patternRepository";

function mutationsAllowed() {
  if (process.env.ENABLE_ADMIN_MUTATIONS === "true") {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

function slugifyPatternId(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

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
 * POST /api/patterns/new
 * Add a new pattern to patterns.json
 */
export async function POST(request: Request) {
  if (!mutationsAllowed()) {
    return Response.json(
      {
        error:
          "Admin mutations are disabled. Set ENABLE_ADMIN_MUTATIONS=true to enable POST/PATCH/DELETE routes.",
      },
      { status: 503 }
    );
  }

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
  const rawId = normalizeOptionalString(payload.id);
  const title = normalizeOptionalString(payload.title);
  const categoryId = normalizeOptionalString(payload.categoryId);

  if (!rawId || !title || !categoryId) {
    return Response.json({ error: "id, title, and categoryId are required" }, { status: 400 });
  }

  const id = slugifyPatternId(rawId);
  if (!id) {
    return Response.json({ error: "id must contain at least one alphanumeric character" }, { status: 400 });
  }

  const data = await readContent();

  if (!hasCategoryId(data.categories, categoryId)) {
    return Response.json({ error: `Unknown categoryId \"${categoryId}\"` }, { status: 400 });
  }

  if (data.patterns.some((p) => p.id === id)) {
    return Response.json({ error: `Pattern with id "${id}" already exists` }, { status: 409 });
  }

  const sourceUrl = normalizeOptionalString(payload.sourceUrl);
  const sources = normalizeSources(payload.sources);
  const contentInput: Partial<Pattern["content"]> = payload.content ?? {};

  const newPattern: Pattern = {
    id,
    title,
    description: normalizeOptionalString(payload.description) ?? "",
    thumbnail: normalizeOptionalString(payload.thumbnail) ?? "",
    categoryId,
    sourceUrl,
    sources,
    content: {
      description: normalizeOptionalString(contentInput.description) ?? "",
      designConsiderations: normalizeOptionalString(contentInput.designConsiderations) ?? "",
      userArchetype: normalizeOptionalString(contentInput.userArchetype),
      relatedPatterns: normalizeRelatedPatterns(contentInput.relatedPatterns),
      examples: normalizeExamples(contentInput.examples),
    },
  };

  data.patterns.push(newPattern);
  await writeContent(data);
  resetCache();

  return Response.json({ pattern: newPattern }, { status: 201 });
}
