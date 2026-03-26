import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Pattern } from "@/lib/patterns";

const CONTENT_FILE = path.join(process.cwd(), "src/content/patterns.json");

async function readContent() {
  const raw = await readFile(CONTENT_FILE, "utf-8");
  return JSON.parse(raw) as { categories: unknown[]; patterns: Pattern[] };
}

async function writeContent(data: { categories: unknown[]; patterns: Pattern[] }) {
  await writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
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

  return Response.json({ deleted: id });
}
