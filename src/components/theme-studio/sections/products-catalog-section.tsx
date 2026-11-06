"use client";

import React from "react";
import { Package, Check, Tag } from "lucide-react";
import { ThemeStudioState } from "../types";

interface ProductsCatalogSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
}

const CORNER_STYLES = [
  { id: "rounded-xl", name: "Doux & Moderne", desc: "Coins arrondis standards (12px)", previewClass: "rounded-xl" },
  { id: "rounded-2xl", name: "Galbé & Tendance", desc: "Coins généreusement courbés (16px)", previewClass: "rounded-2xl" },
  { id: "rounded-none", name: "Strict & Épuré", desc: "Angles droits minimalistes (0px)", previewClass: "rounded-none" },
];

export function ProductsCatalogSection({ state, onChange }: ProductsCatalogSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Catalogue & Style des Cartes Produits
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Choisissez l'apparence des fiches produits sur votre vitrine publique.
        </p>
      </div>

      {/* Style des coins des cartes */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Forme et courbure des cartes produits
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {CORNER_STYLES.map((c) => {
            const isSelected = state.cardCornerStyle === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onChange({ cardCornerStyle: c.id as any })}
                className={`p-4 border text-left transition-all cursor-pointer relative ${c.previewClass} ${
                  isSelected
                    ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`w-8 h-8 border-2 border-slate-400 bg-slate-100 dark:bg-slate-800 ${c.previewClass}`} />
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{c.name}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">{c.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Badges promo & Options d'affichage */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Options d'affichage sur les produits
        </label>

        <label className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 cursor-pointer">
          <div className="flex items-center gap-2.5">
            <Tag className="w-4 h-4 text-emerald-600" />
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Afficher le badge de réduction (Promo)
              </span>
              <span className="text-[11px] text-slate-400">
                Affiche le pourcentage de remise lorsqu'un prix barré est renseigné
              </span>
            </div>
          </div>
          <input
            type="checkbox"
            checked={state.showDiscounts}
            onChange={(e) => onChange({ showDiscounts: e.target.checked })}
            className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}

