"use client";

import React, { useState } from "react";
import { Search, PlusCircle, Check, X, PlayCircle } from "lucide-react";
import { SubscriptionItem } from "./types";
import { calculateDaysRemaining, formatDate, formatDateShort, PlanBadge, StatusBadge } from "./helpers";

interface AdminSubscriptionsTableProps {
  allSubscriptions: SubscriptionItem[];
  isPending: boolean;
  onValidate: (subId: number, duration: number) => void;
  onOpenRefuseModal: (sub: SubscriptionItem) => void;
  onOpenExtendModal: (sub: SubscriptionItem) => void;
  onOpenSuspendModal: (sub: SubscriptionItem) => void;
  onReactivate: (subId: number) => void;
  onOpenEditModal: (sub: SubscriptionItem) => void;
  onOpenDirectAssignModal: () => void;
}

export function AdminSubscriptionsTable({
  allSubscriptions = [],
  isPending,
  onValidate,
  onOpenRefuseModal,
  onOpenExtendModal,
  onOpenSuspendModal,
  onReactivate,
  onOpenEditModal,
  onOpenDirectAssignModal,
}: AdminSubscriptionsTableProps) {
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<string>("");

  const filteredSubscriptions = allSubscriptions.filter((s) => {
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
      const subDate = new Date(s.createdAt || "").toISOString().slice(0, 10);
      if (subDate !== dateFilter) return false;
    }
    return true;
  });

  return (
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
              className="px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-slate-800 text-xs font-semibold cursor-pointer"
            >
              Réinitialiser
            </button>
          )}
        </div>

        <button
          onClick={onOpenDirectAssignModal}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-2 shrink-0 cursor-pointer"
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
                      <td className="p-4">
                        <PlanBadge plan={s.plan} />
                      </td>
                      <td className="p-4">
                        <StatusBadge status={s.status} />
                      </td>
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
                          <span className={`font-bold ${daysInfo.days <= 5 ? "text-rose-600" : "text-emerald-600"}`}>
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
                                onClick={() => onValidate(s.id, s.durationMonths || 1)}
                                disabled={isPending}
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm flex items-center gap-1 cursor-pointer"
                                title="Valider la demande"
                              >
                                <Check className="w-3 h-3" /> Valider
                              </button>
                              <button
                                onClick={() => onOpenRefuseModal(s)}
                                disabled={isPending}
                                className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-300 font-semibold text-[11px] border border-rose-500/20 cursor-pointer"
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
                                onClick={() => onOpenExtendModal(s)}
                                className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 dark:bg-sky-950/50 dark:text-sky-300 font-semibold text-[11px] border border-sky-500/20 cursor-pointer"
                                title="Prolonger"
                              >
                                + Prolonger
                              </button>
                              <button
                                onClick={() => onOpenSuspendModal(s)}
                                className="px-2.5 py-1.5 rounded-lg bg-orange-50 text-orange-700 hover:bg-orange-100 dark:bg-orange-950/50 dark:text-orange-300 font-semibold text-[11px] border border-orange-500/20 cursor-pointer"
                                title="Suspendre"
                              >
                                Suspendre
                              </button>
                            </>
                          )}

                          {/* If SUSPENDED or EXPIRED: Reactivate */}
                          {(s.status === "SUSPENDED" || s.status === "EXPIRED") && (
                            <button
                              onClick={() => onReactivate(s.id)}
                              disabled={isPending}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 font-semibold text-[11px] border border-emerald-500/20 flex items-center gap-1 cursor-pointer"
                              title="Réactiver"
                            >
                              <PlayCircle className="w-3 h-3" /> Réactiver
                            </button>
                          )}

                          {/* Edit details */}
                          <button
                            onClick={() => onOpenEditModal(s)}
                            className="px-2 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-semibold cursor-pointer"
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
  );
}

