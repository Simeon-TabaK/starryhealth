"use client";

import { useState, useTransition } from "react";
import {
  Shield, Zap, Crown, Check, AlertCircle, Clock, Calendar, CheckCircle2,
  XCircle, PauseCircle, PlayCircle, PlusCircle, RefreshCw, Filter,
  Search, ArrowRight, User as UserIcon, AlertTriangle, FileText,
  History, Sparkles, ChevronRight, ChevronDown, ChevronUp, Info, Percent, X
} from "lucide-react";
import {
  requestUserSubscription,
  adminValidateSubscription,
  adminRefuseSubscription,
  adminSuspendSubscription,
  adminReactivateSubscription,
  adminExtendSubscription,
  adminDirectAssignSubscription,
  adminUpdateSubscription
} from "@/app/dashboard/actions";

interface SubscriptionManagementProps {
  currentUser: any;
  isSuperAdmin: boolean;
  userSubscriptions: any[];
  userSubscriptionHistory: any[];
  allSubscriptions?: any[];
  allSubscriptionHistory?: any[];
  allUsers?: any[];
  planPricings?: any[];
}

export function SubscriptionManagement({
  currentUser,
  isSuperAdmin,
  userSubscriptions = [],
  userSubscriptionHistory = [],
  allSubscriptions = [],
  allSubscriptionHistory = [],
  allUsers = [],
  planPricings = [],
}: SubscriptionManagementProps) {
  const [isPending, startTransition] = useTransition();
  const [activeSubTab, setActiveSubTab] = useState<"current" | "plans" | "history" | "admin-manage" | "admin-history">(
    isSuperAdmin ? "admin-manage" : "current"
  );

  // User request state
  const [selectedPlanForRequest, setSelectedPlanForRequest] = useState<"STANDARD" | "SMART" | "PREMIUM">("SMART");
  const [selectedDurationForRequest, setSelectedDurationForRequest] = useState<number>(1);
  const [requestNotes, setRequestNotes] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Helper de calcul dynamique du montant selon le forfait et la durée
  const calculatePricing = (planName: "STANDARD" | "SMART" | "PREMIUM", durationMonths: number) => {
    const customPricing = planPricings?.find((p: any) => {
      const matchPlan = p.plan === planName;
      let matchPeriod = false;
      if (durationMonths === 1) matchPeriod = p.billingPeriod === "MONTHLY";
      else if (durationMonths === 3) matchPeriod = p.billingPeriod === "QUARTERLY";
      else if (durationMonths === 6) matchPeriod = p.billingPeriod === "SEMI_ANNUAL";
      else if (durationMonths === 12) matchPeriod = p.billingPeriod === "ANNUAL";
      return matchPlan && matchPeriod;
    });

    const baseMonthlyMap: Record<string, number> = {
      STANDARD: 2.99,
      SMART: 4.19,
      PREMIUM: 5.99,
    };

    const unitPrice = baseMonthlyMap[planName] || 2.99;
    const grossTotal = unitPrice * durationMonths;

    if (customPricing && customPricing.totalBilled) {
      const finalTotal = customPricing.totalBilled;
      const discountAmount = Math.max(0, grossTotal - finalTotal);
      const discountRate = grossTotal > 0 ? discountAmount / grossTotal : 0;
      return {
        unitPrice,
        durationMonths,
        grossTotal,
        discountRate,
        discountAmount,
        taxRate: 0,
        taxAmount: 0,
        finalTotal,
        effectiveMonthly: finalTotal / durationMonths,
      };
    }

    let discountRate = 0;
    if (durationMonths === 3) discountRate = 0.05;
    else if (durationMonths === 6) discountRate = 0.10;
    else if (durationMonths === 12) discountRate = 0.17;

    const discountAmount = grossTotal * discountRate;
    const finalTotal = grossTotal - discountAmount;
    const effectiveMonthly = finalTotal / durationMonths;

    return {
      unitPrice,
      durationMonths,
      grossTotal,
      discountRate,
      discountAmount,
      taxRate: 0,
      taxAmount: 0,
      finalTotal,
      effectiveMonthly,
    };
  };

  // Admin filter states
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  // Admin action modals
  const [refuseModalSub, setRefuseModalSub] = useState<any | null>(null);
  const [refuseReason, setRefuseReason] = useState("");

  const [extendModalSub, setExtendModalSub] = useState<any | null>(null);
  const [extendMonths, setExtendMonths] = useState<number>(1);
  const [extendNotes, setExtendNotes] = useState("");

  const [suspendModalSub, setSuspendModalSub] = useState<any | null>(null);
  const [suspendReason, setSuspendReason] = useState("");

  const [editModalSub, setEditModalSub] = useState<any | null>(null);
  const [editForm, setEditForm] = useState<{
    plan: "STANDARD" | "SMART" | "PREMIUM";
    status: string;
    durationMonths: number;
    expiresAt: string;
    notes: string;
  }>({
    plan: "STANDARD",
    status: "ACTIVE",
    durationMonths: 1,
    expiresAt: "",
    notes: "",
  });

  const [directAssignModalOpen, setDirectAssignModalOpen] = useState(false);
  const [directAssignForm, setDirectAssignForm] = useState<{
    userId: number;
    plan: "STANDARD" | "SMART" | "PREMIUM";
    durationMonths: number;
    status: "ACTIVE" | "PENDING";
    notes: string;
  }>({
    userId: allUsers[0]?.id || 0,
    plan: "STANDARD",
    durationMonths: 1,
    status: "ACTIVE",
    notes: "",
  });

  // Active current subscription for logged in user
  const currentSub = userSubscriptions[0] || null;

  // Calculate days remaining helper
  const calculateDaysRemaining = (expiresAt: string | Date | null | undefined): { days: number; isExpired: boolean; progressPct: number } => {
    if (!expiresAt) return { days: 0, isExpired: false, progressPct: 0 };
    const exp = new Date(expiresAt).getTime();
    const now = Date.now();
    const diffMs = exp - now;
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const isExpired = days <= 0;

    // Approximate progress on a 30-day or custom duration scale
    const totalDays = 30;
    const progressPct = isExpired ? 0 : Math.min(100, Math.max(5, (days / totalDays) * 100));

    return { days: isExpired ? 0 : days, isExpired, progressPct };
  };

  const currentSubDays = currentSub ? calculateDaysRemaining(currentSub.expiresAt) : null;

  // Format date helper
  const formatDate = (date: string | Date | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (date: string | Date | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status Badge Helper
  const renderStatusBadge = (status: string) => {
    const st = (status || "").toUpperCase();
    switch (st) {
      case "ACTIVE":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Actif
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/30 animate-pulse">
            <Clock className="w-3.5 h-3.5" /> En attente
          </span>
        );
      case "EXPIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
            <AlertCircle className="w-3.5 h-3.5" /> Expiré
          </span>
        );
      case "REFUSED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-500/30">
            <XCircle className="w-3.5 h-3.5" /> Refusé
          </span>
        );
      case "SUSPENDED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-500/30">
            <PauseCircle className="w-3.5 h-3.5" /> Suspendu
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {status}
          </span>
        );
    }
  };

  // Plan Badge Helper
  const renderPlanBadge = (plan: string) => {
    const pl = (plan || "STANDARD").toUpperCase();
    if (pl === "PREMIUM") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40">
          <Crown className="w-3 h-3 text-amber-500" /> PREMIUM
        </span>
      );
    }
    if (pl === "SMART") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-500/30">
          <Zap className="w-3 h-3 text-sky-500" /> SMART
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
        <Shield className="w-3 h-3 text-emerald-500" /> STANDARD
      </span>
    );
  };

  // USER ACTION: Submit Subscription Request
  const handleSubmitRequest = () => {
    startTransition(async () => {
      try {
        await requestUserSubscription(
          currentUser.id,
          selectedPlanForRequest,
          selectedDurationForRequest,
          requestNotes
        );
        setShowRequestModal(false);
        setRequestNotes("");
        setFeedbackMessage({
          type: "success",
          text: `Votre demande pour le forfait ${selectedPlanForRequest} (${selectedDurationForRequest} mois) a bien été envoyée et est en attente de validation.`,
        });
      } catch (err: any) {
        setFeedbackMessage({
          type: "error",
          text: err?.message || "Une erreur est survenue lors de l'envoi de la demande.",
        });
      }
    });
  };

  // ADMIN ACTION: Validate
  const handleAdminValidate = (subId: number, duration?: number) => {
    startTransition(async () => {
      try {
        await adminValidateSubscription(subId, currentUser.id, duration);
        setFeedbackMessage({ type: "success", text: "Abonnement validé et activé avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la validation." });
      }
    });
  };

  // ADMIN ACTION: Refuse
  const handleAdminRefuse = () => {
    if (!refuseModalSub) return;
    startTransition(async () => {
      try {
        await adminRefuseSubscription(refuseModalSub.id, currentUser.id, refuseReason);
        setRefuseModalSub(null);
        setRefuseReason("");
        setFeedbackMessage({ type: "success", text: "Demande d'abonnement refusée." });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors du refus." });
      }
    });
  };

  // ADMIN ACTION: Suspend
  const handleAdminSuspend = () => {
    if (!suspendModalSub) return;
    startTransition(async () => {
      try {
        await adminSuspendSubscription(suspendModalSub.id, currentUser.id, suspendReason);
        setSuspendModalSub(null);
        setSuspendReason("");
        setFeedbackMessage({ type: "success", text: "Abonnement suspendu." });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la suspension." });
      }
    });
  };

  // ADMIN ACTION: Reactivate
  const handleAdminReactivate = (subId: number) => {
    startTransition(async () => {
      try {
        await adminReactivateSubscription(subId, currentUser.id);
        setFeedbackMessage({ type: "success", text: "Abonnement réactivé avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la réactivation." });
      }
    });
  };

  // ADMIN ACTION: Extend
  const handleAdminExtend = () => {
    if (!extendModalSub) return;
    startTransition(async () => {
      try {
        await adminExtendSubscription(extendModalSub.id, currentUser.id, extendMonths, extendNotes);
        setExtendModalSub(null);
        setExtendMonths(1);
        setExtendNotes("");
        setFeedbackMessage({ type: "success", text: `Abonnement prolongé de ${extendMonths} mois avec succès !` });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la prolongation." });
      }
    });
  };

  // ADMIN ACTION: Direct Assign
  const handleAdminDirectAssign = () => {
    startTransition(async () => {
      try {
        await adminDirectAssignSubscription(
          currentUser.id,
          Number(directAssignForm.userId),
          directAssignForm.plan,
          Number(directAssignForm.durationMonths),
          directAssignForm.status,
          directAssignForm.notes
        );
        setDirectAssignModalOpen(false);
        setFeedbackMessage({ type: "success", text: "Abonnement assigné directement avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de l'attribution." });
      }
    });
  };

  // ADMIN ACTION: Update details
  const handleAdminUpdate = () => {
    if (!editModalSub) return;
    startTransition(async () => {
      try {
        await adminUpdateSubscription(editModalSub.id, currentUser.id, {
          plan: editForm.plan,
          status: editForm.status,
          durationMonths: Number(editForm.durationMonths),
          expiresAtStr: editForm.expiresAt || undefined,
          adminNotes: editForm.notes,
        });
        setEditModalSub(null);
        setFeedbackMessage({ type: "success", text: "Abonnement mis à jour avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la mise à jour." });
      }
    });
  };

  // Filter subscriptions for admin view
  const filteredSubscriptions = (allSubscriptions || []).filter((s) => {
    if (statusFilter !== "ALL" && s.status !== statusFilter) return false;
    if (userSearchQuery.trim()) {
      const q = userSearchQuery.toLowerCase();
      const userName = (s.user?.name || "").toLowerCase();
      const userEmail = (s.user?.email || "").toLowerCase();
      const userSlug = (s.user?.slug || "").toLowerCase();
      if (!userName.includes(q) && !userEmail.includes(q) && !userSlug.includes(q)) {
        return false;
      }
    }
    if (dateFilter) {
      const subDate = new Date(s.createdAt).toISOString().slice(0, 10);
      if (subDate !== dateFilter) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-semibold ${
            feedbackMessage.type === "success"
              ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-500/30"
              : "bg-rose-50 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-500/30"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Sub Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {!isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveSubTab("current")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "current"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Mon Abonnement
            </button>
            <button
              onClick={() => setActiveSubTab("plans")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "plans"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Choisir une Formule
            </button>
            <button
              onClick={() => setActiveSubTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Historique ({userSubscriptions.length})
            </button>
          </>
        )}

        {isSuperAdmin && (
          <>
            <button
              onClick={() => setActiveSubTab("admin-manage")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "admin-manage"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Gestion des Abonnements ({allSubscriptions.length})
            </button>
            <button
              onClick={() => setActiveSubTab("admin-history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "admin-history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Journal d&apos;Audit Global ({allSubscriptionHistory.length})
            </button>
            <button
              onClick={() => setActiveSubTab("plans")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSubTab === "plans"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Grille Tarifaire
            </button>
          </>
        )}
      </div>

      {/* ────────────────────────────────────────────────────────
          TAB 1: USER CURRENT SUBSCRIPTION
          ──────────────────────────────────────────────────────── */}
      {activeSubTab === "current" && !isSuperAdmin && (
        <div className="space-y-6">
          {currentSub ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                      Forfait {currentSub.plan}
                    </h2>
                    {renderPlanBadge(currentSub.plan)}
                    {renderStatusBadge(currentSub.status)}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Durée souscrite : <strong>{currentSub.durationMonths || 1} mois</strong>
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSelectedPlanForRequest(currentSub.plan);
                    setShowRequestModal(true);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 w-fit"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Renouveler / Changer de forfait
                </button>
              </div>

              {/* Days remaining highlight banner */}
              {currentSub.status === "ACTIVE" && currentSubDays && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-950 dark:text-emerald-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      Temps restant sur votre abonnement
                    </span>
                    <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-sm">
                      {currentSubDays.days} jour{currentSubDays.days > 1 ? "s" : ""} restant{currentSubDays.days > 1 ? "s" : ""}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-emerald-200/50 dark:bg-emerald-950/60 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${currentSubDays.progressPct}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Votre forfait expire le <strong>{formatDateShort(currentSub.expiresAt)}</strong>. Vous recevrez des rappels avant l&apos;échéance.
                  </p>
                </div>
              )}

              {/* Pending approval notice */}
              {currentSub.status === "PENDING" && (
                <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-amber-900 dark:text-amber-200">
                      Demande d&apos;abonnement en attente d&apos;examen
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Votre demande pour le forfait <strong>{currentSub.plan}</strong> ({currentSub.durationMonths || 1} mois) est actuellement entre les mains de notre équipe administrative. Vous serez activé dès validation.
                    </p>
                  </div>
                </div>
              )}

              {/* Refused notice */}
              {currentSub.status === "REFUSED" && (
                <div className="p-5 rounded-2xl bg-rose-50 dark:bg-rose-950/30 border border-rose-500/30 flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-rose-900 dark:text-rose-200">
                      Demande d&apos;abonnement non validée
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Motif communiqué : {currentSub.adminNotes || "Non spécifié."}
                    </p>
                    <button
                      onClick={() => setShowRequestModal(true)}
                      className="mt-2 text-rose-700 dark:text-rose-300 underline font-semibold"
                    >
                      Soumettre une nouvelle demande
                    </button>
                  </div>
                </div>
              )}

              {/* Suspended notice */}
              {currentSub.status === "SUSPENDED" && (
                <div className="p-5 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-500/30 flex items-start gap-3">
                  <PauseCircle className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs">
                    <div className="font-bold text-orange-900 dark:text-orange-200">
                      Abonnement temporairement suspendu
                    </div>
                    <p className="text-slate-600 dark:text-slate-300">
                      Votre compte a été suspendu par l&apos;administration. Raison : {currentSub.adminNotes || "Veuillez contacter le support."}
                    </p>
                  </div>
                </div>
              )}

              {/* Detailed Dates Table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Date de Demande
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {formatDate(currentSub.requestedAt || currentSub.createdAt)}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Date de Validation (Début)
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentSub.startDate ? formatDate(currentSub.startDate) : "En attente de validation"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Date d&apos;Expiration (Fin)
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentSub.expiresAt ? formatDate(currentSub.expiresAt) : "Calculée à l'activation"}
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Durée Souscrite
                  </span>
                  <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {currentSub.durationMonths || 1} Mois
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <Shield className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Aucun abonnement actif
                </h3>
                <p className="text-xs text-slate-500">
                  Vous utilisez actuellement le compte gratuit. Choisissez une formule pour publier vos produits et débloquer les fonctionnalités professionnelles.
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Découvrir les forfaits et souscrire
              </button>
            </div>
          )}
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 2: PLANS & FORMULAS (DISPONIBLES)
          ──────────────────────────────────────────────────────── */}
      {activeSubTab === "plans" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Nos Forfaits & Formules d&apos;Abonnement
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                Sélectionnez le forfait adapté à votre envergure. Chaque formule inclut une vitrine moderne et des fonctionnalités dédiées à votre visibilité.
              </p>
            </div>
            {!isSuperAdmin && (
              <button
                onClick={() => setShowRequestModal(true)}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" /> Soumettre une demande
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STANDARD */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover:border-emerald-500/50 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Shield className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600">
                    Démarrage
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">STANDARD</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-slate-900 dark:text-white">$2.99</span>
                    <span className="text-xs text-slate-500">/ mois</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Jusqu&apos;à <strong>5 produits</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Personnalisation Organisation & Logo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Favicon dynamique d&apos;organisation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Bouton WhatsApp Direct & Panier</span>
                  </li>
                </ul>
              </div>

              {!isSuperAdmin && (
                <button
                  onClick={() => {
                    setSelectedPlanForRequest("STANDARD");
                    setShowRequestModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white text-xs font-bold transition-colors"
                >
                  Choisir Standard
                </button>
              )}
            </div>

            {/* SMART */}
            <div className="p-6 rounded-3xl border-2 border-sky-500 bg-white dark:bg-slate-900 shadow-md flex flex-col justify-between relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                Plus Populaire
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-2xl bg-sky-500/10 text-sky-600">
                    <Zap className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300">
                    Recommandé
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">SMART</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-sky-600">$4.19</span>
                    <span className="text-xs text-slate-500">/ mois</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2 font-bold text-sky-950 dark:text-sky-200">
                    <Check className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Jusqu&apos;à <strong>10 produits</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Palette de couleurs personnalisée</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Section Offres & Services avec liens</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>Partenaires & Témoignages illimités</span>
                  </li>
                </ul>
              </div>

              {!isSuperAdmin && (
                <button
                  onClick={() => {
                    setSelectedPlanForRequest("SMART");
                    setShowRequestModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold shadow-md shadow-sky-600/20 transition-colors"
                >
                  Choisir Smart
                </button>
              )}
            </div>

            {/* PREMIUM */}
            <div className="p-6 rounded-3xl border border-amber-500/40 bg-gradient-to-br from-white to-amber-50/20 dark:from-slate-900 dark:to-amber-950/20 shadow-md flex flex-col justify-between hover:border-amber-500 transition-all">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600">
                    <Crown className="w-5 h-5" />
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                    Illimité
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">PREMIUM</h3>
                  <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-amber-600">$5.99</span>
                    <span className="text-xs text-slate-500">/ mois</span>
                  </div>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <li className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>Produits <strong>ILLIMITÉS</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Typographies & Polices au choix</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Galerie &quot;Notre univers en images&quot;</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Nom de domaine personnalisé lié</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Section FAQ dynamique</span>
                  </li>
                </ul>
              </div>

              {!isSuperAdmin && (
                <button
                  onClick={() => {
                    setSelectedPlanForRequest("PREMIUM");
                    setShowRequestModal(true);
                  }}
                  className="mt-6 w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-colors"
                >
                  Choisir Premium
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 3: USER SUBSCRIPTION HISTORY
          ──────────────────────────────────────────────────────── */}
      {activeSubTab === "history" && !isSuperAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Historique de vos Abonnements & Événements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Retrouvez l&apos;ensemble de vos demandes, validations, prolongations et statuts d&apos;abonnements passés et en cours.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Date de Demande</th>
                  <th className="p-4">Début</th>
                  <th className="p-4">Fin</th>
                  <th className="p-4">Durée</th>
                  <th className="p-4">Détails / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {userSubscriptions.length > 0 ? (
                  userSubscriptions.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 font-bold">{renderPlanBadge(s.plan)}</td>
                      <td className="p-4">{renderStatusBadge(s.status)}</td>
                      <td className="p-4 text-slate-500">{formatDate(s.requestedAt || s.createdAt)}</td>
                      <td className="p-4 font-semibold">{s.startDate ? formatDateShort(s.startDate) : "—"}</td>
                      <td className="p-4 font-semibold">{s.expiresAt ? formatDateShort(s.expiresAt) : "—"}</td>
                      <td className="p-4 font-bold">{s.durationMonths || 1} mois</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">
                        {s.adminNotes || "—"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400">
                      Aucun historique d&apos;abonnement pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 4: SUPER ADMIN - GESTION DES ABONNEMENTS
          ──────────────────────────────────────────────────────── */}
      {activeSubTab === "admin-manage" && isSuperAdmin && (
        <div className="space-y-6">
          {/* Top Admin Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Total</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">
                {allSubscriptions.length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30">
              <span className="text-[10px] font-bold text-amber-600 uppercase">En attente</span>
              <div className="text-xl font-extrabold text-amber-700 dark:text-amber-300 mt-1">
                {allSubscriptions.filter((s) => s.status === "PENDING").length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-500/30">
              <span className="text-[10px] font-bold text-emerald-600 uppercase">Actifs</span>
              <div className="text-xl font-extrabold text-emerald-700 dark:text-emerald-300 mt-1">
                {allSubscriptions.filter((s) => s.status === "ACTIVE").length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/20 border border-orange-500/30">
              <span className="text-[10px] font-bold text-orange-600 uppercase">Suspendus</span>
              <div className="text-xl font-extrabold text-orange-700 dark:text-orange-300 mt-1">
                {allSubscriptions.filter((s) => s.status === "SUSPENDED").length}
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Expirés / Refusés</span>
              <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300 mt-1">
                {allSubscriptions.filter((s) => s.status === "EXPIRED" || s.status === "REFUSED").length}
              </div>
            </div>
          </div>

          {/* Filter Bar & Direct Assign Button */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Search User */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filtrer par utilisateur, email..."
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              >
                <option value="ALL">Tous les statuts</option>
                <option value="PENDING">En attente (Demandes)</option>
                <option value="ACTIVE">Actifs</option>
                <option value="SUSPENDED">Suspendus</option>
                <option value="REFUSED">Refusés</option>
                <option value="EXPIRED">Expirés</option>
              </select>

              {/* Date Filter */}
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                title="Filtrer par date de création"
              />

              {(statusFilter !== "ALL" || userSearchQuery || dateFilter) && (
                <button
                  onClick={() => {
                    setStatusFilter("ALL");
                    setUserSearchQuery("");
                    setDateFilter("");
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  Réinitialiser
                </button>
              )}
            </div>

            <button
              onClick={() => setDirectAssignModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Créer / Assigner un Abonnement
            </button>
          </div>

          {/* Subscriptions Table */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="p-4">Utilisateur</th>
                    <th className="p-4">Formule</th>
                    <th className="p-4">Statut</th>
                    <th className="p-4">Demande</th>
                    <th className="p-4">Période (Début ➔ Fin)</th>
                    <th className="p-4">Jours Restants</th>
                    <th className="p-4 text-right">Actions Administrateur</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredSubscriptions.length > 0 ? (
                    filteredSubscriptions.map((s) => {
                      const daysInfo = calculateDaysRemaining(s.expiresAt);
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-white">
                              {s.user?.name || s.user?.username || `Utilisateur #${s.userId}`}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {s.user?.email}
                            </div>
                          </td>
                          <td className="p-4">{renderPlanBadge(s.plan)}</td>
                          <td className="p-4">{renderStatusBadge(s.status)}</td>
                          <td className="p-4 text-slate-500">
                            {formatDate(s.requestedAt || s.createdAt)}
                          </td>
                          <td className="p-4">
                            {s.startDate ? (
                              <div>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {formatDateShort(s.startDate)}
                                </span>
                                <span className="text-slate-400 mx-1">➔</span>
                                <span className="font-semibold text-slate-800 dark:text-slate-200">
                                  {formatDateShort(s.expiresAt)}
                                </span>
                                <div className="text-[10px] text-slate-400">
                                  Durée : {s.durationMonths || 1} mois
                                </div>
                              </div>
                            ) : (
                              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                                Non démarré (En attente)
                              </span>
                            )}
                          </td>
                          <td className="p-4">
                            {s.status === "ACTIVE" ? (
                              <span
                                className={`font-bold ${
                                  daysInfo.days <= 5 ? "text-rose-600" : "text-emerald-600"
                                }`}
                              >
                                {daysInfo.days} j
                              </span>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              {/* If PENDING: Validate or Refuse */}
                              {s.status === "PENDING" && (
                                <>
                                  <button
                                    onClick={() => handleAdminValidate(s.id, s.durationMonths || 1)}
                                    disabled={isPending}
                                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1"
                                    title="Valider la demande"
                                  >
                                    <Check className="w-3 h-3" /> Valider
                                  </button>
                                  <button
                                    onClick={() => {
                                      setRefuseModalSub(s);
                                      setRefuseReason("");
                                    }}
                                    disabled={isPending}
                                    className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 font-semibold text-[11px] border border-rose-500/20"
                                    title="Refuser la demande"
                                  >
                                    <X className="w-3 h-3" /> Refuser
                                  </button>
                                </>
                              )}

                              {/* If ACTIVE: Suspend or Extend */}
                              {s.status === "ACTIVE" && (
                                <>
                                  <button
                                    onClick={() => {
                                      setExtendModalSub(s);
                                      setExtendMonths(1);
                                      setExtendNotes("");
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-[11px] border border-sky-500/20"
                                    title="Prolonger"
                                  >
                                    + Prolonger
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSuspendModalSub(s);
                                      setSuspendReason("");
                                    }}
                                    className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/50 dark:text-orange-300 font-semibold text-[11px] border border-orange-500/20"
                                    title="Suspendre"
                                  >
                                    Suspendre
                                  </button>
                                </>
                              )}

                              {/* If SUSPENDED or EXPIRED: Reactivate */}
                              {(s.status === "SUSPENDED" || s.status === "EXPIRED") && (
                                <button
                                  onClick={() => handleAdminReactivate(s.id)}
                                  disabled={isPending}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/20 flex items-center gap-1"
                                  title="Réactiver"
                                >
                                  <PlayCircle className="w-3 h-3" /> Réactiver
                                </button>
                              )}

                              {/* Edit details */}
                              <button
                                onClick={() => {
                                  setEditModalSub(s);
                                  setEditForm({
                                    plan: s.plan,
                                    status: s.status,
                                    durationMonths: s.durationMonths || 1,
                                    expiresAt: s.expiresAt ? new Date(s.expiresAt).toISOString().slice(0, 10) : "",
                                    notes: s.adminNotes || "",
                                  });
                                }}
                                className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                                title="Modifier manuellement"
                              >
                                Modifier
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-400">
                        Aucun abonnement correspondant aux filtres.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          TAB 5: SUPER ADMIN - AUDIT & HISTORIQUE COMPLET
          ──────────────────────────────────────────────────────── */}
      {activeSubTab === "admin-history" && isSuperAdmin && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Journal d&apos;Audit Global des Abonnements
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Traçabilité complète des demandes, validations, modifications, prolongations et actions administratives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">Date & Heure</th>
                  <th className="p-4">Utilisateur</th>
                  <th className="p-4">Action</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Statut</th>
                  <th className="p-4">Durée</th>
                  <th className="p-4">Notes / Motif</th>
                  <th className="p-4">Opérateur</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {allSubscriptionHistory.length > 0 ? (
                  allSubscriptionHistory.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4 text-slate-500 whitespace-nowrap">{formatDate(h.createdAt)}</td>
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {h.user?.name || h.user?.username || `#${h.userId}`}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">{h.user?.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-extrabold uppercase text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          {h.action}
                        </span>
                      </td>
                      <td className="p-4">{renderPlanBadge(h.plan)}</td>
                      <td className="p-4">{renderStatusBadge(h.status)}</td>
                      <td className="p-4 font-bold">{h.durationMonths ? `${h.durationMonths} mois` : "—"}</td>
                      <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs">{h.notes || "—"}</td>
                      <td className="p-4 text-slate-400">
                        {h.performedBy ? (h.performedBy === currentUser.id ? "Vous (Admin)" : `Admin #${h.performedBy}`) : "Utilisateur"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      Aucun événement dans le journal d&apos;audit pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 1: USER REQUEST MODAL
          ──────────────────────────────────────────────────────── */}
      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Demande d&apos;Abonnement
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Votre demande sera enregistrée en attente et validée par l&apos;équipe.
                </p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Formula Select */}
              <div>
                <label className="font-bold block mb-1.5 text-slate-700 dark:text-slate-300">
                  Formule souhaitée
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["STANDARD", "SMART", "PREMIUM"] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedPlanForRequest(p)}
                      className={`p-3 rounded-2xl border text-center transition-all ${
                        selectedPlanForRequest === p
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-800 dark:text-emerald-200 shadow-sm"
                          : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <div className="text-xs">{p}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {p === "STANDARD" ? "$2.99/m" : p === "SMART" ? "$4.19/m" : "$5.99/m"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Select */}
              <div>
                <label className="font-bold block mb-1.5 text-slate-700 dark:text-slate-300">
                  Durée de l&apos;abonnement
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { m: 1, label: "1 Mois" },
                    { m: 3, label: "3 Mois" },
                    { m: 6, label: "6 Mois" },
                    { m: 12, label: "1 An" },
                  ].map((dur) => (
                    <button
                      key={dur.m}
                      type="button"
                      onClick={() => setSelectedDurationForRequest(dur.m)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedDurationForRequest === dur.m
                          ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-800 dark:text-emerald-200"
                          : "border-slate-200 dark:border-slate-800 text-slate-600"
                      }`}
                    >
                      {dur.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Price Calculation & Details */}
              {(() => {
                const pricing = calculatePricing(selectedPlanForRequest, selectedDurationForRequest);
                return (
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Montant Total Calculé
                        </span>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                            ${pricing.finalTotal.toFixed(2)}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            (soit ${pricing.effectiveMonthly.toFixed(2)}/mois)
                          </span>
                        </div>
                      </div>

                      {pricing.discountAmount > 0 && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                          -{(pricing.discountRate * 100).toFixed(0)}% de remise
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowPriceDetails(!showPriceDetails)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 cursor-pointer"
                    >
                      <span>{showPriceDetails ? "Masquer les détails" : "Voir plus de détails"}</span>
                      {showPriceDetails ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {showPriceDetails && (
                      <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2 text-[11px] animate-in fade-in duration-150">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Prix unitaire :</span>
                          <span className="font-semibold">${pricing.unitPrice.toFixed(2)} / mois</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Durée choisie :</span>
                          <span className="font-semibold">{pricing.durationMonths} mois</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span>Sous-total brut ({pricing.unitPrice.toFixed(2)} × {pricing.durationMonths}) :</span>
                          <span className="font-semibold">${pricing.grossTotal.toFixed(2)}</span>
                        </div>
                        {pricing.discountAmount > 0 && (
                          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                            <span>Remise durée :</span>
                            <span>-${pricing.discountAmount.toFixed(2)} ({(pricing.discountRate * 100).toFixed(0)}%)</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-500 dark:text-slate-400">
                          <span>Taxes éventuelles (TVA / Taxe 0%) :</span>
                          <span>$0.00</span>
                        </div>
                        <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-xs">
                          <span>Total calculé :</span>
                          <span className="text-emerald-600 dark:text-emerald-400">
                            ${pricing.finalTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Notes */}
              <div>
                <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
                  Message ou note pour l&apos;administrateur (facultatif)
                </label>
                <textarea
                  rows={3}
                  value={requestNotes}
                  onChange={(e) => setRequestNotes(e.target.value)}
                  placeholder="Ex : Référence du virement, demande de facture spécifique..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleSubmitRequest}
                disabled={isPending}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
              >
                {isPending ? "Envoi..." : "Confirmer ma Demande"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 2: ADMIN REFUSE
          ──────────────────────────────────────────────────────── */}
      {refuseModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <XCircle className="w-5 h-5 text-rose-600" /> Refuser la demande d&apos;abonnement
            </h3>
            <p className="text-xs text-slate-500">
              Veuillez préciser le motif de refus. Il sera visible par l&apos;utilisateur.
            </p>
            <textarea
              rows={3}
              value={refuseReason}
              onChange={(e) => setRefuseReason(e.target.value)}
              placeholder="Ex : Paiement non reçu, informations incomplètes..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
              required
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRefuseModalSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminRefuse}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                Confirmer le Refus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 3: ADMIN PROLONGER (EXTEND)
          ──────────────────────────────────────────────────────── */}
      {extendModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-sky-600" /> Prolonger l&apos;abonnement
            </h3>
            <p className="text-xs text-slate-500">
              Prolonger l&apos;abonnement de <strong>{extendModalSub.user?.name || extendModalSub.user?.username}</strong>.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nombre de mois à ajouter</label>
                <select
                  value={extendMonths}
                  onChange={(e) => setExtendMonths(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={1}>+1 Mois</option>
                  <option value={2}>+2 Mois</option>
                  <option value={3}>+3 Mois (Trimestre)</option>
                  <option value={6}>+6 Mois (Semestre)</option>
                  <option value={12}>+12 Mois (1 An)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Note pour l&apos;historique (facultatif)</label>
                <input
                  type="text"
                  value={extendNotes}
                  onChange={(e) => setExtendNotes(e.target.value)}
                  placeholder="Ex : Récompense fidélité, renouvellement reçu..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setExtendModalSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminExtend}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
              >
                Prolonger
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 4: ADMIN SUSPENDRE
          ──────────────────────────────────────────────────────── */}
      {suspendModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <PauseCircle className="w-5 h-5 text-orange-600" /> Suspendre l&apos;abonnement
            </h3>
            <p className="text-xs text-slate-500">
              L&apos;utilisateur passera en statut <strong>Suspendu</strong> et ne pourra plus publier de produits.
            </p>
            <textarea
              rows={3}
              value={suspendReason}
              onChange={(e) => setSuspendReason(e.target.value)}
              placeholder="Raison de la suspension (facultatif)..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSuspendModalSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminSuspend}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
              >
                Suspendre
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 5: ADMIN DIRECT ASSIGN / CREATE
          ──────────────────────────────────────────────────────── */}
      {directAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Attribuer un Abonnement
              </h3>
              <button onClick={() => setDirectAssignModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Bénéficiaire</label>
                <select
                  value={directAssignForm.userId}
                  onChange={(e) => setDirectAssignForm({ ...directAssignForm, userId: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  {allUsers.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name || u.username} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Formule</label>
                <select
                  value={directAssignForm.plan}
                  onChange={(e) => setDirectAssignForm({ ...directAssignForm, plan: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="STANDARD">STANDARD (5 produits)</option>
                  <option value="SMART">SMART (10 produits)</option>
                  <option value="PREMIUM">PREMIUM (Illimité)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Durée (Mois)</label>
                <select
                  value={directAssignForm.durationMonths}
                  onChange={(e) => setDirectAssignForm({ ...directAssignForm, durationMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value={1}>1 Mois</option>
                  <option value={2}>2 Mois</option>
                  <option value={3}>3 Mois</option>
                  <option value={6}>6 Mois</option>
                  <option value={12}>12 Mois (1 An)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Statut initial</label>
                <select
                  value={directAssignForm.status}
                  onChange={(e) => setDirectAssignForm({ ...directAssignForm, status: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">Actif (Démarrage immédiat)</option>
                  <option value="PENDING">En attente (Validation manuelle ultérieure)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Note (facultatif)</label>
                <input
                  type="text"
                  value={directAssignForm.notes}
                  onChange={(e) => setDirectAssignForm({ ...directAssignForm, notes: e.target.value })}
                  placeholder="Ex : Attribution par l'administrateur..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setDirectAssignModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminDirectAssign}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Attribuer l&apos;abonnement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ────────────────────────────────────────────────────────
          MODAL 6: ADMIN EDIT
          ──────────────────────────────────────────────────────── */}
      {editModalSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Modifier l&apos;Abonnement #{editModalSub.id}
              </h3>
              <button onClick={() => setEditModalSub(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Formule</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="STANDARD">STANDARD</option>
                  <option value="SMART">SMART</option>
                  <option value="PREMIUM">PREMIUM</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Statut</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="PENDING">En attente</option>
                  <option value="SUSPENDED">Suspendu</option>
                  <option value="REFUSED">Refusé</option>
                  <option value="EXPIRED">Expiré</option>
                </select>
              </div>

              <div>
                <label className="font-semibold block mb-1">Durée (Mois)</label>
                <input
                  type="number"
                  min={1}
                  value={editForm.durationMonths}
                  onChange={(e) => setEditForm({ ...editForm, durationMonths: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Date d&apos;expiration</label>
                <input
                  type="date"
                  value={editForm.expiresAt}
                  onChange={(e) => setEditForm({ ...editForm, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="font-semibold block mb-1">Note / Motif</label>
                <input
                  type="text"
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setEditModalSub(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
              >
                Annuler
              </button>
              <button
                onClick={handleAdminUpdate}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Enregistrer modifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

