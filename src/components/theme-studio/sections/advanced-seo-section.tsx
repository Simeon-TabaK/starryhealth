"use client";

import React from "react";
import { Search, Globe, Sparkles, CheckCircle2 } from "lucide-react";
import { ThemeStudioState } from "../types";

interface AdvancedSeoSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
  slug?: string;
}

export function AdvancedSeoSection({ state, onChange, slug }: AdvancedSeoSectionProps) {
  const displayTitle = state.orgName
    ? `${state.orgName} | Vitrine Santé & Bien-être`
    : "Starry Health | Produits de Santé et Bien-être";

  const displayDesc =
    state.orgDescription ||
    "Leader global dans la promotion de la santé et le bien-être grâce aux solutions certifiées et approuvées.";

  const displayUrl = `https://${slug || "maboutique"}.sboxx.site`;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Référencement Naturel (SEO) & Paramètres Avancés
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Optimisez la manière dont votre vitrine apparaît dans Google et sur les réseaux sociaux.
        </p>
      </div>

      {/* Aperçu Google Search Snippet */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Aperçu Google Search (Simulateur de résultat de recherche)
        </label>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">
              <Globe className="w-3 h-3 text-slate-600" />
            </div>
            <span className="text-[11px] text-slate-500 font-mono truncate">{displayUrl}</span>
          </div>

          <h4 className="text-sm sm:text-base font-medium text-blue-700 dark:text-blue-400 hover:underline cursor-pointer leading-snug">
            {displayTitle}
          </h4>

          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>
        </div>
      </div>

      {/* Explications & Recommandations SEO */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Génération automatique des balises Meta & OpenGraph</span>
        </div>
        <p className="text-[11px] leading-relaxed">
          Votre boutique Starry Health génère automatiquement toutes les balises SEO (titre optimisé, description, favicon versionné et aperçu lors des partages WhatsApp/Facebook) à partir du nom et slogan renseignés dans l'onglet Identité.
        </p>
      </div>
    </div>
  );
}

