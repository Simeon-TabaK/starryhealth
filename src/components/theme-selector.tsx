"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon, Monitor, Check } from "lucide-react";
import { useState } from "react";

export function ThemeSelector() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleThemeChange = async (newTheme: "light" | "dark" | "system") => {
    setTheme(newTheme);
    setSaving(true);
    setToastMessage(`Thème configuré sur : ${newTheme === "light" ? "Mode Clair" : newTheme === "dark" ? "Mode Sombre" : "Système"}`);

    try {
      await fetch("/api/user/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ theme: newTheme }),
      });
    } catch {
      // ignore
    } finally {
      setTimeout(() => {
        setSaving(false);
        setTimeout(() => setToastMessage(null), 2500);
      }, 300);
    }
  };

  const options = [
    {
      id: "light" as const,
      label: "Mode Clair",
      desc: "Idéal pour une lecture nette en plein jour",
      icon: Sun,
      iconColor: "text-amber-500",
      bgClass: "bg-amber-500/10 border-amber-500/30",
    },
    {
      id: "dark" as const,
      label: "Mode Sombre",
      desc: "Confort visuel pour environnement peu éclairé",
      icon: Moon,
      iconColor: "text-indigo-400",
      bgClass: "bg-indigo-500/10 border-indigo-500/30",
    },
    {
      id: "system" as const,
      label: "Système",
      desc: "S'adapte automatiquement à votre système d'exploitation",
      icon: Monitor,
      iconColor: "text-emerald-500",
      bgClass: "bg-emerald-500/10 border-emerald-500/30",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Préférence de Thème d'Affichage
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ce réglage est synchronisé sur votre profil en base de données et restauré sur tous vos appareils.
          </p>
        </div>
        {toastMessage && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300 animate-fade-in flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5" /> {toastMessage}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => handleThemeChange(opt.id)}
              disabled={saving}
              className={`p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? "border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 ring-2 ring-emerald-500/20 shadow-sm"
                  : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:border-slate-300 dark:hover:border-slate-700"
              }`}
            >
              <div className="flex items-start justify-between w-full mb-3">
                <div className={`p-2.5 rounded-xl border ${opt.bgClass}`}>
                  <Icon className={`w-5 h-5 ${opt.iconColor}`} />
                </div>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </span>
                )}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  {opt.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {opt.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

