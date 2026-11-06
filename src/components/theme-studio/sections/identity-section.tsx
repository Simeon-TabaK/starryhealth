"use client";

import React from "react";
import { Building, Sparkles, Image as ImageIcon, HelpCircle } from "lucide-react";
import { CloudinaryUpload } from "@/components/media/cloudinary-upload";
import { ThemeStudioState } from "../types";

interface IdentitySectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
  primaryColor: string;
}

export function IdentitySection({ state, onChange, primaryColor }: IdentitySectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Identité Visuelle & Marque
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Définissez le nom, le slogan et les visuels de votre boutique qui apparaîtront sur tous les écrans.
        </p>
      </div>

      {/* Nom & Slogan */}
      <div className="space-y-4 bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Nom de l'Organisation / Boutique
          </label>
          <input
            type="text"
            value={state.orgName}
            onChange={(e) => onChange({ orgName: e.target.value })}
            placeholder="Ex: Pharmacie Centrale & Bien-être"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-xs focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1">
            Slogan / Courte description d'activité
          </label>
          <input
            type="text"
            value={state.orgDescription}
            onChange={(e) => onChange({ orgDescription: e.target.value })}
            placeholder="Ex: Votre partenaire santé au quotidien — Produits naturels certifiés"
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-sm shadow-xs focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Logo & Favicon Upload */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Logo */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Logo de la boutique
            </label>
            <span className="text-[10px] text-slate-400">PNG transparent recommandé</span>
          </div>
          <CloudinaryUpload
            folder="starryhealth/logos"
            cropAspect="1:1"
            onUpload={(url) => onChange({ orgLogo: url })}
            currentUrl={state.orgLogo}
            label="Choisir et rogner le logo"
            primaryColor={primaryColor}
          />
        </div>

        {/* Favicon */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
              Favicon (icône d'onglet navigateur)
            </label>
            <span className="text-[10px] text-slate-400">Format carré (32x32)</span>
          </div>
          <CloudinaryUpload
            folder="starryhealth/favicons"
            cropAspect="1:1"
            onUpload={(url) => onChange({ favicon: url })}
            currentUrl={state.favicon}
            label="Choisir le favicon"
            primaryColor={primaryColor}
          />
        </div>
      </div>
    </div>
  );
}

