import type { Pattern } from "@/lib/patterns";
import { readContent, writeContent } from "@/lib/contentWriter";
import { resetCache } from "@/lib/patternRepository";

/**
 * PATCH /api/patterns/[id]/edit
 * Partially update a pattern's fields in patterns.json
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  let body: Partial<Pattern>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const data = await readContent();
  const index = data.patterns.findIndex((p) => p.id === id);

  if (index === -1) {
    return Response.json({ error: "Pattern not found" }, { status: 404 });
  }

  // Merge top-level fields; merge content sub-object if provided
  const existing = data.patterns[index];
  const updated: Pattern = {
    ...existing,
    ...body,
    content: body.content
      ? { ...existing.content, ...body.content }
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
