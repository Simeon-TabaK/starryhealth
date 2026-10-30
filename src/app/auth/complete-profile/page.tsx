"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AtSign, CheckCircle2, ShieldAlert, Sparkles } from "lucide-react";
import Link from "next/link";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$/;

export default function CompleteProfilePage() {
  const { update } = useSession();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const validateFormat = (val: string): string | null => {
    if (!val) return null;
    if (val.length < 5) return "Minimum 5 caractères requis.";
    if (val.length > 30) return "Maximum 30 caractères autorisés.";
    if (/[A-Z]/.test(val))
      return "Uniquement des lettres minuscules, chiffres et tirets.";
    if (/[^a-z0-9-]/.test(val)) return "Caractères spéciaux non autorisés.";
    if (val.startsWith("-") || val.endsWith("-"))
      return "Ne peut pas commencer ou finir par un tiret.";
    if (!SLUG_REGEX.test(val)) return "Format invalide pour un sous-domaine.";
    return null;
  };

  const handleChange = (raw: string) => {
    const cleaned = raw
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    setUsername(cleaned);
    setSuggestions([]);

    if (!cleaned) {
      setStatus("idle");
      setError(null);
      return;
    }

    const fmtErr = validateFormat(cleaned);
    if (fmtErr) {
      setStatus("invalid");
      setError(fmtErr);
      return;
    }

    if (debounceTimer) clearTimeout(debounceTimer);
    setStatus("checking");
    setError(null);

    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(cleaned)}`
        );
        const data = await res.json();
        if (data.available) {
          setStatus("available");
          setError(null);
        } else {
          setStatus("taken");
          setError(data.error || "Déjà pris.");
          setSuggestions(data.suggestions || []);
        }
      } catch {
        setStatus("idle");
      }
    }, 500);
    setDebounceTimer(t);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status !== "available") {
      setError("Veuillez choisir un identifiant disponible.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, slug: username }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la mise à jour.");
        return;
      }

      setSuccess(true);
      // Update the JWT/session to clear the needsUsername flag
      await update({ needsUsername: false, slug: username, username });
      setTimeout(() => router.push("/dashboard"), 1200);
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block">
            <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center">
              <img
                src="/assets/logo.png"
                alt="Starry Health"
                className="object-contain"
              />
            </div>
          </Link>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Finalisez votre profil
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choisissez votre identifiant tenant unique. Il servira de
            sous-domaine pour votre vitrine publique.
          </p>
        </div>

        {/* Success banner */}
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Identifiant créé ! Redirection vers votre tableau de bord...
            </span>
          </div>
        )}

        {/* Error banner */}
        {error && status !== "available" && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Identifiant Tenant / Sous-domaine{" "}
              <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="text"
                value={username}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="clinique-goma"
                required
                autoFocus
                className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${status === "available"
                    ? "border-emerald-500 focus:ring-emerald-500/10"
                    : status === "taken" || status === "invalid"
                      ? "border-red-400 focus:ring-red-400/10"
                      : "border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/10"
                  }`}
              />
              <div className="absolute right-3.5 top-3.5">
                {status === "checking" && (
                  <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                )}
                {status === "available" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                )}
                {(status === "taken" || status === "invalid") && (
                  <ShieldAlert className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            {status === "available" && (
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Disponible ! Votre
                vitrine :{" "}
                <span className="font-mono font-bold">
                  {username}.sboxx.site
                </span>
              </p>
            )}
            {(status === "taken" || status === "invalid") && error && (
              <p className="text-[11px] text-red-500 mt-1">{error}</p>
            )}
            {suggestions.length > 0 && (
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <span className="text-[10px] text-slate-500">
                  Suggestions :
                </span>
                {suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => handleChange(s)}
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {status === "idle" && (
              <p className="text-[10px] text-slate-500 mt-1">
                Lettres minuscules, chiffres et tirets uniquement. Ex:
                clinique-goma, pharma24 (5–30 car.)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={saving || status !== "available"}
            className="w-full py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? "Création en cours..." : "Confirmer mon identifiant"}
          </button>
        </form>
      </div>
    </div>
  );
}
