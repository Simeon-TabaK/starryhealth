import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Récupération du Host depuis les headers envoyés par Traefik / Dokploy / Vercel
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // 2. Nettoyage du Port (Port Stripping)
  // Transforme "domaine.com:3000" ou "sub.sslip.io:80" en "domaine.com" ou "sub.sslip.io"
  const hostname = rawHost.split(":")[0].toLowerCase();

  // 3. Ignorer les fichiers statiques, routes d'API internes et fichiers avec extension
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 4. Domaine principal configuré via variable d'environnement Dokploy ou valeur par défaut
  const isProduction = process.env.NODE_ENV === "production";
  const mainDomain =
    process.env.NEXT_PUBLIC_MAIN_DOMAIN ||
    (isProduction ? "starryhealth.com" : "localhost");

  let tenantSlug: string | null = null;

  // 5. Vérification par paramètre d'URL `?tenant=username`
  if (searchParams.has("tenant")) {
    tenantSlug = searchParams.get("tenant");
  } else {
    // 6. Extraction du sous-domaine (ex: username.starryhealth.com)
    if (hostname.endsWith(`.${mainDomain}`)) {
      const parts = hostname.replace(`.${mainDomain}`, "").split(".");
      const extractedSubdomain = parts[parts.length - 1]; // Récupère le sous-domaine immédiat

      if (
        extractedSubdomain &&
        extractedSubdomain !== "www" &&
        extractedSubdomain !== "starryhealth" &&
        extractedSubdomain !== mainDomain
      ) {
        tenantSlug = extractedSubdomain;
      }
    }
  }

  // 7. Injection des headers nettoyés pour les Server Components et API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-clean-host", hostname);

  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug.toLowerCase());
  } else {
    // Vérification pour les domaines personnalisés (ex: mon-cabinet.com)
    const isMainDomain =
      hostname === mainDomain ||
      hostname === `www.${mainDomain}` ||
      hostname === "localhost";

    if (!isMainDomain && !hostname.endsWith(`.${mainDomain}`)) {
      requestHeaders.set("x-custom-host", hostname);
    } else {
      requestHeaders.delete("x-tenant-slug");
      requestHeaders.delete("x-custom-host");
    }
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  // Injecter également sur les headers de réponse
  response.headers.set("x-clean-host", hostname);

  return response;
}

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
