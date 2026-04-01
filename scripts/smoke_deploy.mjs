#!/usr/bin/env node

/**
 * Deployment smoke test for production/staging environments.
 *
 * Usage:
 *   node scripts/smoke_deploy.mjs --base-url=https://your-site.vercel.app
 *   node scripts/smoke_deploy.mjs --base-url=https://your-site.vercel.app --admin-user=user --admin-pass=pass
 *   node scripts/smoke_deploy.mjs --base-url=https://your-site.vercel.app --admin-user=user --admin-pass=pass --phase1
 */

const args = process.argv.slice(2);

function getArg(name) {
  const prefix = `--${name}=`;
  const match = args.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

function hasFlag(name) {
  return args.includes(`--${name}`);
}

const rawBaseUrl = (getArg("base-url") || process.env.SMOKE_BASE_URL || "").replace(/\/$/, "");
const adminUser = getArg("admin-user") || process.env.ADMIN_USERNAME;
const adminPass = getArg("admin-pass") || process.env.ADMIN_PASSWORD;
const phase1 = hasFlag("phase1");

if (!rawBaseUrl) {
  console.error("Missing required --base-url argument (or SMOKE_BASE_URL env var).");
  process.exit(1);
}

function normalizeBaseUrl(value) {
  const parsed = new URL(value);

  // Prefer IPv4 loopback for local checks to avoid occasional dual-stack resolution issues.
  if (parsed.hostname === "localhost") {
    parsed.hostname = "127.0.0.1";
  }

  return parsed.toString().replace(/\/$/, "");
}

let baseUrl;
try {
  baseUrl = normalizeBaseUrl(rawBaseUrl);
} catch {
  console.error("Invalid --base-url value. Provide an absolute URL, for example https://your-app.vercel.app");
  process.exit(1);
}

const authHeader =
  adminUser && adminPass
    ? `Basic ${Buffer.from(`${adminUser}:${adminPass}`).toString("base64")}`
    : undefined;

const checks = [];

function addCheck(name, path, expectedStatus, options = {}) {
  checks.push({ name, path, expectedStatus, ...options });
}

addCheck("Home page", "/", 200);
addCheck("Categories API", "/api/categories", 200);
addCheck("Patterns API", "/api/patterns", 200);
addCheck("Content report API", "/api/content-report", 200);
addCheck("Health API", "/api/health", 200);
addCheck("Admin unauthorized", "/admin", 401);

if (authHeader) {
  addCheck("Admin authorized", "/admin", 200, {
    headers: { Authorization: authHeader },
  });
}

if (phase1 && authHeader) {
  addCheck("Mutation endpoint disabled in phase1", "/api/patterns/new", 503, {
    method: "POST",
    headers: {
      Authorization: authHeader,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  });
}

if (phase1 && !authHeader) {
  console.error("--phase1 requires --admin-user and --admin-pass (or ADMIN_USERNAME/ADMIN_PASSWORD env vars).");
  process.exit(1);
}

async function runCheck(check) {
  const url = `${baseUrl}${check.path}`;
  const response = await fetch(url, {
    method: check.method || "GET",
    headers: check.headers,
    body: check.body,
  });

  return {
    ...check,
    actualStatus: response.status,
    ok: response.status === check.expectedStatus,
  };
}

async function main() {
  console.log(`Running ${checks.length} checks against ${baseUrl}`);

  const results = [];
  for (const check of checks) {
    try {
      const result = await runCheck(check);
      results.push(result);
      const icon = result.ok ? "PASS" : "FAIL";
      console.log(`${icon} ${result.name}: expected ${result.expectedStatus}, got ${result.actualStatus}`);
    } catch (error) {
      results.push({ ...check, ok: false, actualStatus: "error" });
      const errorMessage = error instanceof Error ? error.message : "unknown";
      console.log(`FAIL ${check.name}: request error (${errorMessage})`);
    }
  }

  const failed = results.filter((result) => !result.ok);

  if (failed.length > 0) {
    console.error(`\nSmoke check failed: ${failed.length} check(s) failed.`);
    process.exit(1);
  }

  console.log("\nSmoke check passed.");
}

await main();
