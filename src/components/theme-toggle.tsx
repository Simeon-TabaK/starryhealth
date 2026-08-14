"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 animate-pulse" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="relative p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
      title={theme === "dark" ? "Passer en mode clair" : "Passer en mode sombre"}
      aria-label="Basculer le thème"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform rotate-0 hover:-rotate-12" />
      )}
    </button>
  );
}
