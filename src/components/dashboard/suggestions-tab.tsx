"use client";

import React, { useState } from "react";
import { MessageSquarePlus, Send, CheckCircle2 } from "lucide-react";

interface SuggestionsTabProps {
  user: any;
  isSuperAdmin: boolean;
  adminSuggestions?: any[];
  suggestions?: any[];
  onNotify: (msg: string, type?: "success" | "error") => void;
  onSendAdminSuggestion: (formData: FormData) => Promise<any>;
  onToggleAdminSuggestionRead: (id: number, currentRead: boolean) => Promise<any>;
  onDeleteAdminSuggestion: (id: number) => Promise<any>;
  onUpdateAdminSuggestionStatus: (
    id: number,
    status: "NEW" | "IN_PROGRESS" | "DONE" | "REJECTED",
    reply?: string
  ) => Promise<any>;
}

export function SuggestionsTab({
  user,
  isSuperAdmin,
  adminSuggestions = [],
  suggestions = [],
  onNotify,
  onSendAdminSuggestion,
  onToggleAdminSuggestionRead,
  onDeleteAdminSuggestion,
  onUpdateAdminSuggestionStatus,
}: SuggestionsTabProps) {
  const [suggestionFilters, setSuggestionFilters] = useState<string>("ALL");
  const [suggestionReplies, setSuggestionReplies] = useState<Record<number, string>>({});
  const [suggestionStatuses, setSuggestionStatuses] = useState<Record<number, string>>({});
  const [saving, setSaving] = useState(false);

  const handleSendSuggestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    try {
      await onSendAdminSuggestion(formData);
      onNotify("Votre suggestion a été transmise à l'administrateur Starry Health !");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de l'envoi.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleRead = async (id: number, currentRead: boolean) => {
    try {
      await onToggleAdminSuggestionRead(id, currentRead);
      onNotify(!currentRead ? "Marqué comme lu !" : "Marqué comme non lu !");
    } catch {
      onNotify("Erreur de mise à jour.", "error");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cette suggestion ?")) return;
    try {
      await onDeleteAdminSuggestion(id);
      onNotify("Suggestion supprimée !");
    } catch {
      onNotify("Erreur de suppression.", "error");
    }
  };

  const handleSaveStatus = async (id: number) => {
    const status = (suggestionStatuses[id] || "IN_PROGRESS") as "NEW" | "IN_PROGRESS" | "DONE" | "REJECTED";
    const reply = suggestionReplies[id] || undefined;
    setSaving(true);
    try {
      await onUpdateAdminSuggestionStatus(id, status, reply);
      onNotify("Suggestion mise à jour avec succès !");
    } catch (err: any) {
      onNotify(err.message || "Erreur de mise à jour.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {isSuperAdmin ? (
        /* SUPER ADMIN: Suggestions reçues des abonnés */
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquarePlus className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Boîte à Suggestions des Abonnés ({adminSuggestions.length})
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Visualisez, filtrez, répondez et gérez l'état de chaque suggestion (Nouveau, En cours, Traité, Rejeté).
              </p>
            </div>

            {/* Filtres de statut */}
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shrink-0 overflow-x-auto text-[11px] font-bold">
              {["ALL", "NEW", "IN_PROGRESS", "DONE", "REJECTED"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setSuggestionFilters(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${suggestionFilters === f
                    ? "bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    }`}
                >
                  {f === "ALL" && "Toutes"}
                  {f === "NEW" && "Nouveau"}
                  {f === "IN_PROGRESS" && "En cours"}
                  {f === "DONE" && "Traité"}
                  {f === "REJECTED" && "Rejeté"}
                </button>
              ))}
            </div>
          </div>

          {adminSuggestions.filter((s: any) => suggestionFilters === "ALL" || (s.status || "NEW") === suggestionFilters).length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 text-sm">
              Aucune suggestion ne correspond à ce filtre.
            </div>
          ) : (
            <div className="space-y-4">
              {adminSuggestions
                .filter((s: any) => suggestionFilters === "ALL" || (s.status || "NEW") === suggestionFilters)
                .map((asug: any) => {
                  const currentStatus = suggestionStatuses[asug.id] !== undefined ? suggestionStatuses[asug.id] : (asug.status || "NEW");
                  const currentReply = suggestionReplies[asug.id] !== undefined ? suggestionReplies[asug.id] : (asug.adminReply || "");

                  return (
                    <div
                      key={asug.id}
                      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-bold text-sm text-slate-900 dark:text-white">
                            {asug.subject}
                          </span>
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${currentStatus === "NEW"
                              ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                              : currentStatus === "IN_PROGRESS"
                                ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                                : currentStatus === "DONE"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                              }`}
                          >
                            {currentStatus === "NEW" ? "Nouveau" : currentStatus === "IN_PROGRESS" ? "En cours" : currentStatus === "DONE" ? "Traité" : "Rejeté"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span>
                            Abonné : <strong>{asug.user?.name || asug.user?.email}</strong> ({asug.user?.slug})
                          </span>
                          <span>{new Date(asug.createdAt).toLocaleDateString("fr-FR")}</span>
                        </div>
                      </div>

                      <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                        {asug.message}
                      </div>

                      {/* Admin Management Row: Status Select + Reply Textarea */}
                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="text-[11px] font-semibold block mb-1 text-slate-600 dark:text-slate-400">
                              Changer le statut
                            </label>
                            <select
                              value={currentStatus}
                              onChange={(e) => setSuggestionStatuses(prev => ({ ...prev, [asug.id]: e.target.value }))}
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                              <option value="NEW">Nouveau</option>
                              <option value="IN_PROGRESS">En cours</option>
                              <option value="DONE">Traité</option>
                              <option value="REJECTED">Rejeté</option>
                            </select>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="text-[11px] font-semibold block mb-1 text-slate-600 dark:text-slate-400">
                              Réponse / Note de l'administrateur
                            </label>
                            <input
                              type="text"
                              value={currentReply}
                              onChange={(e) => setSuggestionReplies(prev => ({ ...prev, [asug.id]: e.target.value }))}
                              placeholder="Écrivez une réponse destinée à l'utilisateur..."
                              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleRead(asug.id, asug.isRead)}
                            className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {asug.isRead ? "Marquer non lu" : "Marquer lu"}
                          </button>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleDelete(asug.id)}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                            >
                              Supprimer
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveStatus(asug.id)}
                              disabled={saving}
                              className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all cursor-pointer"
                            >
                              {saving ? "Enregistrement..." : "Enregistrer le statut & réponse"}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      ) : (
        /* SUBSCRIBER: Send suggestion to Starry Health Admin + History + Visitor suggestions */
        <div className="space-y-8">
          {/* Formulaire : Soumettre une suggestion */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <Send className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Soumettre une idée d'amélioration
                </h2>
                <p className="text-xs text-slate-500">
                  Proposez une fonctionnalité ou une amélioration directement à l'équipe Starry Health.
                </p>
              </div>
            </div>

            <form onSubmit={handleSendSuggestion} className="space-y-4 max-w-2xl">
              <div>
                <label className="text-xs font-semibold block mb-1">Titre de votre suggestion</label>
                <input
                  required
                  type="text"
                  name="subject"
                  placeholder="Ex: Demande de nouveau produit, paiement mobile..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Votre message détaillé</label>
                <textarea
                  required
                  name="message"
                  rows={3}
                  placeholder="Décrivez votre proposition ou besoin en quelques lignes..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Send className="w-4 h-4" /> {saving ? "Envoi..." : "Envoyer ma suggestion"}
              </button>
            </form>
          </div>

          {/* Historique de mes suggestions envoyées à l'admin */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Historique de mes suggestions ({adminSuggestions.length})
            </h3>
            {adminSuggestions.length === 0 ? (
              <p className="text-xs text-slate-400">Vous n'avez pas encore soumis de suggestion.</p>
            ) : (
              <div className="space-y-3">
                {adminSuggestions.map((sug: any) => {
                  const st = sug.status || "NEW";
                  return (
                    <div key={sug.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-sm">{sug.subject}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${st === "NEW"
                            ? "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
                            : st === "IN_PROGRESS"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                              : st === "DONE"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300"
                            }`}
                        >
                          {st === "NEW" ? "Nouveau" : st === "IN_PROGRESS" ? "En cours" : st === "DONE" ? "Traité" : "Rejeté"}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300">{sug.message}</p>
                      {sug.adminReply && (
                        <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-900 dark:text-emerald-200 text-[11px]">
                          <span className="font-bold block mb-0.5">Réponse de l'administrateur :</span>
                          {sug.adminReply}
                        </div>
                      )}
                      <div className="text-[10px] text-slate-400">
                        Envoyé le {new Date(sug.createdAt).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Suggestions reçues des visiteurs de sa propre vitrine */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Messages des Visiteurs de ma vitrine ({suggestions.length})
            </h3>
            {suggestions.length === 0 ? (
              <p className="text-xs text-slate-400">Aucun message de visiteur pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {suggestions.map((sug: any) => (
                  <div key={sug.id} className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 text-xs">
                    <div className="flex justify-between font-bold mb-1">
                      <span>{sug.authorName || "Visiteur"} {sug.email && `(${sug.email})`}</span>
                      <span className="text-slate-400 font-normal">{new Date(sug.createdAt).toLocaleDateString("fr-FR")}</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{sug.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

