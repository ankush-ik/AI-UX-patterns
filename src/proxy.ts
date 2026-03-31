import { NextRequest, NextResponse } from "next/server";

/**
 * HTTP Basic Auth Proxy
 * Protects /admin routes and mutating API endpoints (/api/patterns/new, /api/patterns/{id}/edit)
 */

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Routes that require authentication
  const protectedAdminRoutes = pathname === "/admin";
  const protectedApiRoutes =
    pathname === "/api/patterns/new" ||
    pathname.match(/^\/api\/patterns\/[^/]+\/edit$/);

  const requiresAuth =
    (protectedAdminRoutes && request.method === "GET") ||
    (protectedApiRoutes && (request.method === "POST" || request.method === "PATCH" || request.method === "DELETE"));

  if (!requiresAuth) {
    return NextResponse.next();
  }

  // Extract Authorization header
  const authHeader = request.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
      },
    });
  }

  // Decode Base64 credentials
  try {
    const encodedCredentials = authHeader.slice(6);
    const decodedCredentials = Buffer.from(encodedCredentials, "base64").toString("utf-8");
    const [username, password] = decodedCredentials.split(":");

    const validUsername = process.env.ADMIN_USERNAME || "admin";
    const validPassword = process.env.ADMIN_PASSWORD;

    if (!validPassword) {
      console.error("ADMIN_PASSWORD environment variable not set");
      return new NextResponse("Server misconfigured", { status: 500 });
    }

    // Verify credentials
    if (username === validUsername && password === validPassword) {
      return NextResponse.next();
    }

    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Admin Dashboard"',
      },
    });
  } catch (error) {
    console.error("Auth proxy error:", error);
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
