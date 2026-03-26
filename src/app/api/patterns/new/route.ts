import type { Pattern } from "@/lib/patterns";
import { readContent, writeContent } from "@/lib/contentWriter";
import { resetCache } from "@/lib/patternRepository";

/**
 * POST /api/patterns/new
 * Add a new pattern to patterns.json
 */
export async function POST(request: Request) {
  let body: Pattern;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.id || !body.title || !body.categoryId) {
    return Response.json({ error: "id, title, and categoryId are required" }, { status: 400 });
  }

  // Sanitize id to a valid slug
  const id = body.id
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const data = await readContent();

  if (data.patterns.some((p) => p.id === id)) {
    return Response.json({ error: `Pattern with id "${id}" already exists` }, { status: 409 });
  }

  const newPattern: Pattern = {
    id,
    title: body.title,
    description: body.description ?? "",
    thumbnail: body.thumbnail ?? "",
    categoryId: body.categoryId,
    sourceUrl: body.sourceUrl ?? undefined,
    content: {
      description: body.content?.description ?? "",
      designConsiderations: body.content?.designConsiderations ?? "",
      relatedPatterns: body.content?.relatedPatterns ?? [],
      examples: body.content?.examples ?? [],
    },
  };

  data.patterns.push(newPattern);
  await writeContent(data);
  resetCache();

  return Response.json({ pattern: newPattern }, { status: 201 });
}
