"use client";

import React from "react";
import { LayoutTemplate, Check, Type, Sparkles, Sun, Moon } from "lucide-react";
import { ThemeStudioState } from "../types";
import { getOptimalContrastTextColor, isDarkColor } from "../color-utils";

interface HeaderSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
  canCustomColors: boolean;
}

const HEADER_STYLES = [
  { id: "minimal", name: "Épuré & Lumineux", desc: "Arrière-plan blanc moderne avec fine bordure", bg: "#ffffff" },
  { id: "soft", name: "Teinté Doux", desc: "Teinte légère assortie au thème général", bg: "#f8fafc" },
  { id: "dark", name: "Contraste Sombre", desc: "Barre supérieure foncée pour faire ressortir le logo", bg: "#0f172a" },
  { id: "navy", name: "Bleu Royal Nuit", desc: "Couleur officielle signature Starry Health", bg: "#1A1A8B" },
];

export function HeaderSection({ state, onChange, canCustomColors }: HeaderSectionProps) {
  const currentBg = state.headerColor || "#ffffff";
  const currentText = state.headerTextColor || getOptimalContrastTextColor(currentBg);
  const autoContrastText = getOptimalContrastTextColor(currentBg);

  const handleBgChange = (newBg: string) => {
    // Si l'utilisateur n'avait pas forcé une couleur de texte très spécifique, on adapte automatiquement
    const autoText = getOptimalContrastTextColor(newBg);
    onChange({
      headerColor: newBg,
      headerTextColor: autoText,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <LayoutTemplate className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          En-tête & Barre de Navigation (Header)
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Personnalisez la disposition de la barre haute, la couleur de fond et la couleur d'écriture pour une lisibilité optimale.
        </p>
      </div>

      {/* Style & Couleur de Fond du Header */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Arrière-plan de l'en-tête (Presets rapides)
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {HEADER_STYLES.map((st) => {
            const isSelected = currentBg.toLowerCase() === st.bg.toLowerCase();
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => handleBgChange(st.bg)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="w-6 h-6 rounded-lg border shadow-xs" style={{ backgroundColor: st.bg }} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{st.name}</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-snug">{st.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Couleurs détaillées : Fond + Texte (Écriture) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        {/* Couleur exacte Fond Header */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Fond de l'en-tête (Personnalisé)
            </span>
            <span className="w-5 h-5 rounded-md border shadow-2xs" style={{ backgroundColor: currentBg }} />
          </div>
          <p className="text-[10px] text-slate-500">Choisissez la couleur de fond exacte de la barre de navigation</p>
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={currentBg}
              onChange={(e) => handleBgChange(e.target.value)}
              className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={currentBg}
              onChange={(e) => handleBgChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
            />
          </div>
        </div>

        {/* Couleur d'Écriture (Texte) de l'En-tête */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              Couleur de l'écriture (Texte & Liens)
            </span>
            <span
              className="w-5 h-5 rounded-md border shadow-2xs"
              style={{ backgroundColor: currentText }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Évite d'avoir un texte sombre sur un fond sombre (ou inversement)
          </p>

          {/* Boutons rapides Blanc / Sombre / Auto */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onChange({ headerTextColor: "#ffffff" })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                currentText.toLowerCase() === "#ffffff"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Sun className="w-3 h-3 text-amber-400" />
              Blanc (#FFF)
            </button>

            <button
              type="button"
              onClick={() => onChange({ headerTextColor: "#0f172a" })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                currentText.toLowerCase() === "#0f172a"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-3 h-3 text-slate-400" />
              Sombre (#0F172A)
            </button>
          </div>

          {/* Custom color picker */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={currentText}
              onChange={(e) => onChange({ headerTextColor: e.target.value })}
              className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={currentText}
              onChange={(e) => onChange({ headerTextColor: e.target.value })}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => onChange({ headerTextColor: autoContrastText })}
              className="text-[10px] px-2 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold cursor-pointer"
              title="Calculer automatiquement le contraste idéal"
            >
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Couleur Bouton Header / Panier */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Couleur du Bouton Principal de l'en-tête (Bouton Panier & Actions)
        </label>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={state.buttonColor}
            onChange={(e) => onChange({ buttonColor: e.target.value })}
            className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
          />
          <input
            type="text"
            value={state.buttonColor}
            onChange={(e) => onChange({ buttonColor: e.target.value })}
            className="w-36 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
          />
          <span className="text-xs text-slate-400">Assorti par défaut à votre couleur primaire</span>
        </div>
      </div>
    </div>
  );
}
