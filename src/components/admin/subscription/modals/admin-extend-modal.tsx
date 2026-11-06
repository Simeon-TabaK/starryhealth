"use client";

import React, { useState } from "react";
import { PlusCircle } from "lucide-react";
import { SubscriptionItem } from "../types";

interface AdminExtendModalProps {
  subscription: SubscriptionItem | null;
  onClose: () => void;
  onConfirm: (subId: number, months: number, notes: string) => void;
  isPending: boolean;
}

export function AdminExtendModal({
  subscription,
  onClose,
  onConfirm,
  isPending,
}: AdminExtendModalProps) {
  const [months, setMonths] = useState(1);
  const [notes, setNotes] = useState("");

  if (!subscription) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(subscription.id, months, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-sky-600" /> Prolonger l'abonnement
        </h3>
        <p className="text-xs text-slate-500">
          Prolonger l'abonnement de <strong>{subscription.user?.name || subscription.user?.username}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Nombre de mois à ajouter</label>
            <select
              value={months}
              onChange={(e) => setMonths(Number(e.target.value))}
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
            <label className="font-semibold block mb-1">Note pour l'historique (facultatif)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Récompense fidélité, renouvellement reçu..."
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
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
              className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold"
            >
              {isPending ? "Prolongation..." : "Prolonger"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

