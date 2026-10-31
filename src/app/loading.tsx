import React from "react";
import { Loader2 } from "lucide-react";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col items-center gap-4 text-center max-w-sm w-full animate-in fade-in duration-300">
        <div className="w-14 h-14 rounded-2xl bg-[#1A1A8B]/10 dark:bg-[#CCAB00]/10 flex items-center justify-center text-[#1A1A8B] dark:text-[#CCAB00]">
          <Loader2 className="w-7 h-7 animate-spin" />
        </div>
        <div>
          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
            Chargement en cours
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Préparation de votre environnement Starry Health...
          </p>
        </div>
      </div>
    </div>
  );
}

