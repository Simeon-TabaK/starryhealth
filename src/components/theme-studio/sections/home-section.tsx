"use client";

import React from "react";
import { Home, Sparkles, Image as ImageIcon } from "lucide-react";
import { CloudinaryUpload } from "@/components/media/cloudinary-upload";
import { ThemeStudioState } from "../types";

interface HomeSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
  primaryColor: string;
}

export function HomeSection({ state, onChange, primaryColor }: HomeSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Page d'Accueil & Bannière Héro
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Personnalisez la bannière d'introduction de votre vitrine qui accueille vos visiteurs.
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Badge / Surtitre d'accroche
          </label>
          <input
            type="text"
            value={state.heroSubtitle}
            onChange={(e) => onChange({ heroSubtitle: e.target.value })}
            placeholder="Ex: Nouveautés 2026 • 100% Naturel & Efficace"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Grand Titre Principal de la Bannière (H1)
          </label>
          <input
            type="text"
            value={state.heroTitle}
            onChange={(e) => onChange({ heroTitle: e.target.value })}
            placeholder="Ex: Prenez soin de votre vitalité chaque jour"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
            Image de fond de bannière (optionnelle)
          </label>
          <CloudinaryUpload
            folder="starryhealth/banners"
            cropAspect="16:9"
            onUpload={(url) => onChange({ heroBannerUrl: url })}
            currentUrl={state.heroBannerUrl}
            label="Choisir et uploader la photo de bannière"
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </div>
  );
}

