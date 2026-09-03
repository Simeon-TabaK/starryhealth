"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Package,
  Camera,
  MessageSquarePlus,
  Settings,
  ShieldCheck,
  Plus,
  Palette,
  Save,
  Trash2,
  Calendar,
  CreditCard,
  Globe,
  Link as LinkIcon,
  Sparkles,
  ExternalLink,
  LogOut,
  X,
  Menu,
  Check,
  Lock,
  DollarSign,
  UserCheck,
  Clock,
  Send,
  CheckCircle2,
  Mail,
  HelpCircle,
  Layers,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import {
  updateUserProfile,
  updateCustomProductPrice,
  createUserProduct,
  updateUserProduct,
  deleteUserProduct,
  addUserService,
  deleteUserService,
  addUserFaq,
  deleteUserFaq,
  addUserGalleryImage,
  deleteUserGalleryImage,
  addUserPartner,
  deletePartner,
  setCustomDomain,
  adminManualActivateSubscription,
  sendAdminSuggestion,
  toggleAdminSuggestionRead,
  deleteAdminSuggestion,
} from "./actions";
import { getProductLimit, planHasFeature } from "@/lib/plans";

interface DashboardClientProps {
  user: any;
  userSubscription?: any;
  products: any[];
  globalProducts?: any[];
  customPrices: any[];
  userCarousel: any[];
  globalCarousel?: any[];
  userTestimonials: any[];
  allTestimonials?: any[];
  partners?: any[];
  services?: any[];
  faqs?: any[];
  gallery?: any[];
  suggestions?: any[];
  adminSuggestions?: any[];
  planPricings?: any[];
  allUsers?: any[];
  initialTab?: string;
}

export function DashboardClient({
  user,
  userSubscription,
  products = [],
  globalProducts = [],
  customPrices = [],
  userCarousel = [],
  globalCarousel = [],
  userTestimonials = [],
  allTestimonials = [],
  partners = [],
  services = [],
  faqs = [],
  gallery = [],
  suggestions = [],
  adminSuggestions = [],
  planPricings = [],
  allUsers = [],
  initialTab,
}: DashboardClientProps) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const plan = user.subscriptionPlan as "STANDARD" | "SMART" | "PREMIUM" | null;
  const isSubscribed = user.subscriptionStatus === "ACTIVE";

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState<string>(
    initialTab || (isSuperAdmin ? "overview" : "overview")
  );
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Modals & form states
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showAddService, setShowAddService] = useState(false);
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [showAddPartner, setShowAddPartner] = useState(false);
  const [domainInput, setDomainInput] = useState(user.customDomain?.domain || "");

  // Super Admin manual activation modal state
  const [selectedUserForSub, setSelectedUserForSub] = useState<any | null>(null);
  const [subForm, setSubForm] = useState({
    plan: "STANDARD" as "STANDARD" | "SMART" | "PREMIUM",
    status: "ACTIVE" as "ACTIVE" | "PENDING" | "EXPIRED" | "FREE",
    startDate: new Date().toISOString().split("T")[0],
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
  });

  // Custom prices local map
  const [pricesState, setPricesState] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    customPrices.forEach((cp) => {
      map[cp.productId] = cp.customPrice;
    });
    return map;
  });

  const showNotification = (text: string, type: "success" | "error" = "success") => {
    setMsg({ text, type });
    setTimeout(() => setMsg(null), 5000);
  };

  // Quotas
  const productQuota = getProductLimit(plan);
  const ownProductsCount = products.filter((p) => p.userId === user.id).length;
  const canAddMoreProducts = isSuperAdmin || ownProductsCount < productQuota;

  // Features check
  const hasSmartFeatures = isSuperAdmin || planHasFeature(plan, "services");
  const hasPremiumFeatures = isSuperAdmin || planHasFeature(plan, "faq");

  // Super Admin Statistics Calculation
  const totalSubscribers = allUsers.filter((u) => u.role !== "SUPER_ADMIN").length;
  const activeSubscribers = allUsers.filter((u) => u.subscriptionStatus === "ACTIVE").length;
  const pendingSubscribers = allUsers.filter((u) => u.subscriptionStatus === "PENDING").length;
  const expiredSubscribers = allUsers.filter((u) => u.subscriptionStatus === "EXPIRED").length;

  const countStandard = allUsers.filter((u) => u.subscriptionPlan === "STANDARD" && u.subscriptionStatus === "ACTIVE").length;
  const countSmart = allUsers.filter((u) => u.subscriptionPlan === "SMART" && u.subscriptionStatus === "ACTIVE").length;
  const countPremium = allUsers.filter((u) => u.subscriptionPlan === "PREMIUM" && u.subscriptionStatus === "ACTIVE").length;

  // Monthly revenue estimate based on active plan pricing: Standard $2.99, Smart $4.19, Premium $5.99
  const estimatedMonthlyRevenue = (countStandard * 2.99 + countSmart * 4.19 + countPremium * 5.99).toFixed(2);

  // Handlers
  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await updateUserProfile(user.id, formData);
      showNotification("Paramètres et organisation mis à jour !");
    } catch (err: any) {
      showNotification(err.message || "Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await createUserProduct(user.id, formData);
      showNotification("Produit créé avec succès !");
      setShowAddProduct(false);
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      showNotification(err.message || "Erreur de création produit.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    setSaving(true);
    try {
      await deleteUserProduct(productId, user.id);
      showNotification("Produit supprimé !");
    } catch (err: any) {
      showNotification(err.message || "Erreur de suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePriceSave = async (productId: number) => {
    const priceVal = pricesState[productId];
    if (priceVal === undefined || isNaN(priceVal)) return;
    setSaving(true);
    try {
      await updateCustomProductPrice(user.id, productId, priceVal);
      showNotification("Prix revendeur enregistré !");
    } catch (err: any) {
      showNotification(err.message || "Erreur de mise à jour du prix.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Super Admin manual subscription validation
  const handleOpenSubModal = (targetUser: any) => {
    setSelectedUserForSub(targetUser);
    const latestSub = targetUser.subscriptions?.[0];
    setSubForm({
      plan: targetUser.subscriptionPlan || "STANDARD",
      status: targetUser.subscriptionStatus || "ACTIVE",
      startDate: latestSub?.startDate ? new Date(latestSub.startDate).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
      expiresAt: latestSub?.expiresAt ? new Date(latestSub.expiresAt).toISOString().split("T")[0] : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    });
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserForSub) return;
    setSaving(true);
    try {
      await adminManualActivateSubscription(
        selectedUserForSub.id,
        subForm.plan,
        subForm.status,
        subForm.startDate,
        subForm.expiresAt
      );
      showNotification(`Abonnement de ${selectedUserForSub.name || selectedUserForSub.email} mis à jour !`);
      setSelectedUserForSub(null);
    } catch (err: any) {
      showNotification(err.message || "Erreur de mise à jour abonnement.", "error");
    } finally {
      setSaving(false);
    }
  };

  // Admin Suggestion (Subscriber to Admin)
  const handleSendAdminSuggestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await sendAdminSuggestion(user.id, formData);
      showNotification("Votre suggestion a été transmise à l'administrateur Starry Health !");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      showNotification(err.message || "Erreur lors de l'envoi.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleAdminSuggestionRead = async (id: number, currentRead: boolean) => {
    try {
      await toggleAdminSuggestionRead(id, !currentRead);
      showNotification(!currentRead ? "Marqué comme lu !" : "Marqué comme non lu !");
    } catch {
      showNotification("Erreur de mise à jour.", "error");
    }
  };

  const handleDeleteAdminSuggestion = async (id: number) => {
    if (!confirm("Supprimer cette suggestion ?")) return;
    try {
      await deleteAdminSuggestion(id);
      showNotification("Suggestion supprimée !");
    } catch {
      showNotification("Erreur de suppression.", "error");
    }
  };

  // Nav Items definition
  const navItems = [
    {
      id: "overview",
      label: "Vue d'ensemble",
      icon: LayoutDashboard,
      badge: isSuperAdmin ? null : null,
    },
    {
      id: "users",
      label: isSuperAdmin ? "Utilisateurs & Abonnements" : "Forfaits & Abonnements",
      icon: Users,
      badge: isSuperAdmin ? totalSubscribers : null,
    },
    {
      id: "products",
      label: "Mes Produits",
      icon: Package,
      badge: `${ownProductsCount}/${isFinite(productQuota) ? productQuota : "∞"}`,
    },
    {
      id: "gallery",
      label: "Galerie d'images",
      icon: Camera,
      locked: !hasPremiumFeatures,
    },
    {
      id: "suggestions",
      label: "Boîte de suggestion",
      icon: MessageSquarePlus,
      badge: isSuperAdmin ? adminSuggestions.filter((s) => !s.isRead).length || null : null,
    },
    {
      id: "settings",
      label: "Paramètres & Vitrine",
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* ─────────────────────────────────────────────
          MOBILE TOP NAVBAR (Hamburger + Title + Logout)
          ───────────────────────────────────────────── */}
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <button
          onClick={() => setMobileNavOpen(!mobileNavOpen)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Ouvrir le menu"
        >
          {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="Logo" className="w-7 h-7 rounded-lg" />
          <span className="font-extrabold text-sm">Starry Health</span>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
          title="Se déconnecter"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* ─────────────────────────────────────────────
          LEFT SIDEBAR (Responsive & Collapsible)
          ───────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${
          mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
        } h-screen`}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md bg-emerald-700 text-white font-bold">
              <img src="/assets/logo.png" alt="Logo" className="rounded-xl w-10 h-10 object-cover" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight block text-slate-900 dark:text-white">
                Starry <span className="text-emerald-600">Health</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-semibold tracking-wider block">
                {isSuperAdmin ? "Panneau Super Admin" : "Espace Distributeur"}
              </span>
            </div>
          </Link>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Mini Profile Card */}
        <div className="p-4 mx-4 my-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm"
            style={{ backgroundColor: user.primaryColor || "#0f766e" }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover rounded-xl" />
            ) : (
              (user.name || user.username || "U").charAt(0).toUpperCase()
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-bold text-xs text-slate-900 dark:text-white truncate">
              {user.name || user.username}
            </p>
            <span
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-0.5 ${
                isSuperAdmin
                  ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                  : plan === "PREMIUM"
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                  : plan === "SMART"
                  ? "bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300"
                  : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
              }`}
            >
              {isSuperAdmin ? "Admin" : plan || "Standard"}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileNavOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.locked && <Lock className="w-3 h-3 text-amber-500" />}
                  {item.badge !== null && item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          <Link
            href={`/?tenant=${user.slug}`}
            target="_blank"
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Voir ma vitrine
          </Link>

          {/* Prominent Red Logout Button */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Backdrop on mobile */}
      {mobileNavOpen && (
        <div
          onClick={() => setMobileNavOpen(false)}
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
        />
      )}

      {/* ─────────────────────────────────────────────
          MAIN CONTENT AREA
          ───────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
        {/* Notification Banner */}
        {msg && (
          <div
            className={`mb-6 p-4 rounded-2xl text-xs font-semibold flex items-center justify-between shadow-sm transition-all ${
              msg.type === "success"
                ? "bg-emerald-500 text-white"
                : "bg-rose-500 text-white"
            }`}
          >
            <span>{msg.text}</span>
            <button onClick={() => setMsg(null)} className="text-white/80 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 1: VUE D'ENSEMBLE (SUPER ADMIN / USER)
            ───────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {isSuperAdmin ? (
              <>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Tableau de Bord Super Admin
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Vue globale sur les abonnements, utilisateurs et performances de Starry Health.
                  </p>
                </div>

                {/* 4 Global Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Abonnés</p>
                      <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{totalSubscribers}</h3>
                      <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Distributeurs enregistrés</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Abonnements Actifs</p>
                      <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{activeSubscribers}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {totalSubscribers > 0 ? `${Math.round((activeSubscribers / totalSubscribers) * 100)}% d'activation` : "0%"}
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                      <UserCheck className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">En Attente / Expirés</p>
                      <h3 className="text-2xl font-extrabold text-amber-500 mt-1">
                        {pendingSubscribers} / {expiredSubscribers}
                      </h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">À relancer ou activer</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 flex items-center justify-center">
                      <Clock className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Revenus Mensuels Estimés</p>
                      <h3 className="text-2xl font-extrabold text-sky-600 mt-1">${estimatedMonthlyRevenue}</h3>
                      <p className="text-[10px] text-slate-400 mt-0.5">Basé sur les forfaits actifs</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>
                </div>

                {/* Subscriptions Breakdown by Tier */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">Forfait Standard</span>
                      <span className="text-xs font-bold text-slate-400">$2.99 / mois</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{countStandard}</p>
                    <p className="text-xs text-slate-500 mt-1">5 produits par vitrine</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-sky-700 dark:text-sky-400">Forfait Smart</span>
                      <span className="text-xs font-bold text-slate-400">$4.19 / mois</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{countSmart}</p>
                    <p className="text-xs text-slate-500 mt-1">10 produits + offres & services</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">Forfait Premium</span>
                      <span className="text-xs font-bold text-slate-400">$5.99 / mois</span>
                    </div>
                    <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{countPremium}</p>
                    <p className="text-xs text-slate-500 mt-1">Produits illimités + FAQ + Domaine</p>
                  </div>
                </div>

                {/* Quick action button to user subscriptions */}
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30 p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base">Gestion & Activation Manuelle des Abonnements</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      Consultez la liste des abonnés, validez un paiement bancaire ou activez manuellement les dates de début et fin.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("users")}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shrink-0"
                  >
                    Gérer les abonnés
                  </button>
                </div>
              </>
            ) : (
              /* Subscriber Overview */
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Bonjour, {user.name || user.username} 👋
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Bienvenue dans votre tableau de bord Starry Health.
                    </p>
                  </div>
                  <Link
                    href={`/?tenant=${user.slug}`}
                    target="_blank"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-transform hover:scale-105"
                  >
                    <ExternalLink className="w-4 h-4" /> Accéder à ma vitrine publique
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500">Mon Forfait</p>
                    <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{plan || "Standard"}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Statut: {isSubscribed ? "Actif" : "Gratuit / Expiré"}</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500">Quota de Produits</p>
                    <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                      {ownProductsCount} / {isFinite(productQuota) ? productQuota : "Illimité"}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Produits dans votre vitrine</p>
                  </div>

                  <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <p className="text-xs text-slate-500">Suggestions Visiteurs Reçues</p>
                    <h3 className="text-2xl font-extrabold text-sky-600 mt-1">{suggestions.length}</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Retours de vos clients</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 2: UTILISATEURS & GESTION ABONNEMENTS
            ───────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {isSuperAdmin ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Gestion des Abonnés & Activation Manuelle
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Visualisez tous les comptes et activez manuellement les abonnements avec choix des dates et forfaits.
                    </p>
                  </div>
                </div>

                {/* Users Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                        <tr>
                          <th className="p-4">Utilisateur / Nom</th>
                          <th className="p-4">Email & Slug</th>
                          <th className="p-4">Plan Actuel</th>
                          <th className="p-4">Statut</th>
                          <th className="p-4">Période d'abonnement</th>
                          <th className="p-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {allUsers.map((u) => {
                          const sub = u.subscriptions?.[0];
                          return (
                            <tr key={u.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="p-4 font-bold text-slate-900 dark:text-white">
                                {u.name || u.username}
                                {u.role === "SUPER_ADMIN" && (
                                  <span className="ml-2 text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Admin</span>
                                )}
                              </td>
                              <td className="p-4">
                                <div>{u.email}</div>
                                <a
                                  href={`/?tenant=${u.slug}`}
                                  target="_blank"
                                  className="text-[11px] text-emerald-600 hover:underline font-mono"
                                >
                                  {u.slug}.starryhealth.com
                                </a>
                              </td>
                              <td className="p-4">
                                <span className="font-semibold uppercase text-[11px]">
                                  {u.subscriptionPlan || "Standard"}
                                </span>
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    u.subscriptionStatus === "ACTIVE"
                                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300"
                                      : u.subscriptionStatus === "PENDING"
                                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300"
                                  }`}
                                >
                                  {u.subscriptionStatus}
                                </span>
                              </td>
                              <td className="p-4 text-slate-500 text-[11px]">
                                {sub?.expiresAt ? (
                                  <>
                                    <span>Du: {sub.startDate ? new Date(sub.startDate).toLocaleDateString("fr-FR") : "N/A"}</span>
                                    <br />
                                    <span>Au: {new Date(sub.expiresAt).toLocaleDateString("fr-FR")}</span>
                                  </>
                                ) : (
                                  <span className="italic text-slate-400">Aucun abonnement actif</span>
                                )}
                              </td>
                              <td className="p-4 text-right">
                                <button
                                  onClick={() => handleOpenSubModal(u)}
                                  className="px-3 py-1.5 rounded-lg font-bold text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-transform hover:scale-105"
                                >
                                  Activer / Modifier
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Modal Manual Activation */}
                {selectedUserForSub && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                        <h3 className="font-bold text-base">
                          Valider l'abonnement : {selectedUserForSub.name || selectedUserForSub.email}
                        </h3>
                        <button onClick={() => setSelectedUserForSub(null)} className="text-slate-400 hover:text-slate-600">
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveSubscription} className="space-y-4 pt-4">
                        <div>
                          <label className="text-xs font-semibold block mb-1">Choix du Plan</label>
                          <select
                            value={subForm.plan}
                            onChange={(e) => setSubForm({ ...subForm, plan: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="STANDARD">STANDARD (5 produits max)</option>
                            <option value="SMART">SMART (10 produits max + services)</option>
                            <option value="PREMIUM">PREMIUM (Produits illimités + FAQ + Galerie + Domaine)</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-semibold block mb-1">Statut de l'abonnement</label>
                          <select
                            value={subForm.status}
                            onChange={(e) => setSubForm({ ...subForm, status: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                          >
                            <option value="ACTIVE">ACTIVE (Abonnement valide)</option>
                            <option value="PENDING">PENDING (En attente de paiement)</option>
                            <option value="EXPIRED">EXPIRED (Expiré)</option>
                            <option value="FREE">FREE (Désactivé / Gratuit)</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold block mb-1">Date de début</label>
                            <input
                              type="date"
                              value={subForm.startDate}
                              onChange={(e) => setSubForm({ ...subForm, startDate: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                              required
                            />
                          </div>
                          <div>
                            <label className="text-xs font-semibold block mb-1">Date de fin / expiration</label>
                            <input
                              type="date"
                              value={subForm.expiresAt}
                              onChange={(e) => setSubForm({ ...subForm, expiresAt: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => setSelectedUserForSub(null)}
                            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
                          >
                            Annuler
                          </button>
                          <button
                            type="submit"
                            disabled={saving}
                            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md"
                          >
                            Valider l'abonnement
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </>
            ) : (
              /* Subscriber Plans View */
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Nos Forfaits d'Abonnement</h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Choisissez le forfait adapté à votre activité pour étendre vos quotas de produits et fonctionnalités exclusives.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* STANDARD */}
                  <div className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-sm ${plan === "STANDARD" ? "border-emerald-500 ring-2 ring-emerald-500/20" : "border-slate-200 dark:border-slate-800"}`}>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">STANDARD</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold">$2.99</span>
                      <span className="text-xs text-slate-500"> / mois</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Jusqu'à 5 produits</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Personnalisation Organisation</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500 shrink-0" /> Partenaires & Témoignages</li>
                    </ul>
                  </div>

                  {/* SMART */}
                  <div className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-md ${plan === "SMART" ? "border-sky-500 ring-2 ring-sky-500/20" : "border-slate-200 dark:border-slate-800"}`}>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">SMART</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold text-sky-600">$4.19</span>
                      <span className="text-xs text-slate-500"> / mois</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2 font-bold"><Check className="w-4 h-4 text-sky-500 shrink-0" /> Jusqu'à 10 produits</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500 shrink-0" /> Offres & Services avec liens</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-sky-500 shrink-0" /> Couleurs du thème personnalisables</li>
                    </ul>
                  </div>

                  {/* PREMIUM */}
                  <div className={`p-6 rounded-3xl border bg-white dark:bg-slate-900 shadow-xl ${plan === "PREMIUM" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-slate-200 dark:border-slate-800"}`}>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">PREMIUM</h3>
                    <div className="my-3">
                      <span className="text-3xl font-extrabold text-amber-600">$5.99</span>
                      <span className="text-xs text-slate-500"> / mois</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                      <li className="flex items-center gap-2 font-bold text-emerald-600"><Check className="w-4 h-4 shrink-0" /> Produits ILLIMITÉS</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Section FAQ dynamique</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Galerie "Notre univers en images"</li>
                      <li className="flex items-center gap-2"><Check className="w-4 h-4 text-amber-500 shrink-0" /> Domaine personnalisé lié</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 3: PRODUITS & PRIX
            ───────────────────────────────────────────── */}
        {activeTab === "products" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Mes Produits ({ownProductsCount} / {isFinite(productQuota) ? productQuota : "Illimité"})
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Créez vos produits propres ou ajustez vos tarifs revendeurs privilégiés.
                </p>
              </div>

              {canAddMoreProducts ? (
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" /> Ajouter un Produit
                </button>
              ) : (
                <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-3 py-2 rounded-xl border border-rose-500/30 flex items-center gap-2 font-semibold">
                  <Lock className="w-4 h-4" /> Quota atteint ({productQuota} max)
                </div>
              )}
            </div>

            {/* Modal Add Product */}
            {showAddProduct && (
              <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="font-bold text-base">Nouveau Produit</h3>
                    <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleCreateProduct} className="space-y-4 pt-4">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Nom du produit</label>
                      <input required type="text" name="name" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Description</label>
                      <textarea required name="description" rows={3} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Prix public ($)</label>
                        <input required type="number" step="0.01" name="defaultPrice" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                      </div>
                      <div>
                        <label className="text-xs font-semibold block mb-1">Prix original barré ($)</label>
                        <input type="number" step="0.01" name="originalPrice" placeholder="Ex: 55.00" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Catégorie</label>
                      <input type="text" name="category" defaultValue="Santé & Bien-être" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">URL(s) d'images</label>
                      <input required type="text" name="images" placeholder="https://.../img.jpg" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm" />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500">
                        Annuler
                      </button>
                      <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700">
                        Créer le produit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => {
                const isOwn = p.userId === user.id;
                const hasDiscount = p.originalPrice && p.originalPrice > p.defaultPrice;
                const discountPct = hasDiscount ? Math.round(((p.originalPrice - p.defaultPrice) / p.originalPrice) * 100) : 0;
                return (
                  <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {p.category}
                        </span>
                        {isOwn && (
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                            Mon Produit
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{p.name}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{p.description}</p>

                      <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-emerald-600">${p.defaultPrice.toFixed(2)}</span>
                        {hasDiscount && (
                          <>
                            <span className="text-xs text-slate-400 line-through">${p.originalPrice.toFixed(2)}</span>
                            <span className="text-[10px] font-bold text-rose-500">-{discountPct}%</span>
                          </>
                        )}
                      </div>

                      {/* Custom pricing */}
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                          Votre Prix Revendeur Partenaire ($)
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            step="0.01"
                            value={pricesState[p.id] ?? ""}
                            onChange={(e) =>
                              setPricesState({ ...pricesState, [p.id]: parseFloat(e.target.value) })
                            }
                            placeholder={p.defaultPrice.toString()}
                            className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                          />
                          <button
                            onClick={() => handlePriceSave(p.id)}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shrink-0"
                          >
                            Fixer
                          </button>
                        </div>
                      </div>
                    </div>

                    {isOwn && (
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 4: GALERIE (NOTRE UNIVERS EN IMAGES)
            ───────────────────────────────────────────── */}
        {activeTab === "gallery" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Galerie d'Images ("Notre univers en images")</h2>
                <p className="text-xs text-slate-500 mt-1">Carrousel de photos immersives visible sur votre vitrine.</p>
              </div>

              {hasPremiumFeatures && (
                <button
                  onClick={() => setShowAddGallery(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md"
                >
                  <Plus className="w-4 h-4" /> Ajouter une Photo
                </button>
              )}
            </div>

            {!hasPremiumFeatures ? (
              <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-3xl">
                <Lock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Réservé au Forfait PREMIUM</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
                  Sur votre vitrine, une galerie Unsplash de haute qualité est affichée par défaut. Passez à PREMIUM pour personnaliser vos propres clichés.
                </p>
                <button onClick={() => setActiveTab("users")} className="px-5 py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold">
                  Voir les forfaits
                </button>
              </div>
            ) : (
              <>
                {showAddGallery && (
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      setSaving(true);
                      try {
                        await addUserGalleryImage(user.id, new FormData(e.currentTarget));
                        showNotification("Image ajoutée !");
                        setShowAddGallery(false);
                      } catch {
                        showNotification("Erreur d'ajout.", "error");
                      } finally {
                        setSaving(false);
                      }
                    }}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4"
                  >
                    <h3 className="font-bold text-sm">Ajouter une image</h3>
                    <div>
                      <label className="text-xs font-semibold block mb-1">URL de l'image</label>
                      <input required type="url" name="imageUrl" placeholder="https://.../photo.jpg" className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Légende</label>
                      <input type="text" name="caption" placeholder="Nos équipements..." className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm" />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button type="button" onClick={() => setShowAddGallery(false)} className="px-4 py-2 text-xs text-slate-500">Annuler</button>
                      <button type="submit" disabled={saving} className="px-4 py-2 bg-amber-600 text-white rounded-xl text-xs font-bold">Enregistrer</button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {gallery.map((img) => (
                    <div key={img.id} className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900">
                      <img src={img.imageUrl} alt={img.caption || ""} className="w-full h-44 object-cover" />
                      <div className="p-3 bg-white dark:bg-slate-900">
                        <p className="text-xs font-medium truncate">{img.caption || "Sans légende"}</p>
                      </div>
                      <button
                        onClick={async () => {
                          if (!confirm("Supprimer cette photo ?")) return;
                          await deleteUserGalleryImage(img.id, user.id);
                          showNotification("Image supprimée !");
                        }}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-rose-600 text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 5: BOÎTE DE SUGGESTIONS (ADMIN & ABONNÉS)
            ───────────────────────────────────────────── */}
        {activeTab === "suggestions" && (
          <div className="space-y-8">
            {isSuperAdmin ? (
              /* SUPER ADMIN: Suggestions reçues des abonnés */
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2">
                    <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Suggestions & Retours des Abonnés ({adminSuggestions.length})
                    </h2>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Messages envoyés directement par vos distributeurs et partenaires à la direction Starry Health.
                  </p>
                </div>

                {adminSuggestions.length === 0 ? (
                  <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
                    Aucune suggestion reçue pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {adminSuggestions.map((asug) => (
                      <div
                        key={asug.id}
                        className={`p-5 rounded-2xl border transition-all ${
                          asug.isRead
                            ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 opacity-80"
                            : "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500/40 shadow-sm"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-slate-900 dark:text-white">
                              {asug.subject}
                            </span>
                            {!asug.isRead && (
                              <span className="px-2 py-0.5 bg-emerald-600 text-white rounded-full text-[10px] font-bold">
                                NOUVEAU
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span>
                              De : <strong>{asug.user?.name || asug.user?.email}</strong> ({asug.user?.slug})
                            </span>
                            <span>{new Date(asug.createdAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-white dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                          {asug.message}
                        </p>

                        <div className="flex justify-end gap-3 mt-3">
                          <button
                            onClick={() => handleToggleAdminSuggestionRead(asug.id, asug.isRead)}
                            className="text-xs text-slate-600 dark:text-slate-300 hover:text-emerald-600 font-semibold flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {asug.isRead ? "Marquer non lu" : "Marquer comme lu"}
                          </button>
                          <button
                            onClick={() => handleDeleteAdminSuggestion(asug.id)}
                            className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Supprimer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              /* SUBSCRIBER: Send suggestion to Starry Health Admin + Visitor suggestions */
              <div className="space-y-8">
                {/* Form: Boîte de suggestion à Starry Health */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Send className="w-5 h-5 text-emerald-600" />
                    <div>
                      <h2 className="text-base font-bold text-slate-900 dark:text-white">
                        Boîte de suggestion à Starry Health
                      </h2>
                      <p className="text-xs text-slate-500">
                        Envoyez un message, une idée ou un besoin directement à l'administrateur central Starry Health.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSendAdminSuggestion} className="space-y-4 max-w-2xl">
                    <div>
                      <label className="text-xs font-semibold block mb-1">Sujet / Titre de la suggestion</label>
                      <input
                        required
                        type="text"
                        name="subject"
                        placeholder="Ex: Demande de nouveau produit, question logistique..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold block mb-1">Votre message</label>
                      <textarea
                        required
                        name="message"
                        rows={4}
                        placeholder="Décrivez votre idée ou préoccupation en détail..."
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Envoyer à l'administrateur
                    </button>
                  </form>
                </div>

                {/* Suggestions reçues des visiteurs de sa propre vitrine */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Suggestions de vos Visiteurs ({suggestions.length})
                  </h3>
                  {suggestions.length === 0 ? (
                    <p className="text-xs text-slate-400">Aucun message de visiteur pour le moment.</p>
                  ) : (
                    <div className="space-y-3">
                      {suggestions.map((sug) => (
                        <div key={sug.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                          <div className="flex justify-between font-bold mb-1">
                            <span>{sug.authorName || "Visiteur Anonyme"} {sug.email && `(${sug.email})`}</span>
                            <span className="text-slate-400 font-normal">{new Date(sug.createdAt).toLocaleDateString("fr-FR")}</span>
                          </div>
                          <p className="text-slate-700 dark:text-slate-300">{sug.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB 6: PARAMÈTRES / ORGANISATION & VITRINE
            ───────────────────────────────────────────── */}
        {activeTab === "settings" && (
          <form onSubmit={handleProfileSubmit} className="space-y-8 max-w-4xl">
            {/* Organisation Details */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Personnalisation de l'Organisation & Vitrine
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <label className="text-xs font-semibold block mb-1">Logo URL</label>
                  <input
                    type="url"
                    name="orgLogo"
                    defaultValue={user.tenantConfig?.orgLogo || ""}
                    placeholder="https://.../logo.png"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold block mb-1">Description</label>
                  <textarea
                    name="orgDescription"
                    rows={2}
                    defaultValue={user.tenantConfig?.orgDescription || ""}
                    placeholder="Présentation de votre activité..."
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Contacts & Copyright */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Coordonnées & Copyright
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Téléphone</label>
                  <input
                    type="text"
                    name="contactPhone"
                    defaultValue={user.contactPhone || ""}
                    placeholder="+243 990 000 000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">WhatsApp de Commande</label>
                  <input
                    type="text"
                    name="whatsapp"
                    defaultValue={user.whatsapp || ""}
                    placeholder="+243990000000"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Email de contact</label>
                  <input
                    type="email"
                    name="contactEmail"
                    defaultValue={user.contactEmail || ""}
                    placeholder="contact@mondomaine.com"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Copyright personnalisé</label>
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

            {/* Social Links */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                Réseaux Sociaux
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

            {/* Thème & Typographie */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <Palette className="w-5 h-5 text-emerald-600" />
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">Couleurs & Typographie</h2>
                </div>
                {!hasSmartFeatures && (
                  <span className="text-xs text-amber-600 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Requis: Forfait SMART
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold block mb-1">Couleur Principale</label>
                  <input type="color" name="primaryColor" defaultValue={user.primaryColor || "#0f766e"} disabled={!hasSmartFeatures} className="w-10 h-10 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Couleur Secondaire</label>
                  <input type="color" name="secondaryColor" defaultValue={user.tenantConfig?.secondaryColor || "#0284c7"} disabled={!hasSmartFeatures} className="w-10 h-10 rounded-xl cursor-pointer" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Couleur Header</label>
                  <input type="color" name="headerColor" defaultValue={user.tenantConfig?.headerColor || "#0f766e"} disabled={!hasSmartFeatures} className="w-10 h-10 rounded-xl cursor-pointer" />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-semibold block mb-1">Police / Typographie</label>
                  <select name="fontFamily" defaultValue={user.tenantConfig?.fontFamily || "Inter"} disabled={!hasPremiumFeatures} className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm">
                    <option value="Inter">Inter (Standard)</option>
                    <option value="Outfit">Outfit (Moderne)</option>
                    <option value="Roboto">Roboto (Classique)</option>
                    <option value="Playfair Display">Playfair Display (Élégant)</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {saving ? "Enregistrement..." : "Enregistrer les modifications"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
