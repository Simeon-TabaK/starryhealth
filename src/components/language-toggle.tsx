"use client";

import React from "react";
import { useTranslation } from "@/lib/i18n/context";
import { Globe } from "lucide-react";

export function LanguageToggle() {
  const { locale, setLocale } = useTranslation();

  return (
    <button
      type="button"
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900/80 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1A1A8B] cursor-pointer"
      title={locale === "fr" ? "Switch to English" : "Passer en Français"}
      aria-label="Changer de langue"
    >
      <Globe className="w-3.5 h-3.5 text-[#1A1A8B] dark:text-[#CCAB00]" />
      <span className="uppercase text-[11px] font-extrabold">{locale}</span>
    </button>
  );
}

