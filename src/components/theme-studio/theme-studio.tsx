"use client";

import React, { useState } from "react";
import {
  Building,
  Palette,
  LayoutTemplate,
  PanelBottom,
  Home,
  Package,
  FileText,
  Camera,
  Search,
  Save,
  Loader2,
  ChevronDown,
  X,
  Check,
  SlidersHorizontal,
} from "lucide-react";
import { StudioSection, ThemeStudioState } from "./types";
import { LiveStorefrontPreview } from "./preview/live-storefront-preview";
import { IdentitySection } from "./sections/identity-section";
import { ColorsBrandingSection } from "./sections/colors-branding-section";
import { HeaderSection } from "./sections/header-section";
import { FooterSection } from "./sections/footer-section";
import { HomeSection } from "./sections/home-section";
import { ProductsCatalogSection } from "./sections/products-catalog-section";
import { CustomPagesSection } from "./sections/custom-pages-section";
import { MediaSection } from "./sections/media-section";
import { AdvancedSeoSection } from "./sections/advanced-seo-section";
import { encodeColorWithText, parseColorWithText } from "./color-utils";

interface ThemeStudioProps {
  user: any;
  onNotify: (message: string, type?: "success" | "error" | "warning", description?: string) => void;
  onUpdateProfile: (formData: FormData) => Promise<any>;
  onNavigateTab: (tabId: string) => void;
}

const STUDIO_SECTIONS: { id: StudioSection; label: string; icon: React.ElementType; badge?: string }[] = [
  { id: "identity", label: "Identité Visuelle", icon: Building },
  { id: "colors", label: "Couleurs & Branding", icon: Palette, badge: "Populaire" },
  { id: "header", label: "En-tête (Header)", icon: LayoutTemplate },
  { id: "footer", label: "Pied de page (Footer)", icon: PanelBottom },
  { id: "home", label: "Page d'accueil", icon: Home },
  { id: "products", label: "Catalogue Produits", icon: Package },
  { id: "pages", label: "Pages personnalisées", icon: FileText },
  { id: "media", label: "Médias & Galerie", icon: Camera },
  { id: "advanced", label: "Paramètres & SEO", icon: Search },
];

export function ThemeStudio({
  user,
  onNotify,
  onUpdateProfile,
  onNavigateTab,
}: ThemeStudioProps) {
  const config = user.tenantConfig || {};
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const plan = user.subscriptionPlan as string | null;
  const canCustomColors = isSuperAdmin || plan === "SMART" || plan === "PREMIUM";
  const canCustomFont = isSuperAdmin || plan === "PREMIUM";
  const hasPremiumFeatures = isSuperAdmin || plan === "PREMIUM";

  // Parse header and footer colors (which may contain "bgColor|textColor")
  const parsedHeader = parseColorWithText(config.headerColor, "#ffffff");
  const parsedFooter = parseColorWithText(config.footerColor, "#0d1230");

  // Initialisation de l'état réactif du studio
  const [state, setState] = useState<ThemeStudioState>({
    orgName: config.orgName || user.name || "",
    orgDescription: config.orgDescription || user.bio || "",
    orgLogo: config.orgLogo || "",
    favicon: (config as any)?.favicon || "",

    primaryColor: user.primaryColor || "#1A1A8B",
    secondaryColor: config.secondaryColor || "#835C00",
    accentColor: config.accentColor || "#CCAB00",
    buttonColor: config.buttonColor || user.primaryColor || "#1A1A8B",

    headerColor: parsedHeader.bg,
    headerTextColor: parsedHeader.text,

    footerColor: parsedFooter.bg,
    footerTextColor: parsedFooter.text,

    dashboardBgColor: config.dashboardBgColor || "#f8fafc",
    sidebarBgColor: config.sidebarBgColor || "#0f172a",
    sidebarTextColor: config.sidebarTextColor || "#f8fafc",
    fontFamily: config.fontFamily || "Inter",

    headerStyle: "minimal",
    showCartButton: true,

    contactEmail: user.contactEmail || user.email || "",
    contactPhone: user.contactPhone || "",
    contactAddress: user.contactAddress || "Kinshasa, RDC & International",
    contactWebsite: user.contactWebsite || "www.sboxx.site",
    whatsapp: user.whatsapp || "",
    facebook: user.facebook || "",
    instagram: user.instagram || "",
    linkedin: user.linkedin || "",
    tiktok: user.tiktok || "",
    copyright: user.copyright || `© ${new Date().getFullYear()} ${config.orgName || "Starry Health"}. Tous droits réservés.`,

    heroTitle: "Prenez soin de votre vitalité chaque jour",
    heroSubtitle: "Produits 100% Naturels & Certifiés",
    heroBannerUrl: "",

    cardCornerStyle: "rounded-2xl",
    showDiscounts: true,
  });

  const [activeSection, setActiveSection] = useState<StudioSection>("identity");
  const [saving, setSaving] = useState(false);
  const [mobileTabMode, setMobileTabMode] = useState<"editor" | "preview">("editor");
  const [sectionModalOpen, setSectionModalOpen] = useState(false);

  const currentSectionObj = STUDIO_SECTIONS.find((s) => s.id === activeSection) || STUDIO_SECTIONS[0];
  const CurrentSectionIcon = currentSectionObj.icon;

  const handleStateChange = (patch: Partial<ThemeStudioState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  };

  const handleSave = async () => {
    setSaving(true);
    const formData = new FormData();

    // Identité
    formData.set("orgName", state.orgName);
    formData.set("orgDescription", state.orgDescription);
    if (state.orgLogo) formData.set("orgLogo", state.orgLogo);
    if (state.favicon) formData.set("favicon", state.favicon);

    // Couleurs & Design
    formData.set("primaryColor", state.primaryColor);
    formData.set("secondaryColor", state.secondaryColor);
    formData.set("accentColor", state.accentColor);
    formData.set("buttonColor", state.buttonColor);

    // Encodage intelligent des couleurs avec texte associé pour pérennité
    formData.set("headerColor", encodeColorWithText(state.headerColor, state.headerTextColor));
    formData.set("footerColor", encodeColorWithText(state.footerColor, state.footerTextColor));

    formData.set("sidebarBgColor", state.sidebarBgColor);
    formData.set("sidebarTextColor", state.sidebarTextColor);
    formData.set("dashboardBgColor", state.dashboardBgColor);
    formData.set("fontFamily", state.fontFamily);

    // Coordonnées & Réseaux
    formData.set("contactEmail", state.contactEmail);
    formData.set("contactPhone", state.contactPhone);
    formData.set("contactAddress", state.contactAddress);
    formData.set("contactWebsite", state.contactWebsite);
    formData.set("whatsapp", state.whatsapp);
    formData.set("facebook", state.facebook);
    formData.set("instagram", state.instagram);
    formData.set("linkedin", state.linkedin);
    formData.set("tiktok", state.tiktok);
    formData.set("copyright", state.copyright);

    try {
      await onUpdateProfile(formData);

      // Mettre à jour le favicon dynamique si changé
      if (typeof window !== "undefined" && state.favicon) {
        window.dispatchEvent(new CustomEvent("tenant-favicon-change", { detail: state.favicon }));
      }

      onNotify(
        "Thème et apparence sauvegardés avec succès !",
        "success",
        "Toutes vos personnalisations sont maintenant actives sur votre vitrine."
      );
    } catch (err: any) {
      onNotify("Erreur de sauvegarde", "error", err.message || "Impossible d'enregistrer le thème.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Barre d'action supérieure */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Studio Thème & Apparence
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              Éditeur Visuel
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Personnalisez votre boutique de manière intuitive avec aperçu interactif en direct.
          </p>
        </div>

        {/* Boutons d'action */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Mobile switcher: Éditeur / Aperçu */}
          <div className="lg:hidden flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setMobileTabMode("editor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTabMode === "editor" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
              }`}
            >
              Éditeur
            </button>
            <button
              type="button"
              onClick={() => setMobileTabMode("preview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                mobileTabMode === "preview" ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs" : "text-slate-500"
              }`}
            >
              Aperçu direct
            </button>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50 transition-all hover:scale-102"
          >
            {saving ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Enregistrement...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Publier les modifications</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Bouton épinglé au-dessus pour Mobile & Tablette (Sticky sous le header) */}
      <div className={`lg:hidden sticky top-0 z-20 transition-all ${
        mobileTabMode === "preview" ? "hidden" : "block"
      }`}>
        <button
          type="button"
          onClick={() => setSectionModalOpen(true)}
          className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 dark:border-slate-800/90 shadow-md flex items-center justify-between gap-3 text-left transition-all active:scale-[0.99] cursor-pointer hover:border-emerald-500/50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-[#1A1A8B]/10 dark:bg-indigo-500/20 text-[#1A1A8B] dark:text-indigo-300 flex items-center justify-center shrink-0">
              <CurrentSectionIcon className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Section de personnalisation
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                  {currentSectionObj.label}
                </span>
                {currentSectionObj.badge && (
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shrink-0">
                    {currentSectionObj.badge}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 px-3 py-1.5 rounded-xl text-xs font-bold shrink-0">
            <span>Changer</span>
            <ChevronDown className="w-3.5 h-3.5" />
          </div>
        </button>
      </div>

      {/* Modal Popup des Sections (Mobile & Tablette) */}
      {sectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="fixed inset-0"
            onClick={() => setSectionModalOpen(false)}
          />
          <div className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-5 z-10 space-y-4 max-h-[85vh] flex flex-col animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  Sections de personnalisation
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sélectionnez la partie du site à modifier
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSectionModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center text-slate-500 cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5 overflow-y-auto flex-1 pr-1">
              {STUDIO_SECTIONS.map((sec) => {
                const Icon = sec.icon;
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    type="button"
                    onClick={() => {
                      setActiveSection(sec.id);
                      setSectionModalOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#1A1A8B] text-white shadow-md font-bold"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isActive ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm">{sec.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {sec.badge && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                        }`}>
                          {sec.badge}
                        </span>
                      )}
                      {isActive && <Check className="w-4 h-4 text-emerald-400" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Disposition principale : Colonne gauche (Catégories + Formulaire) et Colonne droite (Live Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Navigation des 9 sous-sections (Desktop uniquement) */}
        <div className="hidden lg:block lg:col-span-3 space-y-1.5 bg-white dark:bg-slate-900 p-2 sm:p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Sections de personnalisation
          </div>
          {STUDIO_SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#1A1A8B] text-white shadow-sm font-bold"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                  <span>{sec.label}</span>
                </div>
                {sec.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                  }`}>
                    {sec.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Panneau de configuration actif */}
        <div className={`lg:col-span-5 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs min-h-[460px] ${
          mobileTabMode === "preview" ? "hidden lg:block" : "block"
        }`}>
          {activeSection === "identity" && (
            <IdentitySection
              state={state}
              onChange={handleStateChange}
              primaryColor={state.primaryColor}
            />
          )}

          {activeSection === "colors" && (
            <ColorsBrandingSection
              state={state}
              onChange={handleStateChange}
              canCustomColors={canCustomColors}
              canCustomFont={canCustomFont}
            />
          )}

          {activeSection === "header" && (
            <HeaderSection
              state={state}
              onChange={handleStateChange}
              canCustomColors={canCustomColors}
            />
          )}

          {activeSection === "footer" && (
            <FooterSection
              state={state}
              onChange={handleStateChange}
            />
          )}

          {activeSection === "home" && (
            <HomeSection
              state={state}
              onChange={handleStateChange}
              primaryColor={state.primaryColor}
            />
          )}

          {activeSection === "products" && (
            <ProductsCatalogSection
              state={state}
              onChange={handleStateChange}
            />
          )}

          {activeSection === "pages" && (
            <CustomPagesSection onNavigateTab={onNavigateTab} />
          )}

          {activeSection === "media" && (
            <MediaSection
              onNavigateTab={onNavigateTab}
              hasPremiumFeatures={hasPremiumFeatures}
            />
          )}

          {activeSection === "advanced" && (
            <AdvancedSeoSection
              state={state}
              onChange={handleStateChange}
              slug={user.slug}
            />
          )}
        </div>

        {/* Colonne droite : Live Storefront Preview interactive */}
        <div className={`lg:col-span-4 sticky top-4 h-[600px] ${
          mobileTabMode === "editor" ? "hidden lg:block" : "block"
        }`}>
          <LiveStorefrontPreview state={state} slug={user.slug} />
        </div>
      </div>
    </div>
  );
}
