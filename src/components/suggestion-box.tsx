"use client";

import { useState } from "react";
import { MessageSquarePlus, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestionBoxProps {
  tenantUserId?: number | null;
  primaryColor?: string;
}

export function SuggestionBox({
  tenantUserId,
  primaryColor = "#0f766e",
}: SuggestionBoxProps) {
  const [form, setForm] = useState({
    authorName: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, tenantUserId }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi.");
      setSent(true);
      setForm({ authorName: "", email: "", message: "" });
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto px-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
        {/* Header */}
        <div
          className="px-8 py-6 text-white"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}cc 100%)`,
          }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Boîte à Suggestions</h3>
              <p className="text-sm text-white/80">
                Partagez vos impressions ou posez une question
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-8 py-6">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center gap-4 py-8 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white text-lg">
                    Message envoyé !
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    Merci pour votre retour. Nous reviendrons vers vous rapidement.
                  </p>
                </div>
                <button
                  onClick={() => setSent(false)}
                  className="text-xs text-slate-400 underline hover:text-slate-600 transition-colors"
                >
                  Envoyer une autre suggestion
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">
                      Votre nom (optionnel)
                    </label>
                    <input
                      type="text"
                      value={form.authorName}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, authorName: e.target.value }))
                      }
                      placeholder="Jean Dupont"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
                      style={{ "--tw-ring-color": primaryColor } as React.CSSProperties}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">
                      Email (optionnel)
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      placeholder="jean@email.com"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1.5">
                    Votre message <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, message: e.target.value }))
                    }
                    placeholder="Partagez votre avis, une question ou une suggestion…"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 resize-none transition-all"
                  />
                </div>

                {error && (
                  <p className="text-xs text-rose-500 font-medium">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading || !form.message.trim()}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ backgroundColor: primaryColor }}
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Envoyer ma suggestion
                    </>
                  )}
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
