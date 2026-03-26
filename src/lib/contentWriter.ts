import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Pattern } from "@/lib/patterns";

export const CONTENT_FILE = path.join(process.cwd(), "src/content/patterns.json");

export async function readContent() {
  const raw = await readFile(CONTENT_FILE, "utf-8");
  return JSON.parse(raw) as { categories: unknown[]; patterns: Pattern[] };
}

export async function writeContent(data: { categories: unknown[]; patterns: Pattern[] }) {
  await writeFile(CONTENT_FILE, JSON.stringify(data, null, 2), "utf-8");
}
