"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  LogIn,
  UserPlus,
  Lock,
  Mail,
  User,
  AtSign,
  ShieldAlert,
  CheckCircle2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";

function AuthComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialMode = searchParams.get("mode") === "register" ? "register" : "login";

  const [mode, setMode] = useState<"login" | "register">(initialMode);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Form states - Login
  const [identifier, setIdentifier] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Form states - Register
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // Username availability check states
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken" | "invalid">("idle");
  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const [usernameDebounceTimer, setUsernameDebounceTimer] = useState<NodeJS.Timeout | null>(null);

  const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$/;

  const validateUsernameFormat = (value: string): string | null => {
    if (!value) return null;
    if (value.length < 5) return "Minimum 5 caractères requis.";
    if (value.length > 30) return "Maximum 30 caractères autorisés.";
    if (/[A-Z]/.test(value)) return "Uniquement des lettres minuscules, chiffres et tirets.";
    if (/[^a-z0-9-]/.test(value)) return "Caractères spéciaux et espaces non autorisés.";
    if (value.startsWith("-") || value.endsWith("-")) return "Ne peut pas commencer ou se terminer par un tiret.";
    if (!SLUG_REGEX.test(value)) return "Format invalide pour un sous-domaine.";
    return null;
  };

  const handleUsernameChange = (raw: string) => {
    // Auto-clean: lowercase, replace spaces with hyphens, remove invalid chars
    const cleaned = raw.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
    setRegUsername(cleaned);
    setUsernameSuggestions([]);

    if (!cleaned) {
      setUsernameStatus("idle");
      setUsernameError(null);
      return;
    }

    const formatErr = validateUsernameFormat(cleaned);
    if (formatErr) {
      setUsernameStatus("invalid");
      setUsernameError(formatErr);
      return;
    }

    // Debounce API check
    if (usernameDebounceTimer) clearTimeout(usernameDebounceTimer);
    setUsernameStatus("checking");
    setUsernameError(null);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/check-username?username=${encodeURIComponent(cleaned)}`);
        const data = await res.json();
        if (data.available) {
          setUsernameStatus("available");
          setUsernameError(null);
        } else {
          setUsernameStatus("taken");
          setUsernameError(data.error || "Ce nom d'utilisateur est déjà pris.");
          setUsernameSuggestions(data.suggestions || []);
        }
      } catch {
        setUsernameStatus("idle");
        setUsernameError(null);
      }
    }, 500);
    setUsernameDebounceTimer(timer);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        identifier: identifier.trim(),
        password: loginPassword,
        redirect: false,
      });

      if (res?.error) {
        setError("Identifiant ou mot de passe incorrect.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch {
      setError("Une erreur inattendue est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (regName.trim().length < 2) {
      setError("Le nom complet doit comporter au moins 2 caractères.");
      return;
    }

    if (!regEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regEmail.trim())) {
      setError("Veuillez saisir une adresse email valide.");
      return;
    }

    if (regPassword.length < 8) {
      setError("Le mot de passe doit comporter au moins 8 caractères.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    if (!regUsername || regUsername.length < 5) {
      setError("L'identifiant tenant (username) est obligatoire et doit comporter au moins 5 caractères.");
      return;
    }
    const fmtErr = validateUsernameFormat(regUsername);
    if (fmtErr) {
      setError(fmtErr);
      return;
    }
    if (usernameStatus === "taken" || usernameStatus === "invalid") {
      setError("Veuillez choisir un identifiant tenant valide et disponible.");
      return;
    }
    if (usernameStatus === "checking") {
      setError("Vérification de l'identifiant en cours. Veuillez patienter.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          username: regUsername.trim() || undefined,
          password: regPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Une erreur est survenue lors de la création du compte.");
        setLoading(false);
        return;
      }

      setSuccess("Compte créé avec succès ! Connexion en cours...");

      // Connexion automatique après inscription
      const autoSignIn = await signIn("credentials", {
        identifier: regEmail.trim(),
        password: regPassword,
        redirect: false,
      });

      if (autoSignIn?.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setMode("login");
        setIdentifier(regEmail);
        setLoginPassword("");
        setSuccess("Votre compte est créé. Vous pouvez maintenant vous connecter.");
        setLoading(false);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setGoogleLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-sm">

        {/* Header / Brand */}
        <div className="text-center space-y-3">
          <Link href="/" className="inline-block focus:outline-none">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto transition-transform hover:scale-105">
              <img src="/assets/logo.png" alt="Starry Health" className="object-contain" />
            </div>
          </Link>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            {mode === "login" ? "Espace de Connexion" : "Créer un Compte"}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {mode === "login"
              ? "Accédez à votre tableau de bord et gérez vos produits"
              : "Rejoignez Starry Health et lancez votre vitrine santé"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "login"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            Se connecter
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${mode === "register"
              ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
          >
            S'inscrire
          </button>
        </div>

        {/* Notifications */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-500/30 text-red-700 dark:text-red-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{success}</span>
          </div>
        )}

        {/* Formulaire Connexion */}
        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email ou Identifiant (Tenant)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="nom d'utilisateur ou email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showLoginPassword ? "text" : "password"}
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  title={showLoginPassword ? "Masquer" : "Afficher"}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? "Connexion en cours..." : "Se connecter"} <LogIn className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Formulaire Inscription */
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="Dr. Jean Pierre"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Adresse email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="jean.dupont@exemple.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Identifiant Tenant / Sous-domaine <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <AtSign className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => handleUsernameChange(e.target.value)}
                  placeholder="clinique-goma"
                  required
                  className={`w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 transition-all ${usernameStatus === "available"
                    ? "border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/10"
                    : usernameStatus === "taken" || usernameStatus === "invalid"
                      ? "border-red-400 focus:border-red-400 focus:ring-red-400/10"
                      : "border-slate-200 dark:border-slate-800 focus:border-emerald-500 focus:ring-emerald-500/10"
                    }`}
                />
                <div className="absolute right-3.5 top-3.5">
                  {usernameStatus === "checking" && (
                    <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  )}
                  {(usernameStatus === "taken" || usernameStatus === "invalid") && (
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                  )}
                </div>
              </div>

              {/* Status message */}
              {usernameStatus === "available" && (
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Disponible ! Votre vitrine : <span className="font-mono font-bold">{regUsername}.sboxx.site</span>
                </p>
              )}
              {(usernameStatus === "taken" || usernameStatus === "invalid") && usernameError && (
                <p className="text-[11px] text-red-500 mt-1">{usernameError}</p>
              )}
              {usernameSuggestions.length > 0 && (
                <div className="mt-1.5 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-slate-500">Suggestions :</span>
                  {usernameSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => handleUsernameChange(s)}
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
              {usernameStatus === "idle" && !usernameError && (
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                  Lettres minuscules, chiffres et tirets uniquement. Ex: clinique-goma, pharma24 (5-30 caractères)
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Min. 8 caractères"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegPassword(!showRegPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  title={showRegPassword ? "Masquer" : "Afficher"}
                >
                  {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                <input
                  type={showRegConfirmPassword ? "text" : "password"}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Répétez le mot de passe"
                  required
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 focus:outline-none"
                  title={showRegConfirmPassword ? "Masquer" : "Afficher"}
                >
                  {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-white bg-emerald-700 hover:bg-emerald-600 shadow-sm text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? "Création en cours..." : "Créer mon compte"} <UserPlus className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* Séparateur */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-[10px] text-slate-400 uppercase font-semibold">
            Ou continuer avec
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Bouton Google OAuth */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={googleLoading}
          className="w-full py-2.5 rounded-xl font-semibold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors flex items-center justify-center gap-2.5 disabled:opacity-50"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        {/* Switch Link */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-400">
          {mode === "login" ? (
            <>
              Pas encore de compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Créer un compte gratuitement
              </button>
            </>
          ) : (
            <>
              Vous avez déjà un compte ?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Se connecter
              </button>
            </>
          )}
        </p>

      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-slate-400">Chargement...</div>}>
      <AuthComponent />
    </Suspense>
  );
}
