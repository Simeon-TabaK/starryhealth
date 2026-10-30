"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "./theme-provider";

export function ThemeUserSync() {
  const { data: session } = useSession();
  const { setTheme } = useTheme();
  const syncedRef = useRef(false);

  // Restore theme preference from DB on login / session load ONLY if no local preference exists
  useEffect(() => {
    if (syncedRef.current) return;
    const currentUserId = (session?.user as any)?.id;
    if (!currentUserId) return;

    syncedRef.current = true;

    try {
      const stored = localStorage.getItem("starry-theme");
      // If user has already made an explicit choice on this device, preserve it
      if (stored && (stored === "dark" || stored === "light" || stored === "system")) {
        return;
      }
    } catch {
      // ignore
    }

    const userTheme = (session?.user as any)?.theme as "light" | "dark" | "system" | undefined;
    if (userTheme && ["light", "dark", "system"].includes(userTheme)) {
      setTheme(userTheme);
    }
  }, [session, setTheme]);

  return null;
}
