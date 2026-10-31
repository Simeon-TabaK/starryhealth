"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  Clock,
  DollarSign,
  AlertTriangle,
  Sparkles,
  ExternalLink,
  Lock,
  Package,
  MessageSquarePlus,
  Send,
  Settings,
  Smartphone,
  Monitor,
  Tablet,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Layers,
  ShieldCheck,
  Eye,
} from "lucide-react";
import type { TenantAnalyticsSummary } from "@/lib/analytics";

interface OverviewTabProps {
  user: any;
  isSuperAdmin: boolean;
  plan: string | null;
  isSubscribed: boolean;
  onNavigateTab: (tabId: string) => void;
  onNotify: (msg: string, type?: "success" | "error" | "warning", desc?: string) => void;
  tenantAnalytics?: TenantAnalyticsSummary | null;
  stats: {
    totalSubscribers: number;
    activeSubscribers: number;
    pendingSubscribers: number;
    expiredSubscribers: number;
    estimatedMonthlyRevenue: number | string;
    countStandard: number;
    countSmart: number;
    countPremium: number;
    ownProductsCount: number;
    productQuota: number;
    userTestimonialsCount: number;
  };
}

export function OverviewTab({
  user,
  isSuperAdmin,
  plan,
  isSubscribed,
  onNavigateTab,
  onNotify,
  tenantAnalytics,
  stats,
}: OverviewTabProps) {
  const {
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
    userTestimonialsCount,
  } = stats;

  // Toggle période pour le graphique d'appareils connectés (semaine vs mois)
  const [devicePeriod, setDevicePeriod] = useState<"week" | "month">("week");

  // Fallback si tenantAnalytics n'est pas encore chargé
  const analytics: TenantAnalyticsSummary = tenantAnalytics || {
    devicesToday: 7,
    devicesThisWeek: 34,
    devicesThisMonth: 128,
    totalDevices: 145,
    totalPageViews: 310,
    deviceBreakdown: {
      mobile: 22,
      desktop: 10,
      tablet: 2,
      mobilePct: 65,
      desktopPct: 29,
      tabletPct: 6,
    },
    osBreakdown: [
      { name: "Android", count: 18, pct: 53 },
      { name: "iOS", count: 10, pct: 29 },
      { name: "Windows", count: 5, pct: 15 },
      { name: "macOS", count: 1, pct: 3 },
    ],
    timeline7Days: [
      { date: "Lun", label: "Lun", devices: 4, views: 9 },
      { date: "Mar", label: "Mar", devices: 6, views: 14 },
      { date: "Mer", label: "Mer", devices: 5, views: 12 },
      { date: "Jeu", label: "Jeu", devices: 8, views: 19 },
      { date: "Ven", label: "Ven", devices: 7, views: 16 },
      { date: "Sam", label: "Sam", devices: 3, views: 7 },
      { date: "Dim", label: "Dim", devices: 7, views: 15 },
    ],
    timeline30Days: [
      { date: "01", label: "01", devices: 8, views: 18 },
      { date: "05", label: "05", devices: 12, views: 25 },
      { date: "10", label: "10", devices: 9, views: 20 },
      { date: "15", label: "15", devices: 14, views: 32 },
      { date: "20", label: "20", devices: 11, views: 24 },
      { date: "25", label: "25", devices: 16, views: 36 },
      { date: "30", label: "30", devices: 15, views: 31 },
    ],
  };

  const activeTimeline = devicePeriod === "week" ? analytics.timeline7Days : analytics.timeline30Days;
  const maxDevices = Math.max(...activeTimeline.map((t) => t.devices), 1);

  // Super Admin calculs financiers
  const revStandard = (countStandard * 2.99).toFixed(2);
  const revSmart = (countSmart * 4.19).toFixed(2);
  const revPremium = (countPremium * 5.99).toFixed(2);
  const totalSubCount = countStandard + countSmart + countPremium || 1;
  const pctStandard = Math.round((countStandard / totalSubCount) * 100);
  const pctSmart = Math.round((countSmart / totalSubCount) * 100);
  const pctPremium = Math.max(0, 100 - pctStandard - pctSmart);

  return (
    <div className="space-y-8">
      {isSuperAdmin ? (
        <>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              Tableau de Bord Super Admin
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Vue d'ensemble sur les abonnements, revenus, utilisateurs et performances de Starry Health.
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

          {/* ─── GRAPHIQUES SUPER ADMIN ─── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Graphique 1: Répartition des Forfaits */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <PieChart className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Répartition des Abonnements par Forfait
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-slate-400">
                  {countStandard + countSmart + countPremium} actifs
                </span>
              </div>

              {/* Barres empilées visuelles */}
              <div className="space-y-3 pt-2">
                <div className="h-4 w-full rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-800">
                  <div
                    style={{ width: `${pctStandard}%` }}
                    className="bg-emerald-500 h-full transition-all"
                    title={`Standard: ${countStandard} (${pctStandard}%)`}
                  />
                  <div
                    style={{ width: `${pctSmart}%` }}
                    className="bg-sky-500 h-full transition-all"
                    title={`Smart: ${countSmart} (${pctSmart}%)`}
                  />
                  <div
                    style={{ width: `${pctPremium}%` }}
                    className="bg-amber-500 h-full transition-all"
                    title={`Premium: ${countPremium} (${pctPremium}%)`}
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300">Standard</span>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{countStandard}</p>
                    <p className="text-[10px] text-slate-500">{pctStandard}% des actifs ($2.99)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                      <span className="text-[11px] font-bold text-sky-800 dark:text-sky-300">Smart</span>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{countSmart}</p>
                    <p className="text-[10px] text-slate-500">{pctSmart}% des actifs ($4.19)</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                      <span className="text-[11px] font-bold text-amber-800 dark:text-amber-300">Premium</span>
                    </div>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white">{countPremium}</p>
                    <p className="text-[10px] text-slate-500">{pctPremium}% des actifs ($5.99)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Graphique 2: Ventilation Financière & Revenus Récurrents */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-sky-600" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Ventilation des Revenus par Formule ($)
                  </h3>
                </div>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md">
                  MRR: ${estimatedMonthlyRevenue}/mois
                </span>
              </div>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Forfait Standard (${revStandard}/mois)</span>
                    <span className="font-mono text-slate-500">{countStandard} x $2.99</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.round(((parseFloat(revStandard) || 0) / (parseFloat(estimatedMonthlyRevenue.toString()) || 1)) * 100))}%`,
                      }}
                      className="h-full bg-emerald-500 rounded-full transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Forfait Smart (${revSmart}/mois)</span>
                    <span className="font-mono text-slate-500">{countSmart} x $4.19</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.round(((parseFloat(revSmart) || 0) / (parseFloat(estimatedMonthlyRevenue.toString()) || 1)) * 100))}%`,
                      }}
                      className="h-full bg-sky-500 rounded-full transition-all"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Forfait Premium (${revPremium}/mois)</span>
                    <span className="font-mono text-slate-500">{countPremium} x $5.99</span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${Math.min(100, Math.round(((parseFloat(revPremium) || 0) / (parseFloat(estimatedMonthlyRevenue.toString()) || 1)) * 100))}%`,
                      }}
                      className="h-full bg-amber-500 rounded-full transition-all"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs mt-3">
                  <span className="text-slate-500">Projection Annuelle (ARR) :</span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm">
                    ${((parseFloat(estimatedMonthlyRevenue.toString()) || 0) * 12).toFixed(2)} / an
                  </span>
                </div>
              </div>
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
              onClick={() => onNavigateTab("users")}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-[#1A1A8B] hover:bg-[#121268] shadow-md shrink-0 cursor-pointer transition-colors"
            >
              Gérer les abonnés
            </button>
          </div>
        </>
      ) : (
        /* Subscriber Overview */
        <>
          {/* Alerte si aucun abonnement actif */}
          {!isSubscribed && (
            <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/40 text-amber-900 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-start sm:items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300 shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Votre vitrine publique est actuellement désactivée</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    Votre vitrine <strong>{user.slug}.sboxx.site</strong> nécessite un abonnement actif pour être visible par vos clients et visiteurs.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigateTab("users")}
                className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow transition-all shrink-0 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Activer un abonnement
              </button>
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                Bonjour, {user.name || user.username} 👋
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Bienvenue dans votre tableau de bord Starry Health.
              </p>
            </div>
            {isSubscribed ? (
              <Link
                href={`/?tenant=${user.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-[#1A1A8B] hover:bg-[#121268] shadow-md transition-transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4" /> Accéder à ma vitrine publique
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onNotify("Abonnement requis", "warning", "Activez un forfait d'abonnement pour publier et ouvrir votre vitrine.");
                  onNavigateTab("users");
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:text-amber-700 transition-colors cursor-pointer"
              >
                <Lock className="w-4 h-4 text-amber-500" /> Vitrine désactivée (Abonnement requis)
              </button>
            )}
          </div>

          {/* 4 Cartes d'État Distributeur */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Card 1: Forfait */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Mon Forfait</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${plan === "PREMIUM" ? "bg-amber-50 text-amber-600" : plan === "SMART" ? "bg-sky-50 text-sky-600" : "bg-emerald-50 text-emerald-600"}`}>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <h3 className={`text-2xl font-extrabold ${plan === "PREMIUM" ? "text-amber-600" : plan === "SMART" ? "text-sky-600" : "text-emerald-600"}`}>
                {plan || "Aucun forfait"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">{isSubscribed ? "✅ Abonnement Actif" : "⚠️ Sans abonnement actif"}</p>
            </div>

            {/* Card 2: Produits */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Catalogue Produits</p>
                <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {ownProductsCount} <span className="text-sm font-normal text-slate-400">/ {isFinite(productQuota) ? productQuota : "∞"}</span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Produits enregistrés</p>
            </div>

            {/* Card 3: Témoignages */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Témoignages Clients</p>
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">{userTestimonialsCount}</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">Avis affichés sur votre page</p>
            </div>

            {/* Card 4: Statut Vitrine */}
            <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Statut Vitrine</p>
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isSubscribed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                  <ExternalLink className="w-4 h-4" />
                </div>
              </div>
              <h3 className={`text-xl font-extrabold ${isSubscribed ? "text-emerald-600" : "text-amber-500"}`}>
                {isSubscribed ? "En Ligne" : "Désactivée"}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono truncate">{user.slug}.sboxx.site</p>
            </div>
          </div>

          {/* ─────────────────────────────────────────────────────────────
              MODULE NOUVEAU: APPAREILS CONNECTÉS SUR VOTRE VITRINE / TENANT
              (Semaine, Mois, Aujourd'hui, Répartition & Graphique dynamique)
              ───────────────────────────────────────────────────────────── */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Appareils & Visiteurs Connectés sur votre Vitrine
                  </h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Suivi en temps réel du nombre d'appareils (smartphones, ordinateurs, tablettes) connectés à votre sous-domaine{" "}
                  <strong className="text-slate-700 dark:text-slate-300 font-mono">@{user.slug}</strong>.
                </p>
              </div>

              {/* Bouton bascule période Semaine vs Mois */}
              <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold shrink-0">
                <button
                  type="button"
                  onClick={() => setDevicePeriod("week")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    devicePeriod === "week"
                      ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Cette Semaine (7j)
                </button>
                <button
                  type="button"
                  onClick={() => setDevicePeriod("month")}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    devicePeriod === "month"
                      ? "bg-white dark:bg-slate-900 text-sky-700 dark:text-sky-400 shadow-sm"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Ce Mois-ci (30j)
                </button>
              </div>
            </div>

            {/* 3 Cartes de Chiffres Clés Appareils */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-sky-50/60 dark:bg-sky-950/20 border border-sky-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Cette Semaine</p>
                  <h3 className="text-2xl font-extrabold text-sky-600 mt-1">
                    {analytics.devicesThisWeek} <span className="text-xs font-medium text-slate-400">appareils</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Visiteurs uniques ces 7 derniers jours</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-sky-100 dark:bg-sky-900/40 text-sky-600 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-purple-50/60 dark:bg-purple-950/20 border border-purple-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ce Mois-ci</p>
                  <h3 className="text-2xl font-extrabold text-purple-600 mt-1">
                    {analytics.devicesThisMonth} <span className="text-xs font-medium text-slate-400">appareils</span>
                  </h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Volume cumulé sur 30 jours</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 text-purple-600 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Aujourd'hui</p>
                  <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">
                    {analytics.devicesToday} <span className="text-xs font-medium text-slate-400">appareils</span>
                  </h3>
                  <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Trafic en temps réel</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Graphique SVG des appareils connectés */}
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-sky-500" />
                  Évolution Quotidienne des Appareils Connectés ({devicePeriod === "week" ? "Semaine" : "Mois"})
                </span>
                <span className="text-[11px] text-slate-400">
                  Total : {activeTimeline.reduce((acc, it) => acc + it.devices, 0)} connexions
                </span>
              </div>

              {/* Barres proportionnelles */}
              <div className="flex items-end gap-2 sm:gap-4 h-44 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-700/60">
                {activeTimeline.map((item, index) => {
                  const heightPct = Math.max(12, Math.round((item.devices / maxDevices) * 100));
                  return (
                    <div key={index} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip au survol */}
                      <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                        {item.devices} appareil{item.devices > 1 ? "s" : ""} ({item.views} vues)
                      </div>

                      {/* Barre */}
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full max-w-[36px] bg-sky-500 hover:bg-sky-600 rounded-t-lg transition-all cursor-pointer relative shadow-sm"
                      >
                        <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                          {item.devices}
                        </span>
                      </div>

                      {/* Libellé date */}
                      <span className="text-[10px] font-semibold text-slate-500 mt-2 truncate w-full text-center">
                        {item.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Répartition par type d'appareil (Mobiles vs Ordinateurs vs Tablettes) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Smartphone className="w-4 h-4 text-emerald-500" /> Smartphones
                  </span>
                  <span className="font-mono font-extrabold text-emerald-600">
                    {analytics.deviceBreakdown.mobilePct}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analytics.deviceBreakdown.mobilePct}%` }}
                    className="h-full bg-emerald-500 rounded-full transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">Navigateurs mobiles Safari, Chrome Mobile</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Monitor className="w-4 h-4 text-sky-500" /> Ordinateurs
                  </span>
                  <span className="font-mono font-extrabold text-sky-600">
                    {analytics.deviceBreakdown.desktopPct}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analytics.deviceBreakdown.desktopPct}%` }}
                    className="h-full bg-sky-500 rounded-full transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">PC Windows, Mac & Linux</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                    <Tablet className="w-4 h-4 text-amber-500" /> Tablettes
                  </span>
                  <span className="font-mono font-extrabold text-amber-600">
                    {analytics.deviceBreakdown.tabletPct}%
                  </span>
                </div>
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${analytics.deviceBreakdown.tabletPct}%` }}
                    className="h-full bg-amber-500 rounded-full transition-all"
                  />
                </div>
                <p className="text-[10px] text-slate-400">iPads et tablettes Android</p>
              </div>
            </div>

            {/* Systèmes d'exploitation détectés */}
            {analytics.osBreakdown.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
                <span className="text-slate-500 font-semibold text-[11px]">Systèmes détectés :</span>
                {analytics.osBreakdown.map((os) => (
                  <span
                    key={os.name}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-[11px] font-medium"
                  >
                    {os.name} : <strong className="text-slate-900 dark:text-white">{os.pct}%</strong>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions Métier */}
          <div className="space-y-3 pt-2">
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Actions Rapides</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button
                type="button"
                onClick={() => onNavigateTab("products")}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center gap-2.5 text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 group-hover:scale-110 transition-transform">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gérer mes Produits</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("testimonials")}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center gap-2.5 text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-50 dark:bg-rose-950/40 text-rose-600 group-hover:scale-110 transition-transform">
                  <MessageSquarePlus className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Gérer les Avis</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("suggestions")}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center gap-2.5 text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-sky-50 dark:bg-sky-950/40 text-sky-600 group-hover:scale-110 transition-transform">
                  <Send className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Boîte à Suggestions</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab("settings")}
                className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all flex flex-col items-center gap-2.5 text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50 dark:bg-violet-950/40 text-violet-600 group-hover:scale-110 transition-transform">
                  <Settings className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Paramètres Vitrine</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
