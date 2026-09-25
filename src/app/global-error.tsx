"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans p-6">
        <div className="max-w-md text-center space-y-4">
          <h2 className="text-2xl font-bold">Une erreur est survenue</h2>
          <p className="text-slate-400 text-sm">
            {error?.message || "Une erreur inattendue s'est produite."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded-lg text-white font-medium transition"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  );
}
