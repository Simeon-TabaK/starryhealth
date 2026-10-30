"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

interface TenantFaviconProps {
  faviconUrl?: string | null;
  defaultIcon?: string;
  defaultAppleIcon?: string;
}

export function TenantFavicon({
  faviconUrl: initialFaviconUrl,
  defaultIcon = "/assets/logo.png",
  defaultAppleIcon = "/assets/logo.png",
}: TenantFaviconProps) {
  const { data: session, status } = useSession();
  const [activeFavicon, setActiveFavicon] = useState<string | null>(initialFaviconUrl || null);

  // Sync if initial props change
  useEffect(() => {
    if (initialFaviconUrl) {
      setActiveFavicon(initialFaviconUrl);
    }
  }, [initialFaviconUrl]);

  // Si pas de favicon fourni par les props mais que l'utilisateur est connecté
  useEffect(() => {
    if (!activeFavicon && status === "authenticated") {
      const sessionFavicon = (session?.user as any)?.favicon;
      if (sessionFavicon) {
        setActiveFavicon(sessionFavicon);
      } else {
        // Interroger l'API pour récupérer le favicon de la config tenant de l'utilisateur connecté
        fetch("/api/users/me")
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => {
            if (data?.favicon) {
              setActiveFavicon(data.favicon);
            }
          })
          .catch(() => {});
      }
    }
  }, [status, session, activeFavicon]);

  // Écouter les mises à jour directes du favicon (ex: après upload/sauvegarde dans le Dashboard)
  useEffect(() => {
    const handleFaviconChange = (e: any) => {
      const newUrl = e.detail;
      if (typeof newUrl === "string") {
        setActiveFavicon(newUrl);
      }
    };

    window.addEventListener("tenant-favicon-change", handleFaviconChange);
    return () => {
      window.removeEventListener("tenant-favicon-change", handleFaviconChange);
    };
  }, []);

  // Application dynamique dans l'en-tête du document
  useEffect(() => {
    const updateFaviconDOM = (iconSrc: string, appleSrc?: string) => {
      if (!iconSrc || typeof document === "undefined") return;

      const linkTypes = [
        { rel: "icon", href: iconSrc },
        { rel: "shortcut icon", href: iconSrc },
        { rel: "apple-touch-icon", href: appleSrc || iconSrc },
      ];

      // Supprimer les anciens liens pour forcer le navigateur à recharger l'icône
      document
        .querySelectorAll("link[rel*='icon'], link[rel='apple-touch-icon']")
        .forEach((el) => el.remove());

      // Créer et attacher les nouveaux liens
      linkTypes.forEach(({ rel, href }) => {
        const link = document.createElement("link");
        link.rel = rel;
        link.href = href;
        if (href.endsWith(".svg")) {
          link.type = "image/svg+xml";
        } else if (href.endsWith(".png")) {
          link.type = "image/png";
        }
        document.head.appendChild(link);
      });
    };

    // Si aucun favicon personnalisé n'est configuré, réinitialiser sur le logo par défaut
    if (!activeFavicon || !activeFavicon.trim()) {
      updateFaviconDOM(defaultIcon, defaultAppleIcon);
      return;
    }

    const trimmedUrl = activeFavicon.trim();

    // Validation du format d'URL
    const isValidUrl =
      trimmedUrl.startsWith("http://") ||
      trimmedUrl.startsWith("https://") ||
      trimmedUrl.startsWith("/");

    if (!isValidUrl) {
      updateFaviconDOM(defaultIcon, defaultAppleIcon);
      return;
    }

    // Cache-busting avec identifiant pour forcer la prise en compte immédiate par le navigateur
    const cacheKey = encodeURIComponent(
      trimmedUrl.length > 12 ? trimmedUrl.slice(-10).replace(/[^a-zA-Z0-9]/g, "") : "t1"
    );
    const finalUrl = trimmedUrl.includes("?")
      ? `${trimmedUrl}&v=${cacheKey}`
      : `${trimmedUrl}?v=${cacheKey}`;

    // Tester le chargement de l'image avant l'injection dans le DOM pour éviter tout favicon cassé
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      updateFaviconDOM(finalUrl, finalUrl);
    };
    img.onerror = () => {
      console.warn("Favicon tenant inaccessible, repli sur le favicon par défaut :", trimmedUrl);
      updateFaviconDOM(defaultIcon, defaultAppleIcon);
    };
    img.src = finalUrl;
  }, [activeFavicon, defaultIcon, defaultAppleIcon]);

  return null;
}
