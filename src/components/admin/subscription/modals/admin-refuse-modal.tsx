"use client";

import React, { useState } from "react";
import { XCircle } from "lucide-react";
import { SubscriptionItem } from "../types";

interface AdminRefuseModalProps {
  subscription: SubscriptionItem | null;
  onClose: () => void;
  onConfirm: (subId: number, reason: string) => void;
  isPending: boolean;
}

export function AdminRefuseModal({
  subscription,
  onClose,
  onConfirm,
  isPending,
}: AdminRefuseModalProps) {
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
          <XCircle className="w-5 h-5 text-rose-600" /> Refuser la demande d'abonnement
        </h3>
        <p className="text-xs text-slate-500">
          Veuillez préciser le motif de refus. Il sera visible par l'utilisateur.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            rows={3}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex : Paiement non reçu, informations incomplètes..."
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white"
            required
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
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              {isPending ? "Refus..." : "Confirmer le Refus"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

