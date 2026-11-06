"use client";

import React from "react";
import { SubscriptionHistoryItem } from "./types";
import { formatDate, PlanBadge, StatusBadge } from "./helpers";

interface AdminAuditHistoryTableProps {
  allSubscriptionHistory: SubscriptionHistoryItem[];
  currentUserId: number;
}

export function AdminAuditHistoryTable({
  allSubscriptionHistory = [],
  currentUserId,
}: AdminAuditHistoryTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Journal d'Audit Global des Abonnements
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
                  <td className="p-4">
                    <PlanBadge plan={h.plan} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={h.status} />
                  </td>
                  <td className="p-4 font-bold">{h.durationMonths ? `${h.durationMonths} mois` : "—"}</td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 max-w-xs">{h.notes || "—"}</td>
                  <td className="p-4 text-slate-400">
                    {h.performedBy ? (h.performedBy === currentUserId ? "Vous (Admin)" : `Admin #${h.performedBy}`) : "Utilisateur"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-8 text-center text-slate-400">
                  Aucun événement dans le journal d'audit pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

