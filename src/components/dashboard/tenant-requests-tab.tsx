"use client";

import React, { useState } from "react";
import { Globe, Send } from "lucide-react";

interface TenantRequestsTabProps {
  user: any;
  isSuperAdmin: boolean;
  tenantChangeRequests?: any[];
  onNotify: (msg: string, type?: "success" | "error") => void;
  onRequestUsernameChange: (newUsername: string) => Promise<any>;
  onApproveUsernameChange: (requestId: number) => Promise<any>;
  onRejectUsernameChange: (requestId: number, note?: string) => Promise<any>;
}

export function TenantRequestsTab({
  user,
  isSuperAdmin,
  tenantChangeRequests = [],
  onNotify,
  onRequestUsernameChange,
  onApproveUsernameChange,
  onRejectUsernameChange,
}: TenantRequestsTabProps) {
  const [saving, setSaving] = useState(false);

  const handleRequestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const newUsername = formData.get("newUsername") as string;
    try {
      await onRequestUsernameChange(newUsername);
      onNotify("Demande de changement de tenant transmise à l'administrateur !");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de la demande.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (!confirm("Voulez-vous approuver ce changement de tenant ?")) return;
    setSaving(true);
    try {
      await onApproveUsernameChange(requestId);
      onNotify("Changement de tenant approuvé avec succès !");
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de l'approbation.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async (requestId: number) => {
    const note = prompt("Motif du rejet (optionnel) :") || undefined;
    setSaving(true);
    try {
      await onRejectUsernameChange(requestId, note);
      onNotify("Demande de changement de tenant rejetée.");
    } catch (err: any) {
      onNotify(err.message || "Erreur lors du rejet.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {isSuperAdmin ? (
        <>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Demandes de Changement de Tenant / Username
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Validez ou rejetez les demandes de modification de nom de domaine / tenant soumises par les distributeurs.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Liste des demandes ({tenantChangeRequests.length})
              </h3>
            </div>

            {tenantChangeRequests.length === 0 ? (
              <div className="p-12 text-center text-slate-400">
                <Globe className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">Aucune demande de changement de tenant enregistrée.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-4">Utilisateur</th>
                      <th className="p-4">Ancien Tenant (Username)</th>
                      <th className="p-4">Nouveau Tenant Demandé</th>
                      <th className="p-4">Date de la demande</th>
                      <th className="p-4">Statut</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tenantChangeRequests.map((req: any) => (
                      <tr key={req.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {req.user?.name || req.user?.email}
                          <span className="block text-[11px] font-normal text-slate-400 font-mono">
                            {req.user?.email}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-semibold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                            {req.oldUsername}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
                            {req.newUsername}
                          </span>
                        </td>
                        <td className="p-4 text-slate-500">
                          {new Date(req.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === "APPROVED"
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : req.status === "REJECTED"
                              ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                            }`}>
                            {req.status === "APPROVED" ? "Approuvé" : req.status === "REJECTED" ? "Rejeté" : "En attente"}
                          </span>
                          {req.adminNote && (
                            <span className="block text-[10px] text-slate-400 mt-1 italic">
                              Note: {req.adminNote}
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right space-x-2">
                          {req.status === "PENDING" ? (
                            <>
                              <button
                                onClick={() => handleApprove(req.id)}
                                disabled={saving}
                                className="px-3 py-1.5 rounded-lg font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors text-[11px] cursor-pointer"
                              >
                                Approuver
                              </button>
                              <button
                                onClick={() => handleReject(req.id)}
                                disabled={saving}
                                className="px-3 py-1.5 rounded-lg font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-sm transition-colors text-[11px] cursor-pointer"
                              >
                                Rejeter
                              </button>
                            </>
                          ) : (
                            <span className="text-slate-400 text-[11px] italic">Traité</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : (
        /* User view */
        <>
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Gestion de mon Tenant (Identifiant de vitrine)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Votre nom d'utilisateur (username) définit l'adresse unique de votre vitrine en ligne.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Tenant Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Tenant Actuel</h3>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <p className="text-xs text-slate-400 mb-1">Identifiant unique</p>
                <p className="text-lg font-extrabold font-mono text-emerald-600">
                  @{user.username || user.slug}
                </p>
                <p className="text-xs text-slate-500 mt-2">Lien vers votre vitrine :</p>
                <a
                  href={`/?tenant=${user.slug}`}
                  target="_blank"
                  className="text-xs text-emerald-600 font-semibold hover:underline font-mono block mt-0.5"
                >
                  {user.slug}.sboxx.site
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs text-amber-800 dark:text-amber-300 space-y-1">
                <p className="font-bold">Important :</p>
                <p className="text-[11px] leading-relaxed">
                  Pour préserver la cohérence des liens et des données de vos clients, chaque changement de tenant doit être validé par l'administrateur avant d'être actif.
                </p>
              </div>
            </div>

            {/* Request Form */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-4">Demander un nouveau tenant</h3>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Nouveau nom d'utilisateur souhaité
                  </label>
                  <input
                    type="text"
                    name="newUsername"
                    placeholder="mon_nouveau_tenant"
                    required
                    pattern="^[a-z0-9_]{3,30}$"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-mono placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-1.5">
                    3 à 30 caractères : lettres minuscules, chiffres et tirets bas (_) uniquement.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-2.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {saving ? "Envoi en cours..." : "Soumettre la demande à l'administrateur"}
                </button>
              </form>
            </div>
          </div>

          {/* History of user requests */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-xs text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                Historique de vos demandes
              </h3>
            </div>

            {tenantChangeRequests.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Vous n'avez soumis aucune demande de changement de tenant.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tenantChangeRequests.map((req: any) => (
                  <div key={req.id} className="p-4 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-slate-900 dark:text-white">
                        {req.oldUsername} → {req.newUsername}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-0.5">
                        Demandé le {new Date(req.createdAt).toLocaleDateString("fr-FR")}
                      </span>
                      {req.adminNote && (
                        <span className="block text-[10px] text-rose-500 mt-0.5">
                          Note admin : {req.adminNote}
                        </span>
                      )}
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${req.status === "APPROVED"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
                      : req.status === "REJECTED"
                        ? "bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300"
                        : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                      }`}>
                      {req.status === "APPROVED" ? "Approuvé" : req.status === "REJECTED" ? "Rejeté" : "En attente"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

