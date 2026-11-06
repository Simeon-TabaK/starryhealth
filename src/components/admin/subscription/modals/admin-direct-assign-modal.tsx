"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { PlanType } from "../types";

interface AdminDirectAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    userId: number;
    plan: PlanType;
    durationMonths: number;
    status: "ACTIVE" | "PENDING";
    notes: string;
  }) => void;
  isPending: boolean;
  allUsers?: any[];
}

export function AdminDirectAssignModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  allUsers = [],
}: AdminDirectAssignModalProps) {
  const [userId, setUserId] = useState<number>(allUsers[0]?.id || 0);
  const [plan, setPlan] = useState<PlanType>("STANDARD");
  const [durationMonths, setDurationMonths] = useState<number>(1);
  const [status, setStatus] = useState<"ACTIVE" | "PENDING">("ACTIVE");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm({ userId: Number(userId), plan, durationMonths: Number(durationMonths), status, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Attribuer un Abonnement
          </h3>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="font-semibold block mb-1">Bénéficiaire</label>
            <select
              value={userId}
              onChange={(e) => setUserId(Number(e.target.value))}
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
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanType)}
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
              value={durationMonths}
              onChange={(e) => setDurationMonths(Number(e.target.value))}
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
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
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
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Attribution par l'administrateur..."
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
              {isPending ? "Attribution..." : "Attribuer l'abonnement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

