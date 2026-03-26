import { getCategories } from "@/lib/patternRepository";

export const dynamic = "force-static";

export async function GET() {
  const categories = await getCategories();
  return Response.json({
    categories,
    total: categories.length,
  });
}
