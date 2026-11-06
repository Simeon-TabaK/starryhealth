"use client";

import React from "react";
import { PanelBottom, Check, Type, Sun, Moon } from "lucide-react";
import { ThemeStudioState } from "../types";
import { getOptimalContrastTextColor } from "../color-utils";

interface FooterSectionProps {
  state: ThemeStudioState;
  onChange: (patch: Partial<ThemeStudioState>) => void;
}

const FOOTER_PRESETS = [
  { id: "dark-navy", name: "Bleu Nuit Signature", color: "#0d1230" },
  { id: "slate-deep", name: "Ardoise Sombre", color: "#0f172a" },
  { id: "forest-dark", name: "Vert Profond", color: "#022c22" },
  { id: "pure-black", name: "Noir Absolu", color: "#000000" },
  { id: "pure-white", name: "Blanc Lumineux", color: "#ffffff" },
  { id: "soft-gray", name: "Gris Moderne", color: "#f1f5f9" },
];

export function FooterSection({ state, onChange }: FooterSectionProps) {
  const currentBg = state.footerColor || "#0d1230";
  const currentText = state.footerTextColor || getOptimalContrastTextColor(currentBg);
  const autoContrastText = getOptimalContrastTextColor(currentBg);

  const handleBgChange = (newBg: string) => {
    const autoText = getOptimalContrastTextColor(newBg);
    onChange({
      footerColor: newBg,
      footerTextColor: autoText,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PanelBottom className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Pied de Page (Footer) & Coordonnées
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Gérez les coordonnées directes de contact, vos liens sociaux et assurez un contraste de lecture parfait.
        </p>
      </div>

      {/* Style & Couleur du Footer */}
      <div className="space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Couleur de fond du pied de page (Presets rapides)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FOOTER_PRESETS.map((fp) => {
            const isSelected = currentBg.toLowerCase() === fp.color.toLowerCase();
            return (
              <button
                key={fp.id}
                type="button"
                onClick={() => handleBgChange(fp.color)}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                    : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="w-5 h-5 rounded-full border border-black/10" style={{ backgroundColor: fp.color }} />
                  {isSelected && <Check className="w-3.5 h-3.5 text-emerald-600" />}
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{fp.name}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Couleurs Fond + Écriture Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Couleur exacte Fond Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              Fond du pied de page (Personnalisé)
            </span>
            <span className="w-5 h-5 rounded-md border shadow-2xs" style={{ backgroundColor: currentBg }} />
          </div>
          <p className="text-[10px] text-slate-500">Choisissez la nuance exacte de fond du footer</p>
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

        {/* Couleur d'Écriture (Texte) du Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-emerald-600" />
              Couleur de l'écriture (Texte du Footer)
            </span>
            <span
              className="w-5 h-5 rounded-md border shadow-2xs"
              style={{ backgroundColor: currentText }}
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Garantit une parfaite visibilité des coordonnées et liens de pied de page
          </p>

          {/* Boutons rapides Blanc / Gris Clair / Sombre */}
          <div className="flex items-center gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => onChange({ footerTextColor: "#ffffff" })}
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
              onClick={() => onChange({ footerTextColor: "#e2e8f0" })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                currentText.toLowerCase() === "#e2e8f0"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              Gris doux
            </button>

            <button
              type="button"
              onClick={() => onChange({ footerTextColor: "#0f172a" })}
              className={`flex-1 py-1.5 px-2 rounded-lg text-[11px] font-semibold border flex items-center justify-center gap-1 cursor-pointer transition-all ${
                currentText.toLowerCase() === "#0f172a"
                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                  : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Moon className="w-3 h-3 text-slate-400" />
              Sombre
            </button>
          </div>

          {/* Custom color picker */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={currentText}
              onChange={(e) => onChange({ footerTextColor: e.target.value })}
              className="w-9 h-9 rounded-lg border-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={currentText}
              onChange={(e) => onChange({ footerTextColor: e.target.value })}
              className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono"
            />
            <button
              type="button"
              onClick={() => onChange({ footerTextColor: autoContrastText })}
              className="text-[10px] px-2 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold cursor-pointer"
              title="Calculer automatiquement le contraste idéal"
            >
              Auto
            </button>
          </div>
        </div>
      </div>

      {/* Coordonnées de Contact */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Coordonnées affichées dans le pied de page
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Email public</span>
            <input
              type="email"
              value={state.contactEmail}
              onChange={(e) => onChange({ contactEmail: e.target.value })}
              placeholder="contact@maboutique.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Téléphone de contact</span>
            <input
              type="text"
              value={state.contactPhone}
              onChange={(e) => onChange({ contactPhone: e.target.value })}
              placeholder="+243 990 000 000"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Adresse physique / Ville</span>
            <input
              type="text"
              value={state.contactAddress}
              onChange={(e) => onChange({ contactAddress: e.target.value })}
              placeholder="Kinshasa, Gombe ou votre adresse"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Site Web externe (optionnel)</span>
            <input
              type="text"
              value={state.contactWebsite}
              onChange={(e) => onChange({ contactWebsite: e.target.value })}
              placeholder="www.monsite.com"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Réseaux Sociaux & WhatsApp */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Réseaux Sociaux & Bouton WhatsApp
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Numéro WhatsApp (commandes)</span>
            <input
              type="text"
              value={state.whatsapp}
              onChange={(e) => onChange({ whatsapp: e.target.value })}
              placeholder="+243 969 131 138"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Lien Facebook</span>
            <input
              type="text"
              value={state.facebook}
              onChange={(e) => onChange({ facebook: e.target.value })}
              placeholder="https://facebook.com/maboutique"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Lien Instagram</span>
            <input
              type="text"
              value={state.instagram}
              onChange={(e) => onChange({ instagram: e.target.value })}
              placeholder="https://instagram.com/maboutique"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Lien LinkedIn</span>
            <input
              type="text"
              value={state.linkedin}
              onChange={(e) => onChange({ linkedin: e.target.value })}
              placeholder="https://linkedin.com/company/maboutique"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>

          <div>
            <span className="text-[11px] font-semibold text-slate-500 block mb-1">Lien TikTok</span>
            <input
              type="text"
              value={state.tiktok}
              onChange={(e) => onChange({ tiktok: e.target.value })}
              placeholder="https://tiktok.com/@maboutique"
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
            />
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
        <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
          Texte de Copyright
        </label>
        <input
          type="text"
          value={state.copyright}
          onChange={(e) => onChange({ copyright: e.target.value })}
          placeholder={`© ${new Date().getFullYear()} Starry Health. Tous droits réservés.`}
          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
        />
      </div>
    </div>
  );
}
