"use client";

import { useState } from "react";
import { Palette, Eye, Save, Sparkles, Check } from "lucide-react";

interface ThemeModuleProps {
  user: any;
  onSave: (formData: FormData) => Promise<void>;
  saving: boolean;
}

interface ColorField {
  name: string;
  label: string;
  description: string;
  defaultValue: string;
  requiresPlan?: "SMART" | "PREMIUM";
  group: "identity" | "layout";
}

const COLOR_FIELDS: ColorField[] = [
  { name: "primaryColor", label: "Couleur Principale", description: "Couleur dominante de votre marque", defaultValue: "#0f766e", group: "identity" },
  { name: "secondaryColor", label: "Couleur Secondaire", description: "Complément de la couleur principale", defaultValue: "#134e4a", group: "identity", requiresPlan: "SMART" },
  { name: "accentColor", label: "Couleur d'Accentuation", description: "Mise en valeur et call-to-action", defaultValue: "#10b981", group: "identity", requiresPlan: "SMART" },
  { name: "buttonColor", label: "Couleur des Boutons", description: "Boutons principaux et actions rapides", defaultValue: "#0f766e", group: "identity", requiresPlan: "SMART" },
  { name: "headerColor", label: "Couleur de l'En-tête (Header)", description: "Arrière-plan de la barre supérieure", defaultValue: "#ffffff", group: "layout", requiresPlan: "SMART" },
  { name: "sidebarBgColor", label: "Arrière-plan du Menu (Sidebar)", description: "Couleur de fond du menu latéral", defaultValue: "#ffffff", group: "layout", requiresPlan: "SMART" },
  { name: "sidebarTextColor", label: "Texte du Menu Latéral", description: "Couleur des liens et labels du menu", defaultValue: "#1e293b", group: "layout", requiresPlan: "SMART" },
  { name: "footerColor", label: "Couleur du Pied de Page (Footer)", description: "Arrière-plan du bas de page", defaultValue: "#0f172a", group: "layout", requiresPlan: "SMART" },
  { name: "dashboardBgColor", label: "Arrière-plan Dashboard", description: "Fond principal du tableau de bord", defaultValue: "#f8fafc", group: "layout", requiresPlan: "SMART" },
];

export function ThemeModule({ user, onSave, saving }: ThemeModuleProps) {
  const plan = user.subscriptionPlan as string | null;
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const canCustomColors = isSuperAdmin || plan === "SMART" || plan === "PREMIUM";

  const getInitialColor = (name: string): string => {
    if (name === "primaryColor") return user.primaryColor || "#0f766e";
    const config = user.tenantConfig;
    if (!config) return COLOR_FIELDS.find(f => f.name === name)?.defaultValue || "#ffffff";
    return (config as any)[name] || COLOR_FIELDS.find(f => f.name === name)?.defaultValue || "#ffffff";
  };

  const [colors, setColors] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    COLOR_FIELDS.forEach(f => { initial[f.name] = getInitialColor(f.name); });
    return initial;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    COLOR_FIELDS.forEach(f => {
      formData.set(f.name, colors[f.name]);
    });
    await onSave(formData);
  };

  const identityFields = COLOR_FIELDS.filter(f => f.group === "identity");
  const layoutFields = COLOR_FIELDS.filter(f => f.group === "layout");

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* 1. Couleurs de la Marque (Thème) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
              <Palette className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Couleurs de la Marque</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Définissez la couleur principale, secondaire, d'accentuation et des boutons.
              </p>
            </div>
          </div>
          {!canCustomColors && (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
              Forfait SMART ou PREMIUM requis pour débloquer toutes les couleurs
            </span>
          )}
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {identityFields.map((field) => {
            const locked = field.requiresPlan && !canCustomColors;
            return (
              <div key={field.name} className={`space-y-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 ${locked ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {field.label}
                  </label>
                  {locked && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 uppercase">
                      {field.requiresPlan}+
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name={field.name}
                    value={colors[field.name]}
                    onChange={(e) => !locked && setColors(prev => ({ ...prev, [field.name]: e.target.value }))}
                    disabled={locked}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 disabled:cursor-not-allowed shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={colors[field.name]}
                      onChange={(e) => {
                        if (!locked && /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                          setColors(prev => ({ ...prev, [field.name]: e.target.value }));
                        }
                      }}
                      disabled={locked}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-60"
                      placeholder="#000000"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">{field.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Apparence de l'Interface (Header, Sidebar, Footer, Bg) */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center">
              <Eye className="w-5 h-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white">Apparence de l'Interface & Structure</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Configurez les couleurs des éléments clés : En-tête, Menu latéral, Pied de page et Fond d'écran.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {layoutFields.map((field) => {
            const locked = field.requiresPlan && !canCustomColors;
            return (
              <div key={field.name} className={`space-y-2 p-4 rounded-xl border border-slate-100 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30 ${locked ? "opacity-60" : ""}`}>
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {field.label}
                  </label>
                  {locked && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 uppercase">
                      {field.requiresPlan}+
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name={field.name}
                    value={colors[field.name]}
                    onChange={(e) => !locked && setColors(prev => ({ ...prev, [field.name]: e.target.value }))}
                    disabled={locked}
                    className="w-12 h-10 rounded-xl cursor-pointer border border-slate-300 dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 disabled:cursor-not-allowed shrink-0"
                  />
                  <div className="flex-1">
                    <input
                      type="text"
                      value={colors[field.name]}
                      onChange={(e) => {
                        if (!locked && /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
                          setColors(prev => ({ ...prev, [field.name]: e.target.value }));
                        }
                      }}
                      disabled={locked}
                      className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-mono bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-60"
                      placeholder="#000000"
                    />
                    <p className="text-[11px] text-slate-400 mt-1">{field.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Aperçu Interactif en Temps Réel */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Aperçu Dynamique du Thème
        </h4>

        <div className="rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 shadow-sm">
          {/* Header Preview */}
          <div className="p-3.5 flex items-center justify-between border-b border-slate-200/50" style={{ backgroundColor: colors.headerColor }}>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: colors.primaryColor }}>
                S
              </div>
              <span className="font-bold text-xs" style={{ color: colors.sidebarTextColor }}>Mon Espace Santé</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: colors.accentColor }}>
                En ligne
              </span>
            </div>
          </div>

          {/* Body with Sidebar and Content Preview */}
          <div className="flex" style={{ backgroundColor: colors.dashboardBgColor, minHeight: "110px" }}>
            <div className="w-40 p-3 flex flex-col gap-2 border-r border-slate-200/40" style={{ backgroundColor: colors.sidebarBgColor }}>
              <div className="text-[11px] font-bold" style={{ color: colors.sidebarTextColor }}>Navigation</div>
              <div className="h-2 rounded-full w-4/5" style={{ backgroundColor: colors.sidebarTextColor, opacity: 0.4 }} />
              <div className="h-2 rounded-full w-3/5" style={{ backgroundColor: colors.sidebarTextColor, opacity: 0.3 }} />
              <div className="h-2 rounded-full w-2/3" style={{ backgroundColor: colors.sidebarTextColor, opacity: 0.3 }} />
            </div>
            <div className="flex-1 p-4 flex flex-col justify-between">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-800 dark:text-slate-100">Tableau de bord personnalisé</div>
                <p className="text-[10px] text-slate-500">Tous les composants s'adaptent dynamiquement à votre identité visuelle.</p>
              </div>
              <div className="flex gap-2 pt-2">
                <div className="h-7 px-3.5 rounded-lg flex items-center text-white text-[11px] font-bold shadow-sm" style={{ backgroundColor: colors.buttonColor }}>
                  Bouton Principal
                </div>
                <div className="h-7 px-3.5 rounded-lg flex items-center text-white text-[11px] font-bold shadow-sm" style={{ backgroundColor: colors.accentColor }}>
                  Action Secondaire
                </div>
              </div>
            </div>
          </div>

          {/* Footer Preview */}
          <div className="p-2.5 text-[10px] text-center font-semibold text-white" style={{ backgroundColor: colors.footerColor }}>
            © Starry Health — Vitrine Propulsée par votre Thème
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md text-xs transition-transform hover:scale-105 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? "Enregistrement..." : "Enregistrer les modifications du thème"}
        </button>
      </div>
    </form>
  );
}

