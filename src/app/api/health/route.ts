import { getCurrentProvider, getCMSAdapter } from "@/lib/cms/manager";

/**
 * Health Check Endpoint
 * Returns information about the connected CMS provider
 * GET /api/health
 */
export async function GET() {
  try {
    const adapter = getCMSAdapter();
    const provider = getCurrentProvider();
    const isHealthy = await adapter.isHealthy();

    return Response.json(
      {
        status: isHealthy ? "healthy" : "unhealthy",
        provider,
        timestamp: new Date().toISOString(),
      },
      { status: isHealthy ? 200 : 503 }
    );
  } catch (error) {
    return Response.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 503 }
    );
  }
}
