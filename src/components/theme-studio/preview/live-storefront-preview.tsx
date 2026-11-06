"use client";

import React, { useState } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  ShoppingBag,
  Phone,
  Mail,
  MapPin,
  Globe,
  Sparkles,
  Check,
  Star,
} from "lucide-react";
import { DeviceViewport, ThemeStudioState } from "../types";
import { getOptimalContrastTextColor, getSecondaryTextColor } from "../color-utils";

interface LiveStorefrontPreviewProps {
  state: ThemeStudioState;
  slug?: string;
}

export function LiveStorefrontPreview({ state, slug }: LiveStorefrontPreviewProps) {
  const [viewport, setViewport] = useState<DeviceViewport>("desktop");

  const primary = state.primaryColor || "#1A1A8B";
  const secondary = state.secondaryColor || "#835C00";
  const accent = state.accentColor || "#CCAB00";
  const buttonCol = state.buttonColor || primary;

  // Header & Footer Background & Text colors
  const headerBg = state.headerColor || "#ffffff";
  const headerText = state.headerTextColor || getOptimalContrastTextColor(headerBg);
  const headerSecondaryText = getSecondaryTextColor(headerText);

  const footerBg = state.footerColor || "#0d1230";
  const footerText = state.footerTextColor || getOptimalContrastTextColor(footerBg);
  const footerSecondaryText = getSecondaryTextColor(footerText);

  // Card rounding style
  const cornerClass =
    state.cardCornerStyle === "rounded-none"
      ? "rounded-none"
      : state.cardCornerStyle === "rounded-xl"
      ? "rounded-xl"
      : "rounded-2xl";

  const selectedFont = state.fontFamily || "Inter";

  return (
    <div className="bg-slate-900 rounded-3xl p-4 sm:p-5 flex flex-col h-full border border-slate-800 shadow-2xl overflow-hidden">
      {/* Dynamic Google Fonts Link for Real-Time Typography Rendering */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Poppins:wght@400;600;700;800&family=Montserrat:wght@400;600;700;800&family=Outfit:wght@400;600;700;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap"
      />

      {/* Viewport & Device Controls */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider">Aperçu en Direct</span>
          <span className="text-[10px] text-slate-400 hidden sm:inline">
            (Police : <strong className="text-emerald-400">{selectedFont}</strong>)
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            type="button"
            onClick={() => setViewport("desktop")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewport === "desktop"
                ? "bg-slate-700 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vue Ordinateur"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("tablet")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewport === "tablet"
                ? "bg-slate-700 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vue Tablette"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Tablette</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport("mobile")}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewport === "mobile"
                ? "bg-slate-700 text-white shadow-sm font-bold"
                : "text-slate-400 hover:text-white"
            }`}
            title="Vue Mobile"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Mobile</span>
          </button>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div className="flex-1 overflow-y-auto pt-4 flex justify-center items-start bg-slate-950/60 rounded-2xl p-2 sm:p-4 my-2 border border-slate-800/80">
        <div
          className={`transition-all duration-300 bg-white text-slate-800 shadow-2xl flex flex-col overflow-hidden ${
            viewport === "mobile"
              ? "w-[360px] max-w-full rounded-[38px] border-[8px] border-slate-800 ring-1 ring-slate-700 min-h-[580px]"
              : viewport === "tablet"
              ? "w-[640px] max-w-full rounded-2xl border-4 border-slate-800 min-h-[540px]"
              : "w-full max-w-full rounded-xl border border-slate-700 min-h-[500px]"
          }`}
          style={{ fontFamily: `${selectedFont}, sans-serif` }}
        >
          {/* Mobile Speaker / Notch if mobile */}
          {viewport === "mobile" && (
            <div className="h-5 bg-slate-800 flex items-center justify-center">
              <div className="w-16 h-1 bg-slate-600 rounded-full" />
            </div>
          )}

          {/* 1. STOREFRONT HEADER */}
          <header
            className="px-4 py-3 border-b flex items-center justify-between sticky top-0 z-20 transition-colors shadow-sm"
            style={{ backgroundColor: headerBg, color: headerText }}
          >
            {/* Logo & Brand */}
            <div className="flex items-center gap-2 min-w-0">
              {state.orgLogo ? (
                <img
                  src={state.orgLogo}
                  alt={state.orgName}
                  className="w-8 h-8 rounded-lg object-contain shrink-0"
                />
              ) : (
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs shrink-0 shadow-sm"
                  style={{ backgroundColor: primary, color: "#ffffff" }}
                >
                  {(state.orgName || "S").charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <p className="font-extrabold text-xs sm:text-sm leading-tight truncate" style={{ color: headerText }}>
                  {state.orgName || "Ma Boutique Santé"}
                </p>
                {state.orgDescription && viewport !== "mobile" && (
                  <p className="text-[10px] truncate max-w-[200px]" style={{ color: headerSecondaryText }}>
                    {state.orgDescription}
                  </p>
                )}
              </div>
            </div>

            {/* Nav Menu (Desktop / Tablet) */}
            {viewport === "desktop" && (
              <nav className="flex items-center gap-3 text-xs font-medium" style={{ color: headerSecondaryText }}>
                <span className="font-bold border-b-2 pb-0.5" style={{ color: headerText, borderColor: primary }}>
                  Accueil
                </span>
                <span style={{ color: headerSecondaryText }}>Produits</span>
                <span style={{ color: headerSecondaryText }}>Avis</span>
                <span style={{ color: headerSecondaryText }}>Contact</span>
              </nav>
            )}

            {/* Cart Button */}
            {state.showCartButton && (
              <div
                className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-sm shrink-0"
                style={{ backgroundColor: buttonCol }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Panier</span>
                <span className="bg-white/25 px-1.5 py-0.2 rounded-full text-[10px]">2</span>
              </div>
            )}
          </header>

          {/* 2. STOREFRONT HERO BANNER */}
          <section
            className="p-6 sm:p-8 text-center relative overflow-hidden transition-all"
            style={{
              background: `linear-gradient(135deg, ${primary}15, ${secondary}15)`,
            }}
          >
            <div className="max-w-md mx-auto space-y-2">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-2xs"
                style={{ backgroundColor: `${accent}25`, color: secondary }}
              >
                <Sparkles className="w-3 h-3" />
                {state.heroSubtitle || "Produits 100% Naturels"}
              </span>

              <h1
                className="text-lg sm:text-2xl font-black leading-tight tracking-tight"
                style={{ color: primary }}
              >
                {state.heroTitle || "Prenez soin de votre vitalité chaque jour"}
              </h1>

              <p className="text-xs text-slate-600 line-clamp-2">
                Découvrez nos compléments alimentaires certifiés et approuvés scientifiquement.
              </p>

              <div className="pt-2 flex justify-center gap-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-xl text-white text-xs font-bold shadow-md cursor-default"
                  style={{ backgroundColor: buttonCol }}
                >
                  Découvrir le Catalogue
                </button>
              </div>
            </div>
          </section>

          {/* 3. PRODUCTS GRID */}
          <section className="p-4 sm:p-5 bg-slate-50/70 flex-1">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Produits Vedettes
                </h3>
                <p className="text-[10px] text-slate-500">Nos meilleures ventes</p>
              </div>
              <span className="text-[10px] font-semibold hover:underline" style={{ color: primary }}>
                Voir tout (12)
              </span>
            </div>

            <div
              className={`grid gap-3 ${
                viewport === "mobile" ? "grid-cols-2" : "grid-cols-3"
              }`}
            >
              {[
                {
                  id: 1,
                  name: "Spiruline Bio Active",
                  price: 24.99,
                  orig: 29.99,
                  tag: "-17%",
                  img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&q=80",
                },
                {
                  id: 2,
                  name: "Oméga 3 Haute Pureté",
                  price: 32.5,
                  orig: 39.0,
                  tag: "-16%",
                  img: "https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&q=80",
                },
                {
                  id: 3,
                  name: "Magnésium Marin & B6",
                  price: 19.9,
                  orig: null,
                  tag: null,
                  img: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&q=80",
                },
              ]
                .slice(0, viewport === "mobile" ? 2 : 3)
                .map((prod) => (
                  <div
                    key={prod.id}
                    className={`bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between overflow-hidden transition-all ${cornerClass}`}
                  >
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden">
                      <img
                        src={prod.img}
                        alt={prod.name}
                        className="w-full h-full object-cover"
                      />
                      {state.showDiscounts && prod.tag && (
                        <span
                          className="absolute top-1.5 left-1.5 text-[9px] font-extrabold text-white px-1.5 py-0.5 rounded-md shadow-xs"
                          style={{ backgroundColor: accent }}
                        >
                          {prod.tag}
                        </span>
                      )}
                    </div>

                    <div className="p-2.5 space-y-1.5">
                      <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1 leading-snug">
                        {prod.name}
                      </h4>
                      <div className="flex items-center gap-1">
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-2.5 h-2.5 fill-current" />
                          ))}
                        </div>
                        <span className="text-[9px] text-slate-400">(4.9)</span>
                      </div>
                      <div className="pt-1 space-y-1.5">
                        <div className="flex items-baseline gap-1">
                          <span className="text-xs font-black text-slate-900">
                            ${prod.price.toFixed(2)}
                          </span>
                          {prod.orig && (
                            <span className="text-[9px] text-slate-400 line-through">
                              ${prod.orig.toFixed(2)}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-1 pt-0.5">
                          <button
                            type="button"
                            className="w-full py-1 rounded-md text-white text-[10px] font-bold flex items-center justify-center gap-1 shadow-2xs"
                            style={{ backgroundColor: buttonCol }}
                          >
                            <ShoppingBag className="w-2.5 h-2.5" />
                            <span>Commander</span>
                          </button>
                          <span className="w-full py-1 rounded-md text-slate-600 bg-slate-100 text-[10px] font-medium flex items-center justify-center text-center">
                            Détails
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>

          {/* 4. STOREFRONT FOOTER */}
          <footer
            className="p-4 sm:p-5 border-t mt-auto transition-colors"
            style={{ backgroundColor: footerBg, color: footerText }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-white/10">
              <div>
                <p className="font-extrabold text-xs" style={{ color: footerText }}>
                  {state.orgName || "Starry Health"}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: footerSecondaryText }}>
                  {state.contactAddress || "Kinshasa & International"}
                </p>
                <p className="text-[10px]" style={{ color: footerSecondaryText }}>
                  {state.contactEmail || "contact@sboxx.site"}
                </p>
              </div>

              <div className="text-left sm:text-right space-y-1">
                <span className="text-[10px] uppercase font-bold" style={{ color: footerText }}>
                  Commandes Directes
                </span>
                <p className="text-[10px] font-semibold" style={{ color: accent }}>
                  WhatsApp: {state.whatsapp || "+243 969 131 138"}
                </p>
              </div>
            </div>

            <div className="pt-2 text-[9px] text-center" style={{ color: footerSecondaryText }}>
              {state.copyright || `© ${new Date().getFullYear()} Starry Health. Tous droits réservés.`}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
