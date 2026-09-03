import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // 1. Récupérer le Host d'origine transmis par Dokploy / Traefik / Vercel
  let hostname = request.headers.get("host") || "";

  // Retirer le port s'il est présent (ex: "jean.starryhealth.com:3000" -> "jean.starryhealth.com")
  hostname = hostname.split(":")[0].toLowerCase();

  // Ignorer les fichiers statiques, routes d'API internes et fichiers avec extension
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  let tenantSlug: string | null = null;

  // 2. Vérification par paramètre d'URL `?tenant=username`
  if (searchParams.has("tenant")) {
    tenantSlug = searchParams.get("tenant");
  } else {
    // 3. Extraction du sous-domaine
    const isProduction = process.env.NODE_ENV === "production";
    const mainDomain = isProduction ? "starryhealth.com" : "localhost";

    if (hostname.endsWith(`.${mainDomain}`)) {
      // Extrait la partie située avant .starryhealth.com ou .localhost
      const parts = hostname.replace(`.${mainDomain}`, "").split(".");
      const extractedSubdomain = parts[parts.length - 1]; // Récupère le sous-domaine immédiat (ex: "jean")

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

  // Injecter les headers de la requête
  const requestHeaders = new Headers(request.headers);

  if (tenantSlug) {
    requestHeaders.set("x-tenant-slug", tenantSlug.toLowerCase());
  } else {
    // 4. Vérification pour les domaines personnalisés (ex: mon-cabinet.com)
    const isMainDomain =
      hostname === "starryhealth.com" ||
      hostname === "www.starryhealth.com" ||
      hostname === "localhost";

    if (!isMainDomain && !hostname.endsWith(".starryhealth.com")) {
      requestHeaders.set("x-custom-host", hostname);
    } else {
      requestHeaders.delete("x-tenant-slug");
      requestHeaders.delete("x-custom-host");
    }
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
     * Intercepte toutes les routes à l'exception des assets statiques
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
