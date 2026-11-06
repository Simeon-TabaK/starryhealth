import React from "react";
import { CheckCircle2, Clock, AlertCircle, XCircle, PauseCircle, Crown, Zap, Shield } from "lucide-react";
import { PlanPricingItem, PlanType, PricingCalculationResult } from "./types";

export function calculatePricing(
  planName: PlanType,
  durationMonths: number,
  planPricings: PlanPricingItem[] = []
): PricingCalculationResult {
  const customPricing = planPricings?.find((p) => {
    const matchPlan = p.plan === planName;
    let matchPeriod = false;
    if (durationMonths === 1) matchPeriod = p.billingPeriod === "MONTHLY";
    else if (durationMonths === 3) matchPeriod = p.billingPeriod === "QUARTERLY";
    else if (durationMonths === 6) matchPeriod = p.billingPeriod === "SEMI_ANNUAL";
    else if (durationMonths === 12) matchPeriod = p.billingPeriod === "ANNUAL";
    return matchPlan && matchPeriod;
  });

  const baseMonthlyMap: Record<string, number> = {
    STANDARD: 2.99,
    SMART: 4.19,
    PREMIUM: 5.99,
  };

  const unitPrice = baseMonthlyMap[planName] || 2.99;
  const grossTotal = unitPrice * durationMonths;

  if (customPricing && customPricing.totalBilled) {
    const finalTotal = customPricing.totalBilled;
    const discountAmount = Math.max(0, grossTotal - finalTotal);
    const discountRate = grossTotal > 0 ? discountAmount / grossTotal : 0;
    return {
      unitPrice,
      durationMonths,
      grossTotal,
      discountRate,
      discountAmount,
      taxRate: 0,
      taxAmount: 0,
      finalTotal,
      effectiveMonthly: finalTotal / durationMonths,
    };
  }

  let discountRate = 0;
  if (durationMonths === 3) discountRate = 0.05;
  else if (durationMonths === 6) discountRate = 0.10;
  else if (durationMonths === 12) discountRate = 0.17;

  const discountAmount = grossTotal * discountRate;
  const finalTotal = grossTotal - discountAmount;
  const effectiveMonthly = finalTotal / durationMonths;

  return {
    unitPrice,
    durationMonths,
    grossTotal,
    discountRate,
    discountAmount,
    taxRate: 0,
    taxAmount: 0,
    finalTotal,
    effectiveMonthly,
  };
}

export function calculateDaysRemaining(expiresAt: string | Date | null | undefined): {
  days: number;
  isExpired: boolean;
  progressPct: number;
} {
  if (!expiresAt) return { days: 0, isExpired: false, progressPct: 0 };
  const exp = new Date(expiresAt).getTime();
  const now = Date.now();
  const diffMs = exp - now;
  const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const isExpired = days <= 0;

  const totalDays = 30;
  const progressPct = isExpired ? 0 : Math.min(100, Math.max(5, (days / totalDays) * 100));

  return { days: isExpired ? 0 : days, isExpired, progressPct };
}

export function formatDate(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDateShort(date: string | Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function StatusBadge({ status }: { status: string }) {
  const st = (status || "").toUpperCase();
  switch (st) {
    case "ACTIVE":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> Actif
        </span>
      );
    case "PENDING":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-500/30 animate-pulse">
          <Clock className="w-3.5 h-3.5" /> En attente
        </span>
      );
    case "EXPIRED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
          <AlertCircle className="w-3.5 h-3.5" /> Expiré
        </span>
      );
    case "REFUSED":
    case "REJECTED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-500/30">
          <XCircle className="w-3.5 h-3.5" /> Refusé
        </span>
      );
    case "SUSPENDED":
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 dark:bg-orange-950/60 dark:text-orange-300 border border-orange-500/30">
          <PauseCircle className="w-3.5 h-3.5" /> Suspendu
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {status}
        </span>
      );
  }
}

export function PlanBadge({ plan }: { plan: string }) {
  const pl = (plan || "STANDARD").toUpperCase();
  if (pl === "PREMIUM") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-700 dark:text-amber-400 border border-amber-500/40">
        <Crown className="w-3 h-3 text-amber-500" /> PREMIUM
      </span>
    );
  }
  if (pl === "SMART") {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300 border border-sky-500/30">
        <Zap className="w-3 h-3 text-sky-500" /> SMART
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-500/30">
      <Shield className="w-3 h-3 text-emerald-500" /> STANDARD
    </span>
  );
}

