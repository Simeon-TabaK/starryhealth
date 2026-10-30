"use client";

import { useEffect } from "react";

interface TenantFaviconProps {
  faviconUrl?: string | null;
  defaultIcon?: string;
  defaultAppleIcon?: string;
}

export function TenantFavicon({
  faviconUrl,
  defaultIcon = "/assets/logo.png",
  defaultAppleIcon = "/assets/logo.png",
}: TenantFaviconProps) {
  useEffect(() => {
    const updateFaviconLinks = (iconSrc: string, appleSrc?: string) => {
      if (!iconSrc || typeof document === "undefined") return;

      const linkDefs: { rel: string; href: string }[] = [
        { rel: "icon", href: iconSrc },
        { rel: "shortcut icon", href: iconSrc },
        { rel: "apple-touch-icon", href: appleSrc || iconSrc },
      ];

      linkDefs.forEach(({ rel, href }) => {
        let link = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement | null;
        if (!link) {
          link = document.createElement("link");
          link.rel = rel;
          document.head.appendChild(link);
        }
        link.href = href;
      });
    };

    // If no custom favicon URL is provided, ensure default is applied cleanly
    if (!faviconUrl || !faviconUrl.trim()) {
      updateFaviconLinks(defaultIcon, defaultAppleIcon);
      return;
    }

    const trimmedUrl = faviconUrl.trim();

    // Validate URL syntax
    const isValidUrl =
      trimmedUrl.startsWith("http://") ||
      trimmedUrl.startsWith("https://") ||
      trimmedUrl.startsWith("/");

    if (!isValidUrl) {
      updateFaviconLinks(defaultIcon, defaultAppleIcon);
      return;
    }

    // Cache-busting parameter based on asset identifier to bust browser favicon cache
    const cacheKey = encodeURIComponent(
      trimmedUrl.length > 12 ? trimmedUrl.slice(-10).replace(/[^a-zA-Z0-9]/g, "") : "t1"
    );
    const finalUrl = trimmedUrl.includes("?")
      ? `${trimmedUrl}&v=${cacheKey}`
      : `${trimmedUrl}?v=${cacheKey}`;

    // Robust validation: check that the custom favicon image loads successfully before swapping
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      updateFaviconLinks(finalUrl, finalUrl);
    };
    img.onerror = () => {
      console.warn("Tenant favicon image inaccessible, falling back to default icon:", trimmedUrl);
      updateFaviconLinks(defaultIcon, defaultAppleIcon);
    };
    img.src = finalUrl;
  }, [faviconUrl, defaultIcon, defaultAppleIcon]);

  return null;
}
