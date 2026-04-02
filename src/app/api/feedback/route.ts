import { readFeedback, writeFeedback } from "@/lib/contentWriter";
import { resetCache } from "@/lib/patternRepository";
import type { PatternFeedback } from "@/lib/patterns";

export const dynamic = "force-dynamic";

export async function GET() {
  const feedback = await readFeedback();
  return Response.json({ feedback, total: feedback.length });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  const { patternId, rating, comment } = body as {
    patternId?: string;
    rating?: string;
    comment?: string;
  };

  if (!patternId || typeof patternId !== "string") {
    return Response.json({ error: "patternId is required" }, { status: 400 });
  }

  if (rating !== "helpful" && rating !== "not-helpful") {
    return Response.json(
      { error: 'rating must be "helpful" or "not-helpful"' },
      { status: 400 }
    );
  }

  const trimmedComment = typeof comment === "string" ? comment.trim().slice(0, 2000) : undefined;

  const entry: PatternFeedback = {
    id: crypto.randomUUID(),
    patternId,
    rating,
    comment: trimmedComment || undefined,
    createdAt: new Date().toISOString(),
  };

  const feedback = await readFeedback();
  feedback.push(entry);
  await writeFeedback(feedback);
  resetCache();

  return Response.json({ feedback: entry }, { status: 201 });
}
