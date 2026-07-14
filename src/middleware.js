// src/middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const host = req.headers.get("host") || "";

  // 🔹 Extraction du sous-domaine
  const parts = host.split(".");
  const subdomain = parts.length > 2 ? parts[0] : null;

  if (subdomain && subdomain !== "www") {
    // Print dans le terminal
    console.log("Sous-domaine intercepté:", subdomain);

    // Redirige vers la page publique personnalisée
    url.pathname = `/u/${subdomain}`;
    return NextResponse.rewrite(url);
  }

  // 🔹 Gestion du code client
  const code = url.searchParams.get("code");
  if (code) {
    console.log("Code client intercepté:", code);

    url.pathname = `/u/${code}`;
    return NextResponse.rewrite(url);
  }

  // 🔹 Fallback → page fabrique
  return NextResponse.next();
}
