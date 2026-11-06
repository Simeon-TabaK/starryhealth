"use client";

import React from "react";
import { Shield, RefreshCw, Clock, XCircle, PauseCircle, Sparkles } from "lucide-react";
import { SubscriptionItem } from "./types";
import { calculateDaysRemaining, formatDate, formatDateShort, PlanBadge, StatusBadge } from "./helpers";

interface UserCurrentSubscriptionProps {
  currentSub: SubscriptionItem | null;
  onOpenRenewModal: () => void;
}

export function UserCurrentSubscription({ currentSub, onOpenRenewModal }: UserCurrentSubscriptionProps) {
  const currentSubDays = currentSub ? calculateDaysRemaining(currentSub.expiresAt) : null;

  if (!currentSub) {
    return (
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
          onClick={onOpenRenewModal}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 inline-flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" /> Découvrir les forfaits et souscrire
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Forfait {currentSub.plan}
            </h2>
            <PlanBadge plan={currentSub.plan} />
            <StatusBadge status={currentSub.status} />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Durée souscrite : <strong>{currentSub.durationMonths || 1} mois</strong>
          </p>
        </div>

        <button
          onClick={onOpenRenewModal}
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

          <div className="w-full bg-emerald-200/50 dark:bg-emerald-950/60 rounded-full h-3 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${currentSubDays.progressPct}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Votre forfait expire le <strong>{formatDateShort(currentSub.expiresAt)}</strong>. Vous recevrez des rappels avant l'échéance.
          </p>
        </div>
      )}

      {/* Pending approval notice */}
      {currentSub.status === "PENDING" && (
        <div className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-500/30 flex items-start gap-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-amber-900 dark:text-amber-200">
              Demande d'abonnement en attente d'examen
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
              Demande d'abonnement non validée
            </div>
            <p className="text-slate-600 dark:text-slate-300">
              Motif communiqué : {currentSub.adminNotes || "Non spécifié."}
            </p>
            <button
              onClick={onOpenRenewModal}
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
              Votre compte a été suspendu par l'administration. Raison : {currentSub.adminNotes || "Veuillez contacter le support."}
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
            Date d'Expiration (Fin)
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
  );
}

