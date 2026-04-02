import { readFile, writeFile } from "fs/promises";
import path from "path";
import type { Pattern, PatternFeedback } from "@/lib/patterns";

export const CONTENT_FILE = path.join(process.cwd(), "src/content/patterns.json");
export const FEEDBACK_FILE = path.join(process.cwd(), "src/content/feedback.json");

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_REPO = process.env.GITHUB_REPO ?? "ankush-ik/AI-UX-patterns";
const GITHUB_BRANCH = process.env.GITHUB_BRANCH ?? "main";

function useGitHubWriter(): boolean {
  return Boolean(GITHUB_TOKEN);
}

// ─── GitHub Contents API helpers ────────────────────────────────────────────

async function githubRead(filePath: string): Promise<{ content: string; sha: string }> {
  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}?ref=${GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    if (res.status === 404) {
      return { content: "", sha: "" };
    }
    throw new Error(`GitHub API read failed (${res.status}): ${await res.text()}`);
  }

  const json = await res.json();
  const decoded = Buffer.from(json.content, "base64").toString("utf-8");
  return { content: decoded, sha: json.sha };
}

async function githubWrite(filePath: string, content: string, message: string): Promise<void> {
  const { sha } = await githubRead(filePath);
  const encoded = Buffer.from(content).toString("base64");

  const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/${filePath}`;
  const body: Record<string, string> = {
    message,
    content: encoded,
    branch: GITHUB_BRANCH,
  };
  if (sha) {
    body.sha = sha;
  }

  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    throw new Error(`GitHub API write failed (${res.status}): ${await res.text()}`);
  }
}

// ─── Content (patterns.json) ────────────────────────────────────────────────

export async function readContent() {
  if (useGitHubWriter()) {
    const { content } = await githubRead("src/content/patterns.json");
    if (!content) throw new Error("patterns.json not found in repo");
    return JSON.parse(content) as { categories: unknown[]; patterns: Pattern[] };
  }
  const raw = await readFile(CONTENT_FILE, "utf-8");
  return JSON.parse(raw) as { categories: unknown[]; patterns: Pattern[] };
}

export async function writeContent(data: { categories: unknown[]; patterns: Pattern[] }) {
  const json = JSON.stringify(data, null, 2);
  if (useGitHubWriter()) {
    await githubWrite("src/content/patterns.json", json, "Update patterns.json via admin");
    return;
  }
  await writeFile(CONTENT_FILE, json, "utf-8");
}

// ─── Feedback (feedback.json) ───────────────────────────────────────────────

export async function readFeedback(): Promise<PatternFeedback[]> {
  if (useGitHubWriter()) {
    const { content } = await githubRead("src/content/feedback.json");
    if (!content) return [];
    return JSON.parse(content) as PatternFeedback[];
  }
  try {
    const raw = await readFile(FEEDBACK_FILE, "utf-8");
    return JSON.parse(raw) as PatternFeedback[];
  } catch {
    return [];
  }
}

export async function writeFeedback(data: PatternFeedback[]): Promise<void> {
  const json = JSON.stringify(data, null, 2);
  if (useGitHubWriter()) {
    await githubWrite("src/content/feedback.json", json, "Update feedback via site");
    return;
  }
  await writeFile(FEEDBACK_FILE, json, "utf-8");
}
