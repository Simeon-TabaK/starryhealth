"use client";

import React from "react";
import { Camera, Image as ImageIcon, Sparkles, ChevronRight, Upload } from "lucide-react";

interface MediaSectionProps {
  onNavigateTab: (tabId: string) => void;
  hasPremiumFeatures: boolean;
}

export function MediaSection({ onNavigateTab, hasPremiumFeatures }: MediaSectionProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Médias, Galerie Photos & Visuels
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Gérez l'ensemble des photos de votre univers de marque, carrousels et clichés haute définition.
        </p>
      </div>

      <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent p-5 rounded-2xl border border-amber-500/20 space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-amber-500 text-white shadow-md">
            <Camera className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Galerie d'Images ("Notre univers en images")
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Module carrousel photo immersif avec téléversement multiple direct et recadrage 16:9.
            </p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 flex-wrap">
          <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            {hasPremiumFeatures ? "✓ Fonctionnalité activée sur votre forfait" : "Réservé au Forfait PREMIUM"}
          </span>

          <button
            type="button"
            onClick={() => onNavigateTab("gallery")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>Ouvrir le studio Galerie</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

