"use client";

import React from "react";
import { FileText, HelpCircle, Phone, Info, Layers, ChevronRight } from "lucide-react";

interface CustomPagesSectionProps {
  onNavigateTab: (tabId: string) => void;
}

export function CustomPagesSection({ onNavigateTab }: CustomPagesSectionProps) {
  const PAGES = [
    {
      id: "about",
      name: "Page À Propos",
      desc: "Histoire de votre boutique, engagements qualité et certifications",
      icon: Info,
      actionTab: "profile",
      actionLabel: "Modifier ma biographie",
    },
    {
      id: "faq",
      name: "Foire Aux Questions (FAQ)",
      desc: "Questions courantes de vos clients sur vos produits et livraisons",
      icon: HelpCircle,
      actionTab: "services",
      actionLabel: "Gérer mes FAQ",
    },
    {
      id: "services",
      name: "Services & Offres",
      desc: "Prestations d'accompagnement, consultations ou packs personnalisés",
      icon: Layers,
      actionTab: "services",
      actionLabel: "Gérer mes Services",
    },
    {
      id: "contact",
      name: "Page Contact Direct",
      desc: "Formulaire de contact, messagerie WhatsApp et coordonnées géographiques",
      icon: Phone,
      actionTab: "profile",
      actionLabel: "Modifier mes coordonnées",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          Pages Personnalisées & Contenu
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Accédez rapidement aux sections et pages dédiées de votre vitrine.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {PAGES.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between space-y-3 shadow-xs"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">{p.desc}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(p.actionTab)}
                className="w-full py-2 px-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-between cursor-pointer transition-colors"
              >
                <span>{p.actionLabel}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

