import { getContentReport } from "@/lib/patternValidation";

export const dynamic = "force-static";

export async function GET() {
  const report = await getContentReport();
  return Response.json({
    report,
  });
}
