"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <ToastCard key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
      ))}
    </div>
  );
}

function ToastCard({ toast, onDismiss }: { toast: ToastItem; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const styles = {
    success: {
      bg: "bg-white dark:bg-slate-900 border-emerald-500/40 text-emerald-950 dark:text-emerald-100",
      iconBg: "bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
      icon: <CheckCircle2 className="w-5 h-5" />,
      bar: "bg-emerald-500",
    },
    error: {
      bg: "bg-white dark:bg-slate-900 border-rose-500/40 text-rose-950 dark:text-rose-100",
      iconBg: "bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400",
      icon: <AlertCircle className="w-5 h-5" />,
      bar: "bg-rose-500",
    },
    warning: {
      bg: "bg-white dark:bg-slate-900 border-amber-500/40 text-amber-950 dark:text-amber-100",
      iconBg: "bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400",
      icon: <AlertTriangle className="w-5 h-5" />,
      bar: "bg-amber-500",
    },
    info: {
      bg: "bg-white dark:bg-slate-900 border-sky-500/40 text-sky-950 dark:text-sky-100",
      iconBg: "bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-400",
      icon: <Info className="w-5 h-5" />,
      bar: "bg-sky-500",
    },
  }[toast.type];

  return (
    <div
      className={`pointer-events-auto rounded-2xl border p-4 shadow-xl backdrop-blur-md flex items-start gap-3 transition-all transform animate-in slide-in-from-top-3 fade-in duration-200 overflow-hidden relative ${styles.bg}`}
    >
      <div className={`p-2 rounded-xl shrink-0 ${styles.iconBg}`}>{styles.icon}</div>
      <div className="flex-1 min-w-0 pr-1">
        <p className="text-xs font-bold leading-tight">{toast.message}</p>
        {toast.description && (
          <p className="text-[11px] opacity-80 mt-0.5 leading-snug">{toast.description}</p>
        )}
      </div>
      <button
        type="button"
        onClick={onDismiss}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors p-1 -mr-1 -mt-1"
      >
        <X className="w-4 h-4" />
      </button>
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 opacity-70 animate-[shrink_4.5s_linear_forwards] ${styles.bar}`}
      />
    </div>
  );
}

