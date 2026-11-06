"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PlanType, SubscriptionItem } from "../types";

interface AdminEditModalProps {
  subscription: SubscriptionItem | null;
  onClose: () => void;
  onConfirm: (subId: number, data: {
    plan: PlanType;
    status: string;
    durationMonths: number;
    expiresAtStr?: string;
    adminNotes: string;
  }) => void;
  isPending: boolean;
}

export function AdminEditModal({
  subscription,
  onClose,
  onConfirm,
  isPending,
}: AdminEditModalProps) {
  const [plan, setPlan] = useState<PlanType>("STANDARD");
  const [status, setStatus] = useState("ACTIVE");
  const [durationMonths, setDurationMonths] = useState(1);
  const [expiresAt, setExpiresAt] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (subscription) {
      setPlan(subscription.plan);
      setStatus(subscription.status);
      setDurationMonths(subscription.durationMonths || 1);
      setExpiresAt(subscription.expiresAt ? new Date(subscription.expiresAt).toISOString().slice(0, 10) : "");
      setNotes(subscription.adminNotes || "");
    }
  }, [subscription]);

  if (!subscription) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(subscription.id, {
      plan,
      status,
      durationMonths: Number(durationMonths),
      expiresAtStr: expiresAt || undefined,
      adminNotes: notes,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Modifier l'Abonnement #{subscription.id}
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Formule</label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanType)}
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
              value={status}
              onChange={(e) => setStatus(e.target.value)}
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
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Date d'expiration</label>
            <input
              type="date"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="font-semibold block mb-1">Note / Motif</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              {isPending ? "Enregistrement..." : "Enregistrer modifications"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

