"use client";

import React, { useState, useTransition } from "react";
import { Shield, Sparkles, History, CheckCircle2, AlertCircle, X } from "lucide-react";
import {
  requestUserSubscription,
  adminValidateSubscription,
  adminRefuseSubscription,
  adminSuspendSubscription,
  adminReactivateSubscription,
  adminExtendSubscription,
  adminDirectAssignSubscription,
  adminUpdateSubscription,
} from "@/app/dashboard/actions";
import { PlanPricingItem, PlanType, SubscriptionHistoryItem, SubscriptionItem } from "./subscription/types";
import { UserCurrentSubscription } from "./subscription/user-current-subscription";
import { SubscriptionPlansGrid } from "./subscription/subscription-plans-grid";
import { UserSubscriptionHistoryTable } from "./subscription/user-subscription-history-table";
import { AdminSubscriptionsTable } from "./subscription/admin-subscriptions-table";
import { AdminAuditHistoryTable } from "./subscription/admin-audit-history-table";
import { UserRequestModal } from "./subscription/modals/user-request-modal";
import { AdminRefuseModal } from "./subscription/modals/admin-refuse-modal";
import { AdminExtendModal } from "./subscription/modals/admin-extend-modal";
import { AdminSuspendModal } from "./subscription/modals/admin-suspend-modal";
import { AdminDirectAssignModal } from "./subscription/modals/admin-direct-assign-modal";
import { AdminEditModal } from "./subscription/modals/admin-edit-modal";

interface SubscriptionManagementProps {
  currentUser: any;
  isSuperAdmin: boolean;
  userSubscriptions: SubscriptionItem[];
  userSubscriptionHistory: SubscriptionHistoryItem[];
  allSubscriptions?: SubscriptionItem[];
  allSubscriptionHistory?: SubscriptionHistoryItem[];
  allUsers?: any[];
  planPricings?: PlanPricingItem[];
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

  // User modal state
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedPlanForRequest, setSelectedPlanForRequest] = useState<PlanType>("SMART");
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Admin action modal states
  const [refuseModalSub, setRefuseModalSub] = useState<SubscriptionItem | null>(null);
  const [extendModalSub, setExtendModalSub] = useState<SubscriptionItem | null>(null);
  const [suspendModalSub, setSuspendModalSub] = useState<SubscriptionItem | null>(null);
  const [editModalSub, setEditModalSub] = useState<SubscriptionItem | null>(null);
  const [directAssignModalOpen, setDirectAssignModalOpen] = useState(false);

  const currentSub = userSubscriptions[0] || null;

  // USER ACTION: Submit request
  const handleUserRequest = (plan: PlanType, durationMonths: number, notes: string) => {
    startTransition(async () => {
      try {
        await requestUserSubscription(currentUser.id, plan, durationMonths, notes);
        setShowRequestModal(false);
        setFeedbackMessage({
          type: "success",
          text: `Votre demande pour le forfait ${plan} (${durationMonths} mois) a bien été envoyée et est en attente de validation.`,
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
  const handleAdminRefuse = (subId: number, reason: string) => {
    startTransition(async () => {
      try {
        await adminRefuseSubscription(subId, currentUser.id, reason);
        setRefuseModalSub(null);
        setFeedbackMessage({ type: "success", text: "Demande d'abonnement refusée." });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors du refus." });
      }
    });
  };

  // ADMIN ACTION: Extend
  const handleAdminExtend = (subId: number, months: number, notes: string) => {
    startTransition(async () => {
      try {
        await adminExtendSubscription(subId, currentUser.id, months, notes);
        setExtendModalSub(null);
        setFeedbackMessage({ type: "success", text: `Abonnement prolongé de ${months} mois avec succès !` });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la prolongation." });
      }
    });
  };

  // ADMIN ACTION: Suspend
  const handleAdminSuspend = (subId: number, reason: string) => {
    startTransition(async () => {
      try {
        await adminSuspendSubscription(subId, currentUser.id, reason);
        setSuspendModalSub(null);
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

  // ADMIN ACTION: Direct Assign
  const handleAdminDirectAssign = (data: {
    userId: number;
    plan: PlanType;
    durationMonths: number;
    status: "ACTIVE" | "PENDING";
    notes: string;
  }) => {
    startTransition(async () => {
      try {
        await adminDirectAssignSubscription(
          currentUser.id,
          data.userId,
          data.plan,
          data.durationMonths,
          data.status,
          data.notes
        );
        setDirectAssignModalOpen(false);
        setFeedbackMessage({ type: "success", text: "Abonnement assigné directement avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de l'attribution." });
      }
    });
  };

  // ADMIN ACTION: Edit details
  const handleAdminUpdate = (subId: number, data: {
    plan: PlanType;
    status: string;
    durationMonths: number;
    expiresAtStr?: string;
    adminNotes: string;
  }) => {
    startTransition(async () => {
      try {
        await adminUpdateSubscription(subId, currentUser.id, data);
        setEditModalSub(null);
        setFeedbackMessage({ type: "success", text: "Abonnement mis à jour avec succès !" });
      } catch (err: any) {
        setFeedbackMessage({ type: "error", text: err?.message || "Erreur lors de la mise à jour." });
      }
    });
  };

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
        {!isSuperAdmin ? (
          <>
            <button
              onClick={() => setActiveSubTab("current")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === "current"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Mon Abonnement
            </button>
            <button
              onClick={() => setActiveSubTab("plans")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === "plans"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Choisir une Formule
            </button>
            <button
              onClick={() => setActiveSubTab("history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === "history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Historique ({userSubscriptions.length})
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setActiveSubTab("admin-manage")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === "admin-manage"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Gestion des Abonnements ({allSubscriptions.length})
            </button>
            <button
              onClick={() => setActiveSubTab("admin-history")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSubTab === "admin-history"
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              <History className="w-3.5 h-3.5" /> Journal d'Audit Global ({allSubscriptionHistory.length})
            </button>
            <button
              onClick={() => setActiveSubTab("plans")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
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

      {/* Tabs rendering */}
      {activeSubTab === "current" && !isSuperAdmin && (
        <UserCurrentSubscription
          currentSub={currentSub}
          onOpenRenewModal={() => {
            setSelectedPlanForRequest(currentSub?.plan || "SMART");
            setShowRequestModal(true);
          }}
        />
      )}

      {activeSubTab === "plans" && (
        <SubscriptionPlansGrid
          isSuperAdmin={isSuperAdmin}
          onSelectPlan={(plan) => {
            setSelectedPlanForRequest(plan);
            setShowRequestModal(true);
          }}
          onOpenRequestModal={() => setShowRequestModal(true)}
        />
      )}

      {activeSubTab === "history" && !isSuperAdmin && (
        <UserSubscriptionHistoryTable userSubscriptions={userSubscriptions} />
      )}

      {activeSubTab === "admin-manage" && isSuperAdmin && (
        <AdminSubscriptionsTable
          allSubscriptions={allSubscriptions}
          isPending={isPending}
          onValidate={handleAdminValidate}
          onOpenRefuseModal={setRefuseModalSub}
          onOpenExtendModal={setExtendModalSub}
          onOpenSuspendModal={setSuspendModalSub}
          onReactivate={handleAdminReactivate}
          onOpenEditModal={setEditModalSub}
          onOpenDirectAssignModal={() => setDirectAssignModalOpen(true)}
        />
      )}

      {activeSubTab === "admin-history" && isSuperAdmin && (
        <AdminAuditHistoryTable
          allSubscriptionHistory={allSubscriptionHistory}
          currentUserId={currentUser.id}
        />
      )}

      {/* Modals */}
      <UserRequestModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        onSubmit={handleUserRequest}
        isPending={isPending}
        planPricings={planPricings}
        defaultPlan={selectedPlanForRequest}
      />

      <AdminRefuseModal
        subscription={refuseModalSub}
        onClose={() => setRefuseModalSub(null)}
        onConfirm={handleAdminRefuse}
        isPending={isPending}
      />

      <AdminExtendModal
        subscription={extendModalSub}
        onClose={() => setExtendModalSub(null)}
        onConfirm={handleAdminExtend}
        isPending={isPending}
      />

      <AdminSuspendModal
        subscription={suspendModalSub}
        onClose={() => setSuspendModalSub(null)}
        onConfirm={handleAdminSuspend}
        isPending={isPending}
      />

      <AdminDirectAssignModal
        isOpen={directAssignModalOpen}
        onClose={() => setDirectAssignModalOpen(false)}
        onConfirm={handleAdminDirectAssign}
        isPending={isPending}
        allUsers={allUsers}
      />

      <AdminEditModal
        subscription={editModalSub}
        onClose={() => setEditModalSub(null)}
        onConfirm={handleAdminUpdate}
        isPending={isPending}
      />
    </div>
  );
}
