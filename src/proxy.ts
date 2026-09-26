import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Récupérer le header 'host' ou 'x-forwarded-host' envoyé par Traefik / Coolify / Reverse-Proxy
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    "";

  // 2. Nettoyage du port (ex: "sboxx.site:3000" -> "sboxx.site")
  const hostname = rawHost.split(":")[0].toLowerCase().trim();

  // 3. Ignorer les fichiers statiques, images et routes internes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 4. Liste des domaines racine configurables (via env ou defaults sboxx.site, starryhealth.com, localhost)
  const envDomains = [
    process.env.ROOT_DOMAIN,
    process.env.NEXT_PUBLIC_MAIN_DOMAIN,
    ...(process.env.ROOT_DOMAINS ? process.env.ROOT_DOMAINS.split(",") : []),
  ]
    .filter(Boolean)
    .map((d) => d!.trim().toLowerCase());

  const rootDomains = Array.from(
    new Set([
      "sboxx.site",
      "localhost",
      "127.0.0.1",
      ...envDomains,
    ])
  );

  let tenant: string | null = null;
  let isCustomDomain = false;

  // 5. Extraction par paramètre de requête `?tenant=slug` (priorité pour tests ou partages)
  if (searchParams.has("tenant")) {
    tenant = searchParams.get("tenant")?.toLowerCase().trim() || null;
  } else {
    // 6. Vérifier si l'hôte correspond à un sous-domaine de l'un de nos root domains
    let matchedRoot: string | null = null;
    for (const rootDomain of rootDomains) {
      if (hostname === rootDomain || hostname === `www.${rootDomain}`) {
        matchedRoot = rootDomain;
        break;
      }
      if (hostname.endsWith(`.${rootDomain}`)) {
        matchedRoot = rootDomain;
        const prefix = hostname.replace(`.${rootDomain}`, "");
        const parts = prefix.split(".");
        const subdomain = parts[parts.length - 1];

        // Ignorer 'www', 'mail', etc.
        if (
          subdomain &&
          subdomain !== "www" &&
          subdomain !== "main" &&
          subdomain !== "app"
        ) {
          tenant = subdomain;
        }
        break;
      }
    }

    // 7. Si l'hôte n'est aucun de nos root domains / sous-domaines, c'est un Custom Domain (ex: mon-cabinet.com)
    if (!matchedRoot && hostname && hostname !== "localhost") {
      isCustomDomain = true;
    }
  }

  // 8. Transmission de la valeur du tenant et de l'hôte dans les headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-clean-host", hostname);

  if (tenant) {
    requestHeaders.set("x-tenant", tenant);
    requestHeaders.set("x-tenant-slug", tenant);
    requestHeaders.delete("x-custom-host");
  } else if (isCustomDomain) {
    requestHeaders.set("x-custom-host", hostname);
    requestHeaders.delete("x-tenant");
    requestHeaders.delete("x-tenant-slug");
  } else {
    requestHeaders.delete("x-tenant");
    requestHeaders.delete("x-tenant-slug");
    requestHeaders.delete("x-custom-host");
  }

  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-clean-host", hostname);
  if (tenant) {
    response.headers.set("x-tenant", tenant);
  }

  return response;
}

// Export middleware alias for Next.js convention
export const middleware = proxy;

export const config = {
  matcher: [
    /*
     * Match toutes les routes sauf :
     * - api (API routes)
     * - _next/static (fichiers statiques)
     * - _next/image (optimisation d'images)
     * - favicon.ico (icône)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
