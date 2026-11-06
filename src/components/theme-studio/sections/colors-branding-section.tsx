"use client";

import React from "react";
import { Palette, Sparkles, Check, Crown, Type } from "lucide-react";
import { ThemeStudioState } from "../types";
import { PREDEFINED_TEMPLATES } from "../theme-templates";

interface ColorsBrandingSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
  canCustomColors: boolean;
  canCustomFont: boolean;
}

const COLOR_SWATCHES = [
  { label: "Bleu Starry", value: "#1A1A8B" },
  { label: "Or Vénitien", value: "#835C00" },
  { label: "Accent Or", value: "#CCAB00" },
  { label: "Vert Émeraude", value: "#0f766e" },
  { label: "Vert Forêt", value: "#15803d" },
  { label: "Bleu Océan", value: "#0284c7" },
  { label: "Indigo Nuit", value: "#4f46e5" },
  { label: "Ambre Chaleur", value: "#d97706" },
  { label: "Rose Poudré", value: "#e11d48" },
  { label: "Noir Intense", value: "#09090b" },
];

export const AVAILABLE_FONTS = [
  {
    id: "Inter",
    name: "Inter",
    category: "Sans-Serif Moderne",
    desc: "Clarté maximale, lisibilité parfaite sur tous les écrans",
    sample: "Santé, Équilibre & Vitalité Quotidienne",
  },
  {
    id: "Poppins",
    name: "Poppins",
    category: "Géométrique & Chaleureux",
    desc: "Formes arrondies accueillantes, très tendance en e-commerce",
    sample: "Produits 100% Naturels & Bio Certifiés",
  },
  {
    id: "Montserrat",
    name: "Montserrat",
    category: "Moderne & Affirmé",
    desc: "Caractère fort, idéal pour titres percutants et marques premium",
    sample: "Excellence Scientifique & Bien-être",
  },
  {
    id: "Outfit",
    name: "Outfit",
    category: "Élégant & Contemporain",
    desc: "Style épuré haute résolution, parfait pour cosmétique et bien-être",
    sample: "Nutrition Saine & Compléments Actifs",
  },
  {
    id: "Playfair Display",
    name: "Playfair Display",
    category: "Serif Luxe & Prestige",
    desc: "Typographie raffinée aux accents traditionnels de luxe et spa",
    sample: "L'Art du Soin & de la Sérénité",
  },
  {
    id: "Lora",
    name: "Lora",
    category: "Serif Organique",
    desc: "Courbes douces et organiques pour l'herboristerie et la nature",
    sample: "Plantes, Tisanes & Remèdes Purs",
  },
  {
    id: "Plus Jakarta Sans",
    name: "Plus Jakarta",
    category: "Tech & Professionnel",
    desc: "Design moderne et fluide privilégié par les startups de santé",
    sample: "Innovation Médicale & Progrès",
  },
  {
    id: "Roboto",
    name: "Roboto",
    category: "Classique & Équilibré",
    desc: "Standard universel de Google, neutre et très accessible",
    sample: "Formules Testées en Laboratoire",
  },
];

export function ColorsBrandingSection({
  state,
  onChange,
  canCustomColors,
  canCustomFont,
}: ColorsBrandingSectionProps) {
  const handleApplyTemplate = (tmplId: string) => {
    const tmpl = PREDEFINED_TEMPLATES.find((t) => t.id === tmplId);
    if (!tmpl) return;
    onChange({
      primaryColor: tmpl.config.primaryColor,
      secondaryColor: tmpl.config.secondaryColor,
      accentColor: tmpl.config.accentColor,
      buttonColor: tmpl.config.buttonColor,
      headerColor: tmpl.config.headerColor,
      headerTextColor: tmpl.config.headerTextColor || "#0f172a",
      footerColor: tmpl.config.footerColor,
      footerTextColor: tmpl.config.footerTextColor || "#ffffff",
      sidebarBgColor: tmpl.config.sidebarBgColor,
      sidebarTextColor: tmpl.config.sidebarTextColor,
      dashboardBgColor: tmpl.config.dashboardBgColor,
      fontFamily: tmpl.config.fontFamily,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Palette className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Couleurs & Identité Visuelle
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Choisissez un modèle complet ou personnalisez vos teintes et typographies en un clic.
        </p>
      </div>

      {/* 1. Modèles Prédéfinis (1-Click Presets) */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Modèles de thème prédéfinis (Prêts à l'emploi)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {PREDEFINED_TEMPLATES.map((tmpl) => {
            const isSelected =
              state.primaryColor.toLowerCase() === tmpl.config.primaryColor.toLowerCase() &&
              state.secondaryColor.toLowerCase() === tmpl.config.secondaryColor.toLowerCase();
            return (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleApplyTemplate(tmpl.id)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 shadow-xs ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {tmpl.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Actif
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{tmpl.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {tmpl.tagline}
                  </p>
                </div>

                {/* Swatches bar */}
                <div className="flex items-center gap-1.5 pt-3 mt-3 border-t border-slate-100 dark:border-slate-800/80">
                  {tmpl.previewColors.map((col, idx) => (
                    <span
                      key={idx}
                      className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                      style={{ backgroundColor: col }}
                    />
                  ))}
                  <span className="text-[10px] text-slate-400 ml-auto font-medium">1 clic</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Nuancier et Couleurs Détaillées */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
            Nuancier & Couleurs Clés
          </label>
          {!canCustomColors && (
            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              <Crown className="w-3 h-3" /> Forfait SMART requis
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Couleur Principale */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Couleur Principale
              </span>
              <span
                className="w-5 h-5 rounded-md border border-black/15 shadow-xs"
                style={{ backgroundColor: state.primaryColor }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Titres majeurs, logo et branding de marque</p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={state.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={state.primaryColor}
                onChange={(e) => onChange({ primaryColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
              />
            </div>
          </div>

          {/* Couleur Secondaire */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Couleur Secondaire
              </span>
              <span
                className="w-5 h-5 rounded-md border border-black/15 shadow-xs"
                style={{ backgroundColor: state.secondaryColor }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Sous-titres, bandeaux et nuances complémentaires</p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={state.secondaryColor}
                disabled={!canCustomColors}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent disabled:opacity-50"
              />
              <input
                type="text"
                value={state.secondaryColor}
                disabled={!canCustomColors}
                onChange={(e) => onChange({ secondaryColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono disabled:opacity-50"
              />
            </div>
          </div>

          {/* Couleur d'Accentuation */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Couleur d'Accent
              </span>
              <span
                className="w-5 h-5 rounded-md border border-black/15 shadow-xs"
                style={{ backgroundColor: state.accentColor }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Badges promotionnels, avis et étoiles</p>
            <div className="flex items-center gap-2 pt-1">
              <input
                type="color"
                value={state.accentColor}
                disabled={!canCustomColors}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent disabled:opacity-50"
              />
              <input
                type="text"
                value={state.accentColor}
                disabled={!canCustomColors}
                onChange={(e) => onChange({ accentColor: e.target.value })}
                className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* Nuancier rapide */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[11px] font-semibold text-slate-500">Nuancier rapide :</span>
          <div className="flex items-center gap-2 flex-wrap">
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.value}
                type="button"
                onClick={() => onChange({ primaryColor: swatch.value, buttonColor: swatch.value })}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-medium hover:border-slate-400 cursor-pointer shadow-2xs"
              >
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: swatch.value }} />
                <span>{swatch.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Typographie avec profil visuel de chaque police */}
      <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              Police d'écriture de la boutique (Profil typographique)
            </label>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Chaque police ci-dessous est affichée avec son propre rendu visuel réel.
            </p>
          </div>
          {!canCustomFont && (
            <span className="text-[11px] font-semibold text-amber-600 flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full">
              <Crown className="w-3 h-3" /> PREMIUM
            </span>
          )}
        </div>

        {/* Grille des polices avec profil réel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {AVAILABLE_FONTS.map((f) => {
            const isSelected = state.fontFamily === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => onChange({ fontFamily: f.id })}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20 shadow-xs"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {f.category}
                    </span>
                    {isSelected && (
                      <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                        <Check className="w-3.5 h-3.5" /> Sélectionnée
                      </span>
                    )}
                  </div>

                  {/* Nom de la police stylisé dans sa propre famille */}
                  <h4
                    className="text-base font-bold text-slate-900 dark:text-white mt-1"
                    style={{ fontFamily: f.id }}
                  >
                    {f.name}
                  </h4>

                  {/* Exemple visuel de phrase dans cette police */}
                  <div
                    className="mt-2.5 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800/80"
                    style={{ fontFamily: f.id }}
                  >
                    <p className="text-xs text-slate-800 dark:text-slate-200 font-semibold leading-relaxed">
                      "{f.sample}"
                    </p>
                    <p className="text-[10px] text-slate-400 mt-1 tracking-wider">
                      Aa Bb Cc Dd Ee Gg 1234567890
                    </p>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 mt-2.5 leading-tight">
                  {f.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
