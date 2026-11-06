"use client";

import React, { useState } from "react";
import { PauseCircle } from "lucide-react";
import { SubscriptionItem } from "../types";

interface AdminSuspendModalProps {
  subscription: SubscriptionItem | null;
  onClose: () => void;
  onConfirm: (subId: number, reason: string) => void;
  isPending: boolean;
}

export function AdminSuspendModal({
  subscription,
  onClose,
  onConfirm,
  isPending,
}: AdminSuspendModalProps) {
  const [reason, setReason] = useState("");

  if (!subscription) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(subscription.id, reason);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-2xl space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <PauseCircle className="w-5 h-5 text-orange-600" /> Suspendre l'abonnement
        </h3>
        <p className="text-xs text-slate-500">
          L'utilisateur passera en statut <strong>Suspendu</strong> et ne pourra plus publier de produits.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Raison de la suspension (facultatif)..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
          />
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
              className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold"
            >
              {isPending ? "Suspension..." : "Suspendre"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

