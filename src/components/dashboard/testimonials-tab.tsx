"use client";

import React from "react";
import { MessageSquarePlus, Trash2 } from "lucide-react";

interface TestimonialsTabProps {
  userTestimonials?: any[];
  onDeleteTestimonial: (id: number) => Promise<any>;
  onNotify: (message: string, type?: "success" | "error") => void;
}

export function TestimonialsTab({
  userTestimonials = [],
  onDeleteTestimonial,
  onNotify,
}: TestimonialsTabProps) {
  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer ce témoignage ?")) return;
    try {
      await onDeleteTestimonial(id);
      onNotify("Témoignage supprimé !");
    } catch {
      onNotify("Erreur lors de la suppression.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Témoignages & Avis Clients ({userTestimonials.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Consultez et gérez les avis de vos clients affichés publiquement sur votre vitrine.
          </p>
        </div>
      </div>

      {userTestimonials.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <MessageSquarePlus className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Aucun témoignage pour l'instant.</p>
          <p className="text-xs text-slate-400 mt-1">Les avis soumis par vos visiteurs apparaîtront ici.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {userTestimonials.map((t: any) => (
            <div key={t.id} className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950/40 flex items-center justify-center font-bold text-emerald-700 text-sm shrink-0">
                    {t.authorName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-slate-900 dark:text-white truncate">{t.authorName}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i} className={`text-xs ${i < (t.rating || 5) ? "text-amber-400" : "text-slate-200 dark:text-slate-700"}`}>★</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                  "{t.content}"
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

