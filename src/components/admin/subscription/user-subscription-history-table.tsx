"use client";

import React from "react";
import { SubscriptionItem } from "./types";
import { formatDate, formatDateShort, PlanBadge, StatusBadge } from "./helpers";

interface UserSubscriptionHistoryTableProps {
  userSubscriptions: SubscriptionItem[];
}

export function UserSubscriptionHistoryTable({
  userSubscriptions = [],
}: UserSubscriptionHistoryTableProps) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <h3 className="text-base font-bold text-slate-900 dark:text-white">
          Historique de vos Abonnements & Événements
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Retrouvez l'ensemble de vos demandes, validations, prolongations et statuts d'abonnements passés et en cours.
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
                  <td className="p-4 font-bold">
                    <PlanBadge plan={s.plan} />
                  </td>
                  <td className="p-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="p-4 text-slate-500">
                    {formatDate(s.requestedAt || s.createdAt)}
                  </td>
                  <td className="p-4 font-semibold">
                    {s.startDate ? formatDateShort(s.startDate) : "—"}
                  </td>
                  <td className="p-4 font-semibold">
                    {s.expiresAt ? formatDateShort(s.expiresAt) : "—"}
                  </td>
                  <td className="p-4 font-bold">{s.durationMonths || 1} mois</td>
                  <td className="p-4 text-slate-500 max-w-xs truncate">
                    {s.adminNotes || "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400">
                  Aucun historique d'abonnement pour le moment.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

