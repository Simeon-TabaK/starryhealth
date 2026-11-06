"use client";

import { useEffect } from "react";

interface TenantVisitTrackerProps {
  tenantSlug?: string | null;
}

function getOrGenerateDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = localStorage.getItem("starry_dev_id");
    if (!id) {
      id = `dev_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 8)}`;
      localStorage.setItem("starry_dev_id", id);
    }
    return id;
  } catch {
    return `dev_tmp_${Date.now()}`;
  }
}

function detectDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  const width = window.innerWidth;

  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua) || (width >= 640 && width <= 1024 && "ontouchstart" in window)) {
    return "tablet";
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(ua) || width < 640) {
    return "mobile";
  }
  return "desktop";
}

function detectOS(): string {
  if (typeof window === "undefined") return "Autre";
  const ua = navigator.userAgent;
  if (/iPad|iPhone|iPod/.test(ua)) return "iOS";
  if (/Android/.test(ua)) return "Android";
  if (/Windows/.test(ua)) return "Windows";
  if (/Macintosh|Mac OS X/.test(ua)) return "macOS";
  if (/Linux/.test(ua)) return "Linux";
  return "Autre";
}

function detectBrowser(): string {
  if (typeof window === "undefined") return "Autre";
  const ua = navigator.userAgent;
  if (/Edg/.test(ua)) return "Edge";
  if (/Chrome/.test(ua) && !/Edg/.test(ua)) return "Chrome";
  if (/Safari/.test(ua) && !/Chrome/.test(ua)) return "Safari";
  if (/Firefox/.test(ua)) return "Firefox";
  return "Navigateur Web";
}

export function TenantVisitTracker({ tenantSlug }: TenantVisitTrackerProps) {
  useEffect(() => {
    if (!tenantSlug) return;

    // Éviter de tracker les robots d'indexation connus
    const ua = navigator.userAgent.toLowerCase();
    if (/bot|crawler|spider|crawling/i.test(ua)) return;

    const deviceId = getOrGenerateDeviceId();
    const deviceType = detectDeviceType();
    const os = detectOS();
    const browser = detectBrowser();
    const path = window.location.pathname;

    const payload = JSON.stringify({
      tenantSlug,
      deviceId,
      deviceType,
      os,
      browser,
      path,
    });

    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon("/api/analytics/track-device", blob);
    } else {
      fetch("/api/analytics/track-device", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      }).catch(() => {});
    }
  }, [tenantSlug]);

  return null;
}

