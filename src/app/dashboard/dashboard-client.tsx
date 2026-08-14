"use client";

import { useState } from "react";
import {
  User as UserIcon,
  ShieldCheck,
  Tag,
  Images,
  MessageSquare,
  CheckCircle2,
  Lock,
  Plus,
  Palette,
  Save,
  Users,
  Package,
} from "lucide-react";
import {
  updateUserProfile,
  updateCustomProductPrice,
  addUserCarouselItem,
  addUserTestimonial,
  toggleUserSubscription,
  createGlobalProduct,
} from "./actions";

interface DashboardClientProps {
  user: any;
  products: any[];
  customPrices: any[];
  userCarousel: any[];
  userTestimonials: any[];
  allUsers?: any[];
}

export function DashboardClient({
  user,
  products,
  customPrices,
  userCarousel,
  userTestimonials,
  allUsers = [],
}: DashboardClientProps) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const [activeTab, setActiveTab] = useState(isSuperAdmin ? "overview" : "profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // Price overrides local state map
  const [pricesState, setPricesState] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    customPrices.forEach((cp) => {
      map[cp.productId] = cp.customPrice;
    });
    return map;
  });

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserProfile(user.id, formData);
      setMsg("Profil et thème mis à jour avec succès !");
    } catch {
      setMsg("Erreur lors de la mise à jour.");
    } finally {
      setSaving(false);
    }
  };

  const handlePriceSave = async (productId: number) => {
    const priceVal = pricesState[productId];
    if (!priceVal) return;
    setSaving(true);
    setMsg(null);
    try {
      await updateCustomProductPrice(user.id, productId, priceVal);
      setMsg("Prix personnalisé enregistré !");
    } catch (err: any) {
      setMsg(err.message || "Erreur de mise à jour du prix.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddCarousel = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addUserCarouselItem(user.id, formData);
      setMsg("Slide de carrousel ajoutée !");
      (e.target as HTMLFormElement).reset();
    } catch {
      setMsg("Erreur d'ajout de la slide.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addUserTestimonial(user.id, formData);
      setMsg("Témoignage client ajouté !");
      (e.target as HTMLFormElement).reset();
    } catch {
      setMsg("Erreur d'ajout du témoignage.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddProductAdmin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createGlobalProduct(formData);
      setMsg("Nouveau produit ajouté au catalogue principal !");
      (e.target as HTMLFormElement).reset();
    } catch {
      setMsg("Erreur de création de produit.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Header Card */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-2xl font-extrabold shadow-lg">
            {user.name ? user.name.charAt(0) : "U"}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">{user.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/30">
                {isSuperAdmin ? "SUPER ADMIN" : "MEMBRE DISTRIBUTEUR"}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Sous-domaine : <strong className="text-emerald-700 dark:text-emerald-300">{user.slug}.starryhealth.com</strong>
            </p>
          </div>
        </div>

        {/* Subscription Status Badge */}
        {!isSuperAdmin && (
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <div className="text-xs">
              <span className="text-slate-500 dark:text-slate-400 block">Statut Abonnement Starry Boxx</span>
              <strong className={user.subscriptionStatus === "ACTIVE" ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}>
                {user.subscriptionStatus === "ACTIVE" ? "ACTIF (Offre Pro / Vitrine)" : "GRATUIT (Standard)"}
              </strong>
            </div>
          </div>
        )}
      </div>

      {msg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {/* Main Grid: Sidebar Nav + Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-2 h-fit shadow-sm">
          {isSuperAdmin ? (
            <>
              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "overview" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Users className="w-4 h-4" /> Vue d'ensemble Plateforme
              </button>
              <button
                onClick={() => setActiveTab("products_admin")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "products_admin" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Package className="w-4 h-4" /> Catalogue Produits Globaux
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setActiveTab("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "profile" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <UserIcon className="w-4 h-4" /> Profil & Sous-domaine
              </button>

              <button
                onClick={() => setActiveTab("prices")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "prices" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Tag className="w-4 h-4" /> Mes Prix Produits
              </button>

              <button
                onClick={() => setActiveTab("carousel")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "carousel" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Images className="w-4 h-4" /> Mon Carrousel VIP
              </button>

              <button
                onClick={() => setActiveTab("testimonials")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === "testimonials" ? "bg-emerald-600 text-white shadow-md" : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <MessageSquare className="w-4 h-4" /> Mes Témoignages
              </button>
            </>
          )}
        </div>

        {/* Content Area */}
        <div className="md:col-span-3">
          
          {/* USER TAB 1: PROFILE & THEME */}
          {activeTab === "profile" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Palette className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Personnalisation du Profil & Thème
              </h2>

              <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nom Complet</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={user.name || ""}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Couleur Primaire du Thème</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        name="primaryColor"
                        defaultValue={user.primaryColor || "#0f766e"}
                        className="w-12 h-10 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 cursor-pointer"
                      />
                      <span className="text-slate-500 dark:text-slate-400 text-xs">Personnalise la bannière et les boutons</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Biographie / Présentation</label>
                  <textarea
                    name="bio"
                    rows={4}
                    defaultValue={user.bio || ""}
                    placeholder="Expliquez votre parcours et votre vision de la santé naturelle..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Téléphone</label>
                    <input
                      type="text"
                      name="contactPhone"
                      defaultValue={user.contactPhone || ""}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Email de Contact</label>
                    <input
                      type="email"
                      name="contactEmail"
                      defaultValue={user.contactEmail || user.email}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Numéro WhatsApp</label>
                    <input
                      type="text"
                      name="whatsapp"
                      defaultValue={user.whatsapp || ""}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 text-sm shadow-md"
                >
                  <Save className="w-4 h-4" /> Enregistrer le profil
                </button>
              </form>
            </div>
          )}

          {/* USER TAB 2: PRODUCT PRICES */}
          {activeTab === "prices" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Tag className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Ajustement des Prix Produits
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fixez vos prix de vente personnalisés sur votre boutique.
                  </p>
                </div>

                {user.subscriptionStatus !== "ACTIVE" && (
                  <div className="px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-medium flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Requièert Abonnement Actif
                  </div>
                )}
              </div>

              {user.subscriptionStatus !== "ACTIVE" ? (
                <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl space-y-3 border border-slate-200 dark:border-slate-800">
                  <Lock className="w-10 h-10 text-amber-500 dark:text-amber-400 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">Abonnement Starry Boxx Inactif</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto">
                    Pour débloquer la personnalisation des prix et appliquer des tarifs réduits sur votre sous-domaine, activez votre forfait Starry Boxx Pro.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((p) => {
                    const currentCustom = pricesState[p.id] ?? p.defaultPrice;
                    return (
                      <div
                        key={p.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <strong className="text-slate-900 dark:text-white text-sm block">{p.name}</strong>
                          <span className="text-xs text-slate-500 dark:text-slate-400">Prix public par défaut : ${p.defaultPrice.toFixed(2)}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <span className="text-slate-500 dark:text-slate-400 text-xs">$</span>
                            <input
                              type="number"
                              step="0.01"
                              value={currentCustom}
                              onChange={(e) =>
                                setPricesState({
                                  ...pricesState,
                                  [p.id]: parseFloat(e.target.value) || 0,
                                })
                              }
                              className="w-24 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm text-right"
                            />
                          </div>

                          <button
                            onClick={() => handlePriceSave(p.id)}
                            disabled={saving}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md"
                          >
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* USER TAB 3: CAROUSEL */}
          {activeTab === "carousel" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Images className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Mon Carrousel Personnalisé
              </h2>

              <form onSubmit={handleAddCarousel} className="space-y-4 text-xs bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Ajouter une nouvelle slide</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Titre de la slide</label>
                    <input
                      type="text"
                      name="title"
                      required
                      placeholder="Bienvenue chez..."
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Sous-titre</label>
                    <input
                      type="text"
                      name="subtitle"
                      placeholder="Offre spéciale..."
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">URL d'Image de fond</label>
                    <input
                      type="url"
                      name="imageUrl"
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Lien de redirection</label>
                    <input
                      type="text"
                      name="link"
                      placeholder="/produits"
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Ajouter au Carrousel
                </button>
              </form>

              {/* Existing items list */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Slides Actives</h3>
                {userCarousel.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">Aucune slide personnalisée. Le carrousel général Starry Health est utilisé.</p>
                ) : (
                  userCarousel.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white block">{item.title}</strong>
                        <span className="text-slate-500 dark:text-slate-400">{item.subtitle}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* USER TAB 4: TESTIMONIALS */}
          {activeTab === "testimonials" && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
                <MessageSquare className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> Ajouter un Témoignage Client
              </h2>

              <form onSubmit={handleAddTestimonial} className="space-y-4 text-xs bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nom du Client</label>
                    <input
                      type="text"
                      name="authorName"
                      required
                      placeholder="Mme. Alice..."
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Note / Étoiles (1 à 5)</label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      defaultValue="5"
                      className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Avis / Témoignage</label>
                  <textarea
                    name="content"
                    rows={3}
                    required
                    placeholder="Ce produit a apporté de super résultats..."
                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Publier le Témoignage
                </button>
              </form>
            </div>
          )}

          {/* SUPER ADMIN OVERVIEW */}
          {activeTab === "overview" && isSuperAdmin && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                Gestion Globale des Utilisateurs & Abonnements
              </h2>

              <div className="space-y-4">
                {allUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <strong className="text-slate-900 dark:text-white text-sm block">{u.name} ({u.slug})</strong>
                      <span className="text-slate-500 dark:text-slate-400">{u.email} — Rôle: {u.role}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        u.subscriptionStatus === "ACTIVE" ? "bg-emerald-50 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                      }`}>
                        Abonnement: {u.subscriptionStatus}
                      </span>

                      {u.role !== "SUPER_ADMIN" && (
                        <button
                          onClick={async () => {
                            const newSt = u.subscriptionStatus === "ACTIVE" ? "FREE" : "ACTIVE";
                            await toggleUserSubscription(u.id, newSt);
                            setMsg(`Statut abonnement mis à jour pour ${u.slug} !`);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold"
                        >
                          Basculer Statut
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUPER ADMIN PRODUCTS */}
          {activeTab === "products_admin" && isSuperAdmin && (
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-4">
                Ajouter un Produit au Catalogue Général
              </h2>

              <form onSubmit={handleAddProductAdmin} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Nom du Produit</label>
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="Starry..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Prix par Défaut ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="defaultPrice"
                      required
                      placeholder="45.00"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Catégorie</label>
                    <input
                      type="text"
                      name="category"
                      required
                      placeholder="Compléments Alimentaires"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">URL Image Produit</label>
                    <input
                      type="url"
                      name="images"
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Description</label>
                  <textarea
                    name="description"
                    rows={4}
                    required
                    placeholder="Description complète des bienfaits..."
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center gap-2 text-sm shadow-md"
                >
                  <Plus className="w-4 h-4" /> Publier le produit
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
