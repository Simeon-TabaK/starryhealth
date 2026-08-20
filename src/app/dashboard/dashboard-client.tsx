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
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Calendar,
  CreditCard,
  Star,
  Globe,
  Link as LinkIcon,
  Sparkles,
  ArrowLeft,
  X,
} from "lucide-react";
import Link from "next/link";
import {
  updateUserProfile,
  updateCustomProductPrice,
  addUserCarouselItem,
  deleteCarouselItem,
  updateCarouselItem,
  addUserTestimonial,
  updateTestimonial,
  deleteTestimonial,
  toggleTestimonialPublicity,
  toggleUserSubscription,
  updateUserSubscriptionDetails,
  createGlobalProduct,
  updateGlobalProduct,
  toggleProductVisibility,
  deleteGlobalProduct,
  createUserByAdmin,
  updateUserByAdmin,
  deleteUserByAdmin,
} from "./actions";

interface DashboardClientProps {
  user: any;
  userSubscription?: any;
  products: any[];
  customPrices: any[];
  userCarousel: any[];
  globalCarousel?: any[];
  userTestimonials: any[];
  allTestimonials?: any[];
  allUsers?: any[];
}

export function DashboardClient({
  user,
  userSubscription,
  products,
  customPrices,
  userCarousel,
  globalCarousel = [],
  userTestimonials,
  allTestimonials = [],
  allUsers = [],
}: DashboardClientProps) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const [activeTab, setActiveTab] = useState(isSuperAdmin ? "overview" : "profile");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Edit Modals / Form States
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<any | null>(null);
  const [editingCarousel, setEditingCarousel] = useState<any | null>(null);

  // Custom prices local state
  const [pricesState, setPricesState] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    customPrices.forEach((cp) => {
      map[cp.productId] = cp.customPrice;
    });
    return map;
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 4000);
  };

  // Profile Submit
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserProfile(user.id, formData);
      showNotification("Profil et paramètres mis à jour avec succès !");
    } catch {
      showNotification("Erreur lors de la mise à jour du profil.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Custom price save
  const handlePriceSave = async (productId: number) => {
    const priceVal = pricesState[productId];
    if (!priceVal) return;
    setSaving(true);
    try {
      await updateCustomProductPrice(user.id, productId, priceVal);
      showNotification("Prix personnalisé enregistré !");
    } catch (err: any) {
      showNotification(err.message || "Erreur de mise à jour du prix.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Carousel Submit
  const handleAddCarousel = async (e: React.FormEvent<HTMLFormElement>, targetUserId: number | null) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addUserCarouselItem(targetUserId, formData);
      showNotification("Image de carrousel ajoutée !");
      (e.target as HTMLFormElement).reset();
    } catch {
      showNotification("Erreur lors de l'ajout de l'image.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCarousel = async (id: number) => {
    if (!confirm("Supprimer cette slide du carrousel ?")) return;
    setSaving(true);
    try {
      await deleteCarouselItem(id);
      showNotification("Slide supprimée !");
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Testimonials Submit
  const handleAddTestimonial = async (e: React.FormEvent<HTMLFormElement>, targetUserId: number | null) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await addUserTestimonial(targetUserId, formData);
      showNotification("Témoignage ajouté avec succès !");
      (e.target as HTMLFormElement).reset();
    } catch {
      showNotification("Erreur lors de l'ajout du témoignage.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateTestimonial(editingTestimonial.id, formData);
      showNotification("Témoignage mis à jour !");
      setEditingTestimonial(null);
    } catch {
      showNotification("Erreur lors de la modification.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    setSaving(true);
    try {
      await deleteTestimonial(id);
      showNotification("Témoignage supprimé !");
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleTestimonialPublicity = async (id: number, currentPublic: boolean) => {
    setSaving(true);
    try {
      await toggleTestimonialPublicity(id, !currentPublic);
      showNotification(`Témoignage passé en mode ${!currentPublic ? "Public" : "Privé"}.`);
    } catch {
      showNotification("Erreur lors du changement de statut.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Super Admin: Product Actions
  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createGlobalProduct(formData);
      showNotification("Nouveau produit ajouté au catalogue !");
      setShowAddProduct(false);
      (e.target as HTMLFormElement).reset();
    } catch {
      showNotification("Erreur lors de la création du produit.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateGlobalProduct(editingProduct.id, formData);
      showNotification("Produit mis à jour !");
      setEditingProduct(null);
    } catch {
      showNotification("Erreur lors de la mise à jour.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleProductVisibility = async (id: number, currentVisible: boolean) => {
    setSaving(true);
    try {
      await toggleProductVisibility(id, !currentVisible);
      showNotification(`Visibilité produit : ${!currentVisible ? "Visible" : "Masqué"}.`);
    } catch {
      showNotification("Erreur de visibilité.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Supprimer définitivement ce produit ?")) return;
    setSaving(true);
    try {
      await deleteGlobalProduct(id);
      showNotification("Produit supprimé !");
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Super Admin: User Actions
  const handleCreateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createUserByAdmin(formData);
      showNotification("Nouvel utilisateur créé !");
      setShowAddUser(false);
      (e.target as HTMLFormElement).reset();
    } catch {
      showNotification("Erreur de création d'utilisateur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingUser) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserByAdmin(editingUser.id, formData);
      showNotification("Utilisateur mis à jour !");
      setEditingUser(null);
    } catch {
      showNotification("Erreur lors de la mise à jour.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur et ses données ?")) return;
    setSaving(true);
    try {
      await deleteUserByAdmin(id);
      showNotification("Utilisateur supprimé !");
    } catch {
      showNotification("Erreur lors de la suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name || "User"} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                (user.name || "U").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user.name || user.username}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                  isSuperAdmin
                    ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                    : "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                }`}>
                  {isSuperAdmin ? "Super Admin" : "Membre Partner"}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Voir le site
            </Link>
          </div>
        </div>

        {/* Global Notification Banner */}
        {msg && (
          <div className={`p-4 rounded-2xl border text-xs font-medium flex items-center justify-between shadow-sm transition-all ${
            msg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-950/60 border-red-500/30 text-red-800 dark:text-red-300"
          }`}>
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Dashboard Nav Tabs */}
        <div className="flex overflow-x-auto gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          {isSuperAdmin && (
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === "overview"
                  ? "bg-emerald-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <Users className="w-4 h-4" /> Utilisateurs ({allUsers.length})
            </button>
          )}

          <button
            onClick={() => setActiveTab("profile")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "profile"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <UserIcon className="w-4 h-4" /> Profil & Paramètres
          </button>

          <button
            onClick={() => setActiveTab("subscription")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "subscription"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <CreditCard className="w-4 h-4" /> Mon Abonnement
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "products"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Package className="w-4 h-4" /> Produits ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("carousel")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "carousel"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Images className="w-4 h-4" /> Carrousel
          </button>

          <button
            onClick={() => setActiveTab("testimonials")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === "testimonials"
                ? "bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <MessageSquare className="w-4 h-4" /> Témoignages
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT (SUPER ADMIN ONLY) */}
        {isSuperAdmin && activeTab === "overview" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Gestion des Utilisateurs & Abonnements</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">Administrez les comptes, rôles et statuts d'abonnement.</p>
              </div>
              <button
                onClick={() => setShowAddUser(true)}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
              >
                <Plus className="w-4 h-4" /> Ajouter un Utilisateur
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-100 dark:bg-slate-800/60 uppercase text-[10px] font-bold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-4">Utilisateur</th>
                      <th className="px-6 py-4">Email / Slug</th>
                      <th className="px-6 py-4">Rôle</th>
                      <th className="px-6 py-4">Statut Abonnement</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {allUsers.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="px-6 py-4 font-semibold text-slate-900 dark:text-white flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                            {u.name ? u.name.charAt(0).toUpperCase() : u.username?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div>{u.name || u.username}</div>
                            <span className="text-[10px] text-slate-400">@{u.username}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>{u.email}</div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400">slug: {u.slug}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.role === "SUPER_ADMIN"
                              ? "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                            u.subscriptionStatus === "ACTIVE"
                              ? "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                          }`}>
                            {u.subscriptionStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setEditingUser(u)}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PROFILE & SETTINGS */}
        {activeTab === "profile" && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Modifier mon Profil & Informations</h2>
            
            <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom complet</label>
                  <input
                    type="text"
                    name="name"
                    defaultValue={user.name || ""}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={user.email || ""}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">URL Avatar (Photo de profil)</label>
                <input
                  type="url"
                  name="avatar"
                  defaultValue={user.avatar || ""}
                  placeholder="https://..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Bio / Présentation</label>
                <textarea
                  name="bio"
                  rows={3}
                  defaultValue={user.bio || ""}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    defaultValue={user.contactPhone || ""}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Contact</label>
                  <input
                    type="email"
                    name="contactEmail"
                    defaultValue={user.contactEmail || ""}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">WhatsApp</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={user.whatsapp || ""}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Couleur Principale du Thème</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    name="primaryColor"
                    defaultValue={user.primaryColor || "#0f766e"}
                    className="w-10 h-10 rounded-xl cursor-pointer border-0"
                  />
                  <span className="text-xs text-slate-500">{user.primaryColor || "#0f766e"}</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all"
              >
                <Save className="w-4 h-4" /> {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: USER SUBSCRIPTION & EXPIRATION */}
        {activeTab === "subscription" && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-emerald-600" /> Mon Abonnement Starry Boxx
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 uppercase font-semibold">Statut</span>
                <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {user.subscriptionStatus === "ACTIVE" ? "Actif (Payé)" : "Gratuit (Free)"}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 uppercase font-semibold">Formule / Plan</span>
                <div className="text-2xl font-black text-slate-900 dark:text-white">
                  {userSubscription?.plan || "Formule Standard"}
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="text-xs text-slate-500 uppercase font-semibold">Date d'échéance</span>
                <div className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  {userSubscription?.expiresAt
                    ? new Date(userSubscription.expiresAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Aucune échéance"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Catalogue & Personnalisation des Prix</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {isSuperAdmin
                    ? "Gérez la liste globale des produits et leur visibilité."
                    : "Personnalisez vos tarifs de vente en boutique."}
                </p>
              </div>

              {isSuperAdmin && (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md"
                >
                  <Plus className="w-4 h-4" /> Ajouter un Produit
                </button>
              )}
            </div>

            {/* Product Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <div
                  key={p.id}
                  className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border ${
                    p.isVisible ? "border-slate-200 dark:border-slate-800" : "border-amber-500/50 bg-amber-50/10"
                  } space-y-4 shadow-sm relative`}
                >
                  {!p.isVisible && (
                    <span className="absolute top-4 right-4 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 text-[10px] font-bold">
                      Masqué du public
                    </span>
                  )}

                  <img src={p.images.split(",")[0]} alt={p.name} className="w-full h-40 object-cover rounded-2xl" />

                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-emerald-600">{p.category}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{p.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mt-1">{p.description}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Prix Standard</span>
                      <strong className="text-slate-900 dark:text-white text-sm">{p.defaultPrice} $</strong>
                    </div>

                    {isSuperAdmin && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleProductVisibility(p.id, p.isVisible)}
                          className={`p-2 rounded-xl text-xs ${
                            p.isVisible ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300" : "bg-amber-100 text-amber-800"
                          }`}
                          title="Changer visibilité"
                        >
                          {p.isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingProduct(p)}
                          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Custom Price Input for Member */}
                  {!isSuperAdmin && (
                    <div className="pt-2 flex items-center gap-2">
                      <input
                        type="number"
                        step="0.01"
                        placeholder="Prix personnalisé"
                        value={pricesState[p.id] || ""}
                        onChange={(e) =>
                          setPricesState({
                            ...pricesState,
                            [p.id]: parseFloat(e.target.value),
                          })
                        }
                        className="w-full px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                      />
                      <button
                        onClick={() => handlePriceSave(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shrink-0"
                      >
                        Enregistrer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: CAROUSEL MANAGEMENT */}
        {activeTab === "carousel" && (
          <div className="space-y-8">
            {/* Add Carousel Form */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Images className="w-5 h-5 text-emerald-600" /> Ajouter une Slide au Carrousel
              </h2>

              <form onSubmit={(e) => handleAddCarousel(e, isSuperAdmin ? null : user.id)} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Titre principal</label>
                    <input
                      type="text"
                      name="title"
                      placeholder="Ex: Votre Santé, Notre Priorité"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Sous-titre</label>
                    <input
                      type="text"
                      name="subtitle"
                      placeholder="Ex: Formules biologiques certifiées"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">URL Image de fond</label>
                    <input
                      type="url"
                      name="imageUrl"
                      placeholder="https://..."
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Lien du bouton (Optionnel)</label>
                    <input
                      type="text"
                      name="link"
                      placeholder="/produits"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Ajouter au Carrousel
                </button>
              </form>
            </div>

            {/* List of Carousel Items */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Slides Actives</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(isSuperAdmin ? globalCarousel : userCarousel).map((item) => (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-4 items-center shadow-sm"
                  >
                    <img src={item.imageUrl} alt={item.title} className="w-24 h-24 object-cover rounded-xl shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">{item.title}</h4>
                      <p className="text-xs text-slate-500 truncate">{item.subtitle}</p>
                      {item.link && <span className="text-[10px] text-emerald-600 block mt-1">Lien: {item.link}</span>}
                    </div>
                    <button
                      onClick={() => handleDeleteCarousel(item.id)}
                      className="p-2 rounded-xl bg-red-50 dark:bg-red-900/30 text-red-600 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: TESTIMONIALS MANAGEMENT */}
        {activeTab === "testimonials" && (
          <div className="space-y-8">
            {/* Add Testimonial Form */}
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-600" /> Ajouter un Témoignage
              </h2>

              <form onSubmit={(e) => handleAddTestimonial(e, user.id)} className="space-y-4 max-w-2xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">Nom de l'Auteur</label>
                    <input
                      type="text"
                      name="authorName"
                      placeholder="Ex: Dr. Marie Mbenga"
                      required
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold mb-1">Note (1 à 5)</label>
                    <input
                      type="number"
                      name="rating"
                      min="1"
                      max="5"
                      defaultValue="5"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Contenu du Témoignage</label>
                  <textarea
                    name="content"
                    rows={3}
                    placeholder="Ce produit est remarquable..."
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1">URL Avatar (Photo)</label>
                    <input
                      type="url"
                      name="avatar"
                      placeholder="https://..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Associer à un Produit</label>
                    <select
                      name="productId"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <option value="">Aucun (Général)</option>
                      {products.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1">Visibilité</label>
                    <select
                      name="isPublic"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                    >
                      <option value="true">Public</option>
                      <option value="false">Privé</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md"
                >
                  Publier le Témoignage
                </button>
              </form>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isSuperAdmin ? "Tous les Témoignages" : "Mes Témoignages"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(isSuperAdmin ? allTestimonials : userTestimonials).map((t) => (
                  <div
                    key={t.id}
                    className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                          {t.avatar ? (
                            <img src={t.avatar} alt={t.authorName} className="w-full h-full object-cover rounded-full" />
                          ) : (
                            t.authorName.charAt(0)
                          )}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">{t.authorName}</h4>
                          {t.product && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block">
                              Produit: {t.product.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.isPublic ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {t.isPublic ? "Public" : "Privé"}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed italic">"{t.content}"</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex gap-1 text-amber-400">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTestimonialPublicity(t.id, t.isPublic)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600"
                          title="Changer mode public/privé"
                        >
                          {t.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => setEditingTestimonial(t)}
                          className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteTestimonial(t.id)}
                          className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

      {/* --- MODAL: EDIT PRODUCT (SUPER ADMIN) --- */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Modifier le Produit</h3>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom du Produit</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingProduct.name}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  defaultValue={editingProduct.description}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Prix ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="defaultPrice"
                    defaultValue={editingProduct.defaultPrice}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Catégorie</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue={editingProduct.category}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">URL Image</label>
                <input
                  type="url"
                  name="images"
                  defaultValue={editingProduct.images}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Visibilité Public</label>
                <select
                  name="isVisible"
                  defaultValue={editingProduct.isVisible ? "true" : "false"}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <option value="true">Visible</option>
                  <option value="false">Masqué</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-medium"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD PRODUCT (SUPER ADMIN) --- */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Ajouter un Nouveau Produit</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom du Produit</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Starry Vitality"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Description</label>
                <textarea
                  name="description"
                  rows={3}
                  placeholder="Complément biologique..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Prix ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="defaultPrice"
                    placeholder="45.00"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Catégorie</label>
                  <input
                    type="text"
                    name="category"
                    defaultValue="Santé & Bien-être"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">URL Image</label>
                <input
                  type="url"
                  name="images"
                  placeholder="https://..."
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Visibilité Initial</label>
                <select
                  name="isVisible"
                  defaultValue="true"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                >
                  <option value="true">Visible</option>
                  <option value="false">Masqué</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-medium"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  Créer Produit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: ADD USER (SUPER ADMIN) --- */}
      {showAddUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Créer un Nouvel Utilisateur</h3>
              <button onClick={() => setShowAddUser(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Jean Dupont"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Nom d'utilisateur (Username)</label>
                  <input
                    type="text"
                    name="username"
                    placeholder="jean"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="jean@starryhealth.com"
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Mot de passe initial</label>
                <input
                  type="password"
                  name="password"
                  defaultValue="Pass12345"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Rôle</label>
                  <select
                    name="role"
                    defaultValue="USER"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="USER">Membre Utilisateur</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Statut Abonnement</label>
                  <select
                    name="subscriptionStatus"
                    defaultValue="ACTIVE"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="ACTIVE">Actif (Payé)</option>
                    <option value="FREE">Gratuit</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 rounded-xl border text-xs font-medium"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  Créer Utilisateur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT USER (SUPER ADMIN) --- */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Modifier l'Utilisateur #{editingUser.id}</h3>
              <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Nom complet</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingUser.name || ""}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  defaultValue={editingUser.email}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Rôle</label>
                  <select
                    name="role"
                    defaultValue={editingUser.role}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="USER">USER</option>
                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Abonnement</label>
                  <select
                    name="subscriptionStatus"
                    defaultValue={editingUser.subscriptionStatus}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="FREE">FREE</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-medium"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT TESTIMONIAL --- */}
      {editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 max-w-lg w-full space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Modifier le Témoignage</h3>
              <button onClick={() => setEditingTestimonial(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTestimonial} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">Auteur</label>
                  <input
                    type="text"
                    name="authorName"
                    defaultValue={editingTestimonial.authorName}
                    required
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Note (1-5)</label>
                  <input
                    type="number"
                    name="rating"
                    min="1"
                    max="5"
                    defaultValue={editingTestimonial.rating}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">Contenu</label>
                <textarea
                  name="content"
                  rows={3}
                  defaultValue={editingTestimonial.content}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold mb-1">URL Avatar</label>
                  <input
                    type="url"
                    name="avatar"
                    defaultValue={editingTestimonial.avatar || ""}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Produit Associé</label>
                  <select
                    name="productId"
                    defaultValue={editingTestimonial.productId || ""}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="">Aucun</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Visibilité</label>
                  <select
                    name="isPublic"
                    defaultValue={editingTestimonial.isPublic ? "true" : "false"}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs"
                  >
                    <option value="true">Public</option>
                    <option value="false">Privé</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingTestimonial(null)}
                  className="px-4 py-2 rounded-xl border text-xs font-medium"
                >
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
