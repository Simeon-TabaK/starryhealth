"use client";

import React from "react";
import { Shield, Zap, Crown, Check, PlusCircle } from "lucide-react";
import { PlanType } from "./types";

interface SubscriptionPlansGridProps {
  isSuperAdmin: boolean;
  onSelectPlan: (plan: PlanType) => void;
  onOpenRequestModal: () => void;
}

export function SubscriptionPlansGrid({
  isSuperAdmin,
  onSelectPlan,
  onOpenRequestModal,
}: SubscriptionPlansGridProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Nos Forfaits & Formules d'Abonnement
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Sélectionnez le forfait adapté à votre envergure. Chaque formule inclut une vitrine moderne et des fonctionnalités dédiées à votre visibilité.
          </p>
        </div>
        {!isSuperAdmin && (
          <button
            onClick={onOpenRequestModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Soumettre une demande
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* STANDARD */}
        <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                <Shield className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                Démarrage
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">STANDARD</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$2.99</span>
                <span className="text-xs text-slate-500">/ mois</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Jusqu'à <strong>5 produits</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Personnalisation Organisation & Logo</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Favicon dynamique d'organisation</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Bouton WhatsApp Direct & Panier</span>
              </li>
            </ul>
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => onSelectPlan("STANDARD")}
              className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors cursor-pointer"
            >
              Choisir Standard
            </button>
          )}
        </div>

        {/* SMART */}
        <div className="p-6 rounded-3xl border-2 border-sky-500 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
            Plus Populaire
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600">
                <Zap className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                Recommandé
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">SMART</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-sky-600">$4.19</span>
                <span className="text-xs text-slate-500">/ mois</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2 font-bold text-sky-950 dark:text-sky-200">
                <Check className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Jusqu'à <strong>10 produits</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Palette de couleurs personnalisée</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Section Offres & Services avec liens</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-sky-500 shrink-0" />
                <span>Partenaires & Témoignages illimités</span>
              </li>
            </ul>
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => onSelectPlan("SMART")}
              className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-colors cursor-pointer"
            >
              Choisir Smart
            </button>
          )}
        </div>

        {/* PREMIUM */}
        <div className="p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/20 shadow-md flex flex-col justify-between hover:border-amber-500 transition-all">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                <Crown className="w-5 h-5" />
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                Illimité
              </span>
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">PREMIUM</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-amber-600">$5.99</span>
                <span className="text-xs text-slate-500">/ mois</span>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                <Check className="w-4 h-4 shrink-0" />
                <span>Produits <strong>ILLIMITÉS</strong></span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Typographies & Polices au choix</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Galerie "Notre univers en images"</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Nom de domaine personnalisé lié</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Section FAQ dynamique</span>
              </li>
            </ul>
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => onSelectPlan("PREMIUM")}
              className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-colors cursor-pointer"
            >
              Choisir Premium
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

