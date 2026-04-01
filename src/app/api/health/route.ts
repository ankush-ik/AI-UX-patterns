import { getCurrentProvider, getCMSAdapter } from "@/lib/cms/manager";

function mutationsAllowed() {
  if (process.env.ENABLE_ADMIN_MUTATIONS === "true") {
    return true;
  }

  return process.env.NODE_ENV !== "production";
}

function hasAdminCredentialsConfigured() {
  return Boolean(process.env.ADMIN_USERNAME && process.env.ADMIN_PASSWORD);
}

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
    const isProduction = process.env.NODE_ENV === "production";
    const adminCredentialsConfigured = hasAdminCredentialsConfigured();
    const adminMutationsEnabled = mutationsAllowed();
    const configuredProvider = (process.env.CMS_PROVIDER || "local-json").toLowerCase();
    const warnings: string[] = [];

    if (isProduction && !adminCredentialsConfigured) {
      warnings.push("Missing ADMIN_USERNAME or ADMIN_PASSWORD in production.");
    }

    if (isProduction && adminMutationsEnabled && configuredProvider === "local-json") {
      warnings.push(
        "ENABLE_ADMIN_MUTATIONS=true with CMS_PROVIDER=local-json may lead to non-durable writes in serverless deployments."
      );
    }

    const hasBlockingIssue = !isHealthy || (isProduction && !adminCredentialsConfigured);

    return Response.json(
      {
        status: hasBlockingIssue ? "unhealthy" : warnings.length > 0 ? "degraded" : "healthy",
        provider,
        environment: process.env.NODE_ENV || "unknown",
        adminCredentialsConfigured,
        adminMutationsEnabled,
        warnings,
        timestamp: new Date().toISOString(),
      },
      { status: hasBlockingIssue ? 503 : 200 }
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
