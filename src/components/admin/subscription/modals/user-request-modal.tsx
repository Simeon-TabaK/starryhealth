"use client";

import React, { useState } from "react";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import { PlanPricingItem, PlanType } from "../types";
import { calculatePricing } from "../helpers";

interface UserRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (plan: PlanType, durationMonths: number, notes: string) => void;
  isPending: boolean;
  planPricings?: PlanPricingItem[];
  defaultPlan?: PlanType;
}

export function UserRequestModal({
  isOpen,
  onClose,
  onSubmit,
  isPending,
  planPricings = [],
  defaultPlan = "SMART",
}: UserRequestModalProps) {
  const [selectedPlan, setSelectedPlan] = useState<PlanType>(defaultPlan);
  const [selectedDuration, setSelectedDuration] = useState<number>(1);
  const [notes, setNotes] = useState("");
  const [showPriceDetails, setShowPriceDetails] = useState(false);

  if (!isOpen) return null;

  const pricing = calculatePricing(selectedPlan, selectedDuration, planPricings);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(selectedPlan, selectedDuration, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Demande d'Abonnement
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Votre demande sera enregistrée en attente et validée par l'équipe.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Formula Select */}
          <div>
            <label className="font-bold block mb-1.5 text-slate-700 dark:text-slate-300">
              Formule souhaitée
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(["STANDARD", "SMART", "PREMIUM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPlan(p)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    selectedPlan === p
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-800 dark:text-emerald-200 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs">{p}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {p === "STANDARD" ? "$2.99/m" : p === "SMART" ? "$4.19/m" : "$5.99/m"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Duration Select */}
          <div>
            <label className="font-bold block mb-1.5 text-slate-700 dark:text-slate-300">
              Durée de l'abonnement
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { m: 1, label: "1 Mois" },
                { m: 3, label: "3 Mois" },
                { m: 6, label: "6 Mois" },
                { m: 12, label: "1 An" },
              ].map((dur) => (
                <button
                  key={dur.m}
                  type="button"
                  onClick={() => setSelectedDuration(dur.m)}
                  className={`p-2.5 rounded-xl border text-center transition-all ${
                    selectedDuration === dur.m
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 font-bold text-emerald-800 dark:text-emerald-200"
                      : "border-slate-200 dark:border-slate-800 text-slate-600"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Price Calculation */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Montant Total Calculé
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                    ${pricing.finalTotal.toFixed(2)}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    (soit ${pricing.effectiveMonthly.toFixed(2)}/mois)
                  </span>
                </div>
              </div>

              {pricing.discountAmount > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-500/30">
                  -{(pricing.discountRate * 100).toFixed(0)}% de remise
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowPriceDetails(!showPriceDetails)}
              className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline pt-1 cursor-pointer"
            >
              <span>{showPriceDetails ? "Masquer les détails" : "Voir plus de détails"}</span>
              {showPriceDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showPriceDetails && (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2 text-[11px] animate-in fade-in duration-150">
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Prix unitaire :</span>
                  <span className="font-semibold">${pricing.unitPrice.toFixed(2)} / mois</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Durée choisie :</span>
                  <span className="font-semibold">{pricing.durationMonths} mois</span>
                </div>
                <div className="flex justify-between text-slate-600 dark:text-slate-300">
                  <span>Sous-total brut ({pricing.unitPrice.toFixed(2)} × {pricing.durationMonths}) :</span>
                  <span className="font-semibold">${pricing.grossTotal.toFixed(2)}</span>
                </div>
                {pricing.discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                    <span>Remise durée :</span>
                    <span>-${pricing.discountAmount.toFixed(2)} ({(pricing.discountRate * 100).toFixed(0)}%)</span>
                  </div>
                )}
                <div className="pt-2 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between font-bold text-slate-900 dark:text-white text-xs">
                  <span>Total calculé :</span>
                  <span className="text-emerald-600 dark:text-emerald-400">
                    ${pricing.finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="font-bold block mb-1 text-slate-700 dark:text-slate-300">
              Message ou note pour l'administrateur (facultatif)
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex : Référence du virement, demande de facture spécifique..."
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
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
            >
              {isPending ? "Envoi..." : "Confirmer ma Demande"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

