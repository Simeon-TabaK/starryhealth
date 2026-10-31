"use client";

import { useState, useEffect } from "react";
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
  ChevronDown,
  TrendingUp,
  Edit,
  AlertCircle,
  Eye,
  EyeOff,
  Image as ImageIcon,
  AlertTriangle,
  User,
  Building,
  FolderTree,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { ToastContainer, ToastItem, ToastType } from "@/components/toast";
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
  updateUserGalleryImage,
  deleteUserGalleryImage,
  addUserPartner,
  deletePartner,
  setCustomDomain,
  adminManualActivateSubscription,
  sendAdminSuggestion,
  toggleAdminSuggestionRead,
  deleteAdminSuggestion,
  updateAdminSuggestionStatus,
  deleteTestimonial,
  requestUsernameChange,
  adminApproveUsernameChange,
  adminRejectUsernameChange,
} from "./actions";
import { getProductLimit, planHasFeature } from "@/lib/plans";
import { SubscriptionManagement } from "@/components/subscription-management";
import { AdminPlanManagement } from "@/components/admin-plan-management";
import { AdminUserManagement } from "@/components/admin-user-management";
import { AdminTenantManagement } from "@/components/admin-tenant-management";
import { CategoryManagement } from "@/components/category-management";
import { ServicesManagement } from "@/components/services-management";
import { OverviewTab } from "@/components/dashboard/overview-tab";
import { ProductsTab } from "@/components/dashboard/products-tab";
import { GalleryTab } from "@/components/dashboard/gallery-tab";
import { TestimonialsTab } from "@/components/dashboard/testimonials-tab";
import { SuggestionsTab } from "@/components/dashboard/suggestions-tab";
import { SettingsTab } from "@/components/dashboard/settings-tab";
import { TenantRequestsTab } from "@/components/dashboard/tenant-requests-tab";
import { ThemeToggle } from "@/components/theme-toggle";

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
  tenantChangeRequests?: any[];
  planConfigs?: any[];
  userSubscriptions?: any[];
  allSubscriptionHistory?: any[];
  categories?: any[];
  initialTab?: string;
  tenantAnalytics?: any;
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
  tenantChangeRequests = [],
  planConfigs = [],
  userSubscriptions = [],
  allSubscriptionHistory = [],
  categories = [],
  initialTab,
  tenantAnalytics,
}: DashboardClientProps) {
  const isSuperAdmin = user.role === "SUPER_ADMIN";
  const plan = user.subscriptionPlan as "STANDARD" | "SMART" | "PREMIUM" | null;
  const isSubscribed = user.subscriptionStatus === "ACTIVE";

  // Sidebar navigation state (initialisé avec l'onglet demandé ou vue d'ensemble)
  const [activeTab, setActiveTab] = useState<string>(initialTab || "overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Sous-menus déroulants (collapsible/dropdown) pour la navigation par catégorie
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Tableau de bord": true,
    "Mon Catalogue": true,
    "Communication": false,
    "Paramètres & Vitrine": false,
    "Administration": true,
    "Abonnement": true,
  });

  const toggleGroup = (label: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const handleSelectTab = (itemId: string, groupLabel?: string) => {
    setActiveTab(itemId);
    setMobileNavOpen(false);
    if (groupLabel) {
      setOpenGroups((prev) => ({ ...prev, [groupLabel]: true }));
    }
  };
  
  // Toast notifications system (top-right)
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = (message: string, type: ToastType = "success", description?: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, type, message, description }]);
  };
  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };
  // Fallback alias for showNotification
  const showNotification = (text: string, type: "success" | "error" = "success") => {
    showToast(text, type);
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

  // ── CATEGORIES DE NAVIGATION ──
  const navGroups = [
    {
      label: "Tableau de bord",
      items: [
        { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard, badge: null, locked: false },
      ],
    },
    {
      label: "Mon Catalogue",
      items: [
        {
          id: "products",
          label: "Mes Produits",
          icon: Package,
          badge: `${ownProductsCount}/${isFinite(productQuota) ? productQuota : "∞"}`,
          locked: false,
        },
        {
          id: "gallery",
          label: "Galerie d'Images",
          icon: Camera,
          badge: null,
          locked: !hasPremiumFeatures,
        },
        {
          id: "categories",
          label: "Catégories",
          icon: FolderTree,
          badge: categories.length || null,
          locked: !hasPremiumFeatures,
        },
        {
          id: "services",
          label: "Services & Offres",
          icon: Layers,
          badge: services.length || null,
          locked: !hasPremiumFeatures,
        },
      ],
    },
    {
      label: "Communication",
      items: [
        {
          id: "testimonials",
          label: "Témoignages",
          icon: MessageSquarePlus,
          badge: userTestimonials?.length || null,
          locked: false,
        },
        {
          id: "suggestions",
          label: isSuperAdmin ? "Boîte à Suggestions" : "Mes Suggestions",
          icon: Send,
          badge: isSuperAdmin
            ? adminSuggestions.filter((s: any) => !s.isRead).length || null
            : null,
          locked: false,
        },
      ],
    },
    {
      label: "Paramètres & Vitrine",
      items: [
        {
          id: "settings",
          label: "Profil & Apparence",
          icon: Settings,
          badge: null,
          locked: false,
        },
        {
          id: "tenant-requests",
          label: isSuperAdmin ? "Demandes Tenant" : "Mon Tenant",
          icon: Globe,
          badge: isSuperAdmin
            ? tenantChangeRequests.filter((r: any) => r.status === "PENDING").length || null
            : tenantChangeRequests.filter((r: any) => r.status === "PENDING").length || null,
          locked: false,
        },
      ],
    },
    ...(isSuperAdmin
      ? [
        {
          label: "Administration",
          items: [
            {
              id: "users",
              label: "Comptes Utilisateurs",
              icon: Users,
              badge: totalSubscribers || null,
              locked: false,
            },
            {
              id: "admin-subscriptions",
              label: "Abonnements & Demandes",
              icon: CreditCard,
              badge: pendingSubscribers || null,
              locked: false,
            },
            {
              id: "admin-tenants",
              label: "Gestion des Tenants",
              icon: Building,
              badge: null,
              locked: false,
            },
            {
              id: "admin-plans",
              label: "Gestion des Plans",
              icon: Sparkles,
              badge: planConfigs.length || null,
              locked: false,
            },
          ],
        },
      ]
      : [
        {
          label: "Abonnement",
          items: [
            {
              id: "users",
              label: "Mon Abonnement",
              icon: CreditCard,
              badge: null,
              locked: false,
            },
          ],
        },
      ]),
  ];

  const config = user.tenantConfig;
  const themeDashboardBg = config?.dashboardBgColor || undefined;
  const themeSidebarBg = config?.sidebarBgColor || undefined;
  const themeSidebarText = config?.sidebarTextColor || undefined;

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row"
      style={{ backgroundColor: themeDashboardBg }}
    >
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

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="p-2 rounded-xl text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
            title="Se déconnecter"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────
          LEFT SIDEBAR (Responsive & Collapsible)
          ───────────────────────────────────────────── */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-40 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 md:translate-x-0 ${mobileNavOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"
          } h-screen`}
        style={{
          backgroundColor: themeSidebarBg,
          color: themeSidebarText,
        }}
      >
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold">
              <img src="/assets/logo.png" alt="Logo" className="rounded-xl w-12 h-12 object-cover" />
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
              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase mt-0.5 ${isSuperAdmin
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

        {/* Navigation Links Grouped by Category with Dropdown/Collapsible Submenus */}
        <nav className="flex-1 px-3 overflow-y-auto space-y-3 py-2">
          {navGroups.map((group) => {
            const hasActiveChild = group.items.some((it) => it.id === activeTab);
            const isOpen = openGroups[group.label] ?? true;

            // Overview is single-item top-level: render directly
            if (group.items.length === 1 && group.label === "Tableau de bord") {
              const item = group.items[0];
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <div key={group.label} className="pt-0.5">
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id, group.label)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-[#1A1A8B] text-white shadow-md shadow-[#1A1A8B]/20 font-bold"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                </div>
              );
            }

            return (
              <div key={group.label} className="border-t border-slate-100 dark:border-slate-800/60 pt-2.5 first:border-t-0 first:pt-0">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.label)}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-300 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-1.5">
                    {hasActiveChild && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A8B] dark:bg-[#CCAB00]" />
                    )}
                    <span>{group.label}</span>
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-0" : "-rotate-90 text-slate-400"}`}
                  />
                </button>

                {isOpen && (
                  <div className="space-y-1 mt-1 pl-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => handleSelectTab(item.id, group.label)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${isActive
                            ? "bg-[#1A1A8B] text-white shadow-md shadow-[#1A1A8B]/20 font-bold"
                            : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white"
                            }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                            <span>{item.label}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            {item.locked && <Lock className="w-3 h-3 text-amber-500" />}
                            {item.badge !== null && item.badge !== undefined && (
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isActive
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
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/80 space-y-2">
          {/* Controls: Thème */}
          <div className="flex items-center justify-end pb-1">
            <ThemeToggle />
          </div>

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
          MAIN CONTENT AREA & TOAST CONTAINER
          ───────────────────────────────────────────── */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">

        {/* ─────────────────────────────────────────────
            TAB 1: VUE D'ENSEMBLE (SUPER ADMIN / USER)
            ───────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <OverviewTab
            user={user}
            isSuperAdmin={isSuperAdmin}
            plan={plan}
            isSubscribed={isSubscribed}
            onNavigateTab={(tab) => handleSelectTab(tab)}
            onNotify={(msg, type, desc) => showToast(msg, (type as any) || "success", desc)}
            tenantAnalytics={tenantAnalytics}
            stats={{
              totalSubscribers,
              activeSubscribers,
              pendingSubscribers,
              expiredSubscribers,
              estimatedMonthlyRevenue,
              countStandard,
              countSmart,
              countPremium,
              ownProductsCount,
              productQuota,
              userTestimonialsCount: userTestimonials.length,
            }}
          />
        )}

                {/* ─────────────────────────────────────────────
            TAB: UTILISATEURS (ADMIN) / MON ABONNEMENT (USER)
            ───────────────────────────────────────────── */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {isSuperAdmin ? (
              <AdminUserManagement
                adminId={user.id}
                users={allUsers}
                onNotify={showToast}
              />
            ) : (
              <SubscriptionManagement
                currentUser={user}
                isSuperAdmin={false}
                userSubscriptions={userSubscriptions}
                userSubscriptionHistory={allSubscriptionHistory.filter((h: any) => h.userId === user.id)}
                planPricings={planPricings}
              />
            )}
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB: GESTION DES ABONNEMENTS (ADMIN)
            ───────────────────────────────────────────── */}
        {activeTab === "admin-subscriptions" && isSuperAdmin && (
          <div className="space-y-6">
            <SubscriptionManagement
              currentUser={user}
              isSuperAdmin={true}
              userSubscriptions={userSubscriptions}
              userSubscriptionHistory={allSubscriptionHistory.filter((h: any) => h.userId === user.id)}
              allSubscriptions={allUsers.flatMap((u: any) => u.subscriptions || [])}
              allSubscriptionHistory={allSubscriptionHistory}
              allUsers={allUsers}
              planPricings={planPricings}
            />
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB: GESTION DES TENANTS (ADMIN)
            ───────────────────────────────────────────── */}
        {activeTab === "admin-tenants" && isSuperAdmin && (
          <div className="space-y-6">
            <AdminTenantManagement
              adminId={user.id}
              users={allUsers}
              onNotify={showToast}
            />
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB: GESTION DES PLANS (ADMIN)
            ───────────────────────────────────────────── */}
        {activeTab === "admin-plans" && isSuperAdmin && (
          <div className="space-y-6">
            <AdminPlanManagement
              adminId={user.id}
              plans={planConfigs}
              onNotify={showToast}
            />
          </div>
        )}

        {/* ─────────────────────────────────────────────
            TAB: CATEGORIES (PREMIUM)
            ───────────────────────────────────────────── */}
        {activeTab === "categories" && (
          <CategoryManagement
            userId={user.id}
            isSuperAdmin={isSuperAdmin}
            canManageCategories={hasPremiumFeatures}
            categories={categories}
            onNotify={showToast}
          />
        )}

        {/* ─────────────────────────────────────────────
            TAB: SERVICES & OFFRES (PREMIUM)
            ───────────────────────────────────────────── */}
        {activeTab === "services" && (
          <ServicesManagement
            userId={user.id}
            isSuperAdmin={isSuperAdmin}
            canManageServices={hasPremiumFeatures}
            initialServices={services}
            onNotify={showToast}
            onUpgradeClick={() => setActiveTab("users")}
          />
        )}

        {/* TAB 3: PRODUITS & PRIX */}
        {activeTab === "products" && (
          <ProductsTab
            user={user}
            isSuperAdmin={isSuperAdmin}
            isSubscribed={isSubscribed}
            hasPremiumFeatures={hasPremiumFeatures}
            plan={plan}
            products={products}
            categories={categories}
            customPrices={customPrices}
            onNavigateTab={setActiveTab}
            onNotify={showToast}
            onCreateProduct={(formData) => createUserProduct(user.id, formData)}
            onUpdateProduct={(productId, formData) => updateUserProduct(productId, user.id, formData)}
            onDeleteProduct={(productId) => deleteUserProduct(productId, user.id)}
            onUpdateCustomPrice={(productId, price) => updateCustomProductPrice(user.id, productId, price)}
          />
        )}

        {/* TAB 4: GALERIE (NOTRE UNIVERS EN IMAGES) */}
        {activeTab === "gallery" && (
          <GalleryTab
            user={user}
            hasPremiumFeatures={hasPremiumFeatures}
            gallery={gallery}
            onNavigateTab={setActiveTab}
            onNotify={showToast}
            onAddGalleryImage={(formData) => addUserGalleryImage(user.id, formData)}
            onUpdateGalleryImage={(imageId, formData) => updateUserGalleryImage(imageId, user.id, formData)}
            onDeleteGalleryImage={(imageId) => deleteUserGalleryImage(imageId, user.id)}
          />
        )}

        {/* TAB : TÉMOIGNAGES CLIENTS */}
        {activeTab === "testimonials" && (
          <TestimonialsTab
            userTestimonials={userTestimonials}
            onDeleteTestimonial={(id) => deleteTestimonial(id)}
            onNotify={showToast}
          />
        )}

        {/* TAB 5: BOÎTE DE SUGGESTIONS (ADMIN & ABONNÉS) */}
        {activeTab === "suggestions" && (
          <SuggestionsTab
            user={user}
            isSuperAdmin={isSuperAdmin}
            adminSuggestions={adminSuggestions}
            suggestions={suggestions}
            onNotify={showToast}
            onSendAdminSuggestion={(formData) => sendAdminSuggestion(user.id, formData)}
            onToggleAdminSuggestionRead={(id, currentRead) => toggleAdminSuggestionRead(id, !currentRead)}
            onDeleteAdminSuggestion={(id) => deleteAdminSuggestion(id)}
            onUpdateAdminSuggestionStatus={(id, status, reply) => updateAdminSuggestionStatus(id, status, reply)}
          />
        )}

        {/* TAB 6: PARAMÈTRES / ORGANISATION & VITRINE & THÈME */}
        {activeTab === "settings" && (
          <SettingsTab
            user={user}
            onNotify={showToast}
            onUpdateProfile={(formData) => updateUserProfile(user.id, formData)}
          />
        )}

        {/* TAB: GESTION DU TENANT / USERNAME */}
        {activeTab === "tenant-requests" && (
          <TenantRequestsTab
            user={user}
            isSuperAdmin={isSuperAdmin}
            tenantChangeRequests={tenantChangeRequests}
            onNotify={showToast}
            onRequestUsernameChange={(newUsername) => requestUsernameChange(user.id, newUsername)}
            onApproveUsernameChange={(requestId) => adminApproveUsernameChange(requestId)}
            onRejectUsernameChange={(requestId, note) => adminRejectUsernameChange(requestId, note)}
          />
        )}
      </main>
    </div>
  );
}
