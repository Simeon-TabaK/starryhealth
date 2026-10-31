"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { Locale, TranslationDictionary } from "./types";
import { fr } from "./dictionaries/fr";
import { en } from "./dictionaries/en";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (path: string, fallback?: string) => string;
  dictionary: TranslationDictionary;
}

const dictionaries: Record<Locale, TranslationDictionary> = {
  fr,
  en,
};

const LanguageContext = createContext<LanguageContextType>({
  locale: "fr",
  setLocale: () => {},
  t: (path: string, fallback?: string) => fallback || path,
  dictionary: fr,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fr");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("starry-lang") as Locale | null;
      if (saved && (saved === "fr" || saved === "en")) {
        setLocaleState(saved);
      } else {
        const browserLang = navigator.language.startsWith("en") ? "en" : "fr";
        setLocaleState(browserLang);
      }
    } catch {}
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem("starry-lang", newLocale);
      document.documentElement.lang = newLocale;
    } catch {}
  };

  const currentDictionary = dictionaries[locale] || fr;

  const t = (path: string, fallback?: string): string => {
    const keys = path.split(".");
    let current: any = currentDictionary;
    for (const k of keys) {
      if (current && typeof current === "object" && k in current) {
        current = current[k];
      } else {
        return fallback || path;
      }
    }
    return typeof current === "string" ? current : fallback || path;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t, dictionary: currentDictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  return useContext(LanguageContext);
}

