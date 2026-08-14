import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Skip static files, Next.js internal paths, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let tenantSlug: string | null = null;

  // 1. Check query parameter `?tenant=username`
  if (searchParams.has("tenant")) {
    tenantSlug = searchParams.get("tenant");
  } else {
    // 2. Extract subdomain if present
    // e.g. "jean.starryhealth.com" or "jean.localhost:3000"
    const currentHost = process.env.NODE_ENV === "production"
      ? hostname.replace(`.starryhealth.com`, "")
      : hostname.replace(`.localhost:3000`, "").replace(`.localhost:3001`, "");

    if (
      currentHost &&
      currentHost !== hostname &&
      currentHost !== "www" &&
      currentHost !== "starryhealth" &&
      currentHost !== "localhost:3000"
    ) {
      tenantSlug = currentHost;
    }
  }

  // Clone request headers and set `x-tenant-slug`
  const requestHeaders = new Headers(request.headers);
  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug.toLowerCase());
  } else {
    requestHeaders.delete("x-tenant-slug");
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
