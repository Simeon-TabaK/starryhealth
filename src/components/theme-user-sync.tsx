"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTheme } from "./theme-provider";

export function ThemeUserSync() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const syncedUserIdRef = useRef<string | null>(null);

  // Restore theme preference from DB on login / session load
  useEffect(() => {
    const userTheme = (session?.user as any)?.theme as "light" | "dark" | "system" | undefined;
    const currentUserId = (session?.user as any)?.id;

    if (currentUserId && userTheme && syncedUserIdRef.current !== currentUserId) {
      syncedUserIdRef.current = currentUserId;
      if (userTheme !== theme) {
        setTheme(userTheme);
      }
    }
  }, [session, theme, setTheme]);

  return null;
}

