"use client";

import React, { useState } from "react";
import { User, Building, Palette, Save } from "lucide-react";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { ThemeModule } from "@/components/theme-module";
import { ThemeSelector } from "@/components/theme-selector";

interface SettingsTabProps {
  user: any;
  onNotify: (message: string, type?: "success" | "error", description?: string) => void;
  onUpdateProfile: (formData: FormData) => Promise<any>;
}

export function SettingsTab({
  user,
  onNotify,
  onUpdateProfile,
}: SettingsTabProps) {
  const [settingsSubTab, setSettingsSubTab] = useState<"profile" | "theme">("profile");
  const [saving, setSaving] = useState(false);

  const [orgLogoUrl, setOrgLogoUrl] = useState<string>(user.tenantConfig?.orgLogo || "");
  const [faviconUrl, setFaviconUrl] = useState<string>((user.tenantConfig as any)?.favicon || "");
  const [avatarUrl, setAvatarUrl] = useState<string>(user.avatar || "");

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    if (orgLogoUrl) formData.set("orgLogo", orgLogoUrl);
    if (faviconUrl) formData.set("favicon", faviconUrl);
    if (avatarUrl) formData.set("avatar", avatarUrl);
    try {
      await onUpdateProfile(formData);
      const effectiveFavicon = faviconUrl || orgLogoUrl;
      if (typeof window !== "undefined" && effectiveFavicon) {
        window.dispatchEvent(new CustomEvent("tenant-favicon-change", { detail: effectiveFavicon }));
      }
      onNotify("Profil et organisation enregistrés !", "success", "Vos informations personnelles et vitrine ont été mises à jour.");
    } catch (err: any) {
      onNotify("Erreur de sauvegarde", "error", err.message || "Impossible de sauvegarder votre profil.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Sub-tabs Selector */}
      <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        <button
          type="button"
          onClick={() => setSettingsSubTab("profile")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${settingsSubTab === "profile"
            ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          Profil & Organisation
        </button>
        <button
          type="button"
          onClick={() => setSettingsSubTab("theme")}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${settingsSubTab === "theme"
            ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
            : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
            }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Thème & Apparence
        </button>
      </div>

      {/* Condition 1: Thème & Apparence */}
      {settingsSubTab === "theme" && (
        <ThemeModule
          user={user}
          onSave={async (formData) => {
            setSaving(true);
            try {
              await onUpdateProfile(formData);
              onNotify("Thème et couleurs sauvegardés avec succès !");
            } catch (err: any) {
              onNotify(err.message || "Erreur de sauvegarde.", "error");
            } finally {
              setSaving(false);
            }
          }}
          saving={saving}
        />
      )}

      {/* Condition 2: Profil & Organisation */}
      {settingsSubTab === "profile" && (
        <form onSubmit={handleProfileSubmit} className="space-y-8">
          {/* 1. INFORMATIONS PERSONNELLES DU COMPTE */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  1. Informations Personnelles du Gestionnaire
                </h2>
                <p className="text-xs text-slate-500">
                  Votre photo de profil personnelle et vos coordonnées de compte utilisateur.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Avatar personnel */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Photo de profil personnelle (Avatar)
                </label>
                <CloudinaryUpload
                  folder="starryhealth/avatars"
                  cropAspect="1:1"
                  onUpload={(url) => setAvatarUrl(url)}
                  currentUrl={avatarUrl}
                  label="Uploader ma photo de profil"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
                <input type="hidden" name="avatar" value={avatarUrl} />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user.name || ""}
                    placeholder="Ex: Dr. Martin Dupont"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Adresse Email de connexion</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email || ""}
                    placeholder="votre.email@exemple.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Téléphone personnel</label>
                  <input
                    type="text"
                    name="contactPhone"
                    defaultValue={user.contactPhone || ""}
                    placeholder="+243 990 000 000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold block mb-1">Biographie / À propos de vous</label>
                <textarea
                  name="bio"
                  rows={2}
                  defaultValue={user.bio || ""}
                  placeholder="Présentez brièvement votre parcours ou votre rôle..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 2. ORGANISATION COMMERCIALE & VITRINE (TENANT) */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  2. Organisation Commerciale & Vitrine Publique
                </h2>
                <p className="text-xs text-slate-500">
                  Le logo officiel de votre boutique et les coordonnées affichées sur votre sous-domaine.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Logo d'organisation */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Logo officiel de l'Organisation / Boutique
                </label>
                <CloudinaryUpload
                  folder="starryhealth/logos"
                  cropAspect="4:3"
                  onUpload={(url) => {
                    setOrgLogoUrl(url);
                    if (!faviconUrl && typeof window !== "undefined" && url) {
                      window.dispatchEvent(new CustomEvent("tenant-favicon-change", { detail: url }));
                    }
                  }}
                  currentUrl={orgLogoUrl}
                  label="Uploader et rogner le logo de la boutique"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
                <input type="hidden" name="orgLogo" value={orgLogoUrl} />
              </div>

              {/* Favicon personnalisé d'onglet */}
              <div>
                <label className="text-xs font-semibold block mb-1">
                  Favicon personnalisé (Onglet navigateur)
                </label>
                <CloudinaryUpload
                  folder="starryhealth/favicons"
                  cropAspect="1:1"
                  onUpload={(url) => {
                    setFaviconUrl(url);
                    if (typeof window !== "undefined" && url) {
                      window.dispatchEvent(new CustomEvent("tenant-favicon-change", { detail: url }));
                    }
                  }}
                  currentUrl={faviconUrl}
                  label="Uploader le favicon d'onglet (Carré 1:1)"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
                <input type="hidden" name="favicon" value={faviconUrl} />
                <p className="text-[11px] text-slate-500 mt-1">
                  Icône affichée dans l'onglet du navigateur pour votre vitrine / sous-domaine (fallback automatique sur StarryHealth si vide).
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Nom de l'organisation / Boutique</label>
                  <input
                    type="text"
                    name="orgName"
                    defaultValue={user.tenantConfig?.orgName || ""}
                    placeholder="Cabinet Santé, Espace Nutrition..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">WhatsApp de Commande Client</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={user.whatsapp || ""}
                    placeholder="+243990000000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1">Email professionnel pour la vitrine</label>
                  <input
                    type="email"
                    name="contactEmail"
                    defaultValue={user.contactEmail || ""}
                    placeholder="contact@mondomaine.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold block mb-1">Présentation de la boutique / Activité</label>
                <textarea
                  name="orgDescription"
                  rows={2}
                  defaultValue={user.tenantConfig?.orgDescription || ""}
                  placeholder="Présentez l'activité de votre boutique aux visiteurs..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Adresse physique / Ville</label>
                <input
                  type="text"
                  name="contactAddress"
                  defaultValue={user.contactAddress || ""}
                  placeholder="Av. du Commerce, Goma / Kinshasa"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Site Web externe (optionnel)</label>
                <input
                  type="url"
                  name="contactWebsite"
                  defaultValue={user.contactWebsite || ""}
                  placeholder="https://monsite.com"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-semibold block mb-1">Mention légale & Copyright</label>
                <input
                  type="text"
                  name="copyright"
                  defaultValue={user.copyright || ""}
                  placeholder="© 2026 Mon Entreprise. Tous droits réservés."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
            </div>
          </div>

          {/* 3. RÉSEAUX SOCIAUX DE L'ORGANISATION */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Réseaux Sociaux de la Vitrine
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Facebook</label>
                <input type="url" name="facebook" defaultValue={user.facebook || ""} placeholder="https://facebook.com/..." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">LinkedIn</label>
                <input type="url" name="linkedin" defaultValue={user.linkedin || ""} placeholder="https://linkedin.com/in/..." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">TikTok</label>
                <input type="url" name="tiktok" defaultValue={user.tiktok || ""} placeholder="https://tiktok.com/@..." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Instagram</label>
                <input type="url" name="instagram" defaultValue={user.instagram || ""} placeholder="https://instagram.com/..." className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm" />
              </div>
            </div>
          </div>

          {/* PRÉFÉRENCE SECONDAIRE : MODE D'AFFICHAGE (DARK / LIGHT) */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-3">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Préférence d'affichage & Thème
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Option secondaire : choisissez l'ambiance visuelle claire, sombre ou calquée sur votre système.
              </p>
            </div>
            <ThemeSelector />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
            >
              <Save className="w-4 h-4" />
              {saving ? "Enregistrement..." : "Enregistrer toutes les modifications"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

