import { getCurrentTenant } from "@/lib/tenant";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const tenant = await getCurrentTenant();
    const customFavicon = tenant?.config?.favicon?.trim();

    if (customFavicon) {
      try {
        const res = await fetch(customFavicon, { cache: "no-store" });
        if (res.ok) {
          const buffer = await res.arrayBuffer();
          const contentType = res.headers.get("content-type") || "image/png";
          return new Response(buffer, {
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          });
        }
      } catch {
        return NextResponse.redirect(customFavicon, {
          status: 307,
          headers: {
            "Cache-Control": "no-store, must-revalidate",
          },
        });
      }
    }

    return NextResponse.redirect(
      new URL("/assets/logo.png", process.env.NEXTAUTH_URL || "https://sboxx.site"),
      { status: 307 }
    );
  } catch {
    return NextResponse.redirect(
      new URL("/assets/logo.png", process.env.NEXTAUTH_URL || "https://sboxx.site"),
      { status: 307 }
    );
  }
}
