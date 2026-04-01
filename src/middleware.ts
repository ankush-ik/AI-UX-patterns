import { NextRequest, NextResponse } from "next/server";

const DEFAULT_ADMIN_USERNAME = "demo";
const DEFAULT_ADMIN_PASSWORD = "summertime";

function isProductionEnvironment() {
  return process.env.NODE_ENV === "production";
}

function getExpectedCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (isProductionEnvironment()) {
    if (!username || !password) {
      return null;
    }

    return { username, password };
  }

  return {
    username: username || DEFAULT_ADMIN_USERNAME,
    password: password || DEFAULT_ADMIN_PASSWORD,
  };
}

/**
 * HTTP Basic Auth
 * Protects /admin and mutating pattern API endpoints.
 * Credentials:
 * - Production: ADMIN_USERNAME and ADMIN_PASSWORD are required.
 * - Non-production: falls back to demo/summertime when env vars are absent.
 */
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const isAdminRoute = pathname === "/admin";
  const isMutatingApiRoute =
    pathname === "/api/patterns/new" ||
    Boolean(pathname.match(/^\/api\/patterns\/[^/]+\/edit$/));

  const requiresAuth =
    (isAdminRoute && request.method === "GET") ||
    (isMutatingApiRoute &&
      (request.method === "POST" ||
        request.method === "PATCH" ||
        request.method === "DELETE"));

  if (!requiresAuth) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
      },
    });
  }

  try {
    const encoded = authHeader.slice(6);
    const decoded = Buffer.from(encoded, "base64").toString("utf-8");
    // Use indexOf to avoid splitting on colons inside the password
    const colonIndex = decoded.indexOf(":");
    const username = decoded.slice(0, colonIndex);
    const password = decoded.slice(colonIndex + 1);

    const credentials = getExpectedCredentials();
    if (!credentials) {
      return new NextResponse("Admin credentials are not configured", {
        status: 503,
      });
    }

    if (username === credentials.username && password === credentials.password) {
      return NextResponse.next();
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
      },
    });
  } catch {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
      },
    });
  }
}

export const config = {
  matcher: [
    "/admin",
    "/api/patterns/new",
    "/api/patterns/:id/edit",
  ],
};
