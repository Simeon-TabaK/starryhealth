"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Crown,
  Lock,
  Sparkles,
  Info,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  ArrowUpDown,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  addUserService,
  updateUserService,
  deleteUserService,
} from "@/app/dashboard/actions";

export interface ServiceItem {
  id: number;
  userId?: number;
  name: string;
  url: string | null;
  order: number;
}

interface ServicesManagementProps {
  userId: number;
  isSuperAdmin: boolean;
  canManageServices: boolean;
  initialServices?: ServiceItem[];
  onNotify: (msg: string, type?: "success" | "error") => void;
  onUpgradeClick?: () => void;
}

export function ServicesManagement({
  userId,
  isSuperAdmin,
  canManageServices,
  initialServices = [],
  onNotify,
  onUpgradeClick,
}: ServicesManagementProps) {
  const router = useRouter();
  const [services, setServices] = useState<ServiceItem[]>(initialServices);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [order, setOrder] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    if (initialServices) {
      setServices(initialServices);
    }
  }, [initialServices]);

  // Open modal for new service
  const handleOpenCreate = () => {
    setEditingService(null);
    setName("");
    setUrl("");
    setOrder(services.length + 1);
    setShowModal(true);
  };

  // Open modal for editing
  const handleOpenEdit = (service: ServiceItem) => {
    setEditingService(service);
    setName(service.name);
    setUrl(service.url || "");
    setOrder(service.order || 0);
    setShowModal(true);
  };

  // Submit form (create or edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onNotify("Veuillez renseigner un titre pour le service ou l'offre.", "error");
      return;
    }

    setSubmitting(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("url", url.trim());
    formData.append("order", String(order || 0));

    try {
      if (editingService) {
        await updateUserService(editingService.id, userId, formData);
        setServices((prev) =>
          prev
            .map((s) =>
              s.id === editingService.id
                ? { ...s, name: name.trim(), url: url.trim() || null, order: Number(order) }
                : s
            )
            .sort((a, b) => a.order - b.order)
        );
        onNotify("Service / Offre mis à jour avec succès !", "success");
      } else {
        await addUserService(userId, formData);
        // Refresh page or router to get the new service ID
        router.refresh();
        onNotify("Nouvelle offre / service ajouté avec succès !", "success");
      }
      setShowModal(false);
    } catch (err: any) {
      console.error(err);
      onNotify(err.message || "Erreur lors de l'enregistrement.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Delete service
  const handleDelete = async (service: ServiceItem) => {
    if (!confirm(`Supprimer définitivement l'offre "${service.name}" ?`)) return;

    setDeletingId(service.id);
    try {
      await deleteUserService(service.id, userId);
      setServices((prev) => prev.filter((s) => s.id !== service.id));
      onNotify("Service / Offre supprimé avec succès.", "success");
      router.refresh();
    } catch (err: any) {
      console.error(err);
      onNotify(err.message || "Erreur lors de la suppression.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Nos Services & Offres Spéciales
              </h2>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                <Crown className="w-3 h-3" /> PREMIUM
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
              Présentez vos accompagnements, programmes, packs exclusifs ou séances de coaching sur votre vitrine distributeur.
            </p>
          </div>
        </div>

        {canManageServices && (
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Ajouter une Offre / Service
          </button>
        )}
      </div>

      {/* Information Banner on Vitrine Visibility */}
      <div className="p-4 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-800/50 flex items-start gap-3 text-xs text-sky-800 dark:text-sky-300 shadow-sm">
        <Info className="w-5 h-5 text-sky-600 dark:text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold">
            Visibilité automatique sur la vitrine publique :
          </p>
          <p className="text-sky-700 dark:text-sky-400">
            Par défaut, si cette liste est vide, la section <strong>"Nos Services & Offres Spéciales"</strong> reste complètement masquée pour les visiteurs de votre plateforme. Dès que vous enregistrez une offre, la section s'active automatiquement avec un design immersif.
          </p>
        </div>
      </div>

      {/* Access Control check */}
      {!canManageServices ? (
        <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-3xl">
          <Lock className="w-10 h-10 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Fonctionnalité réservée aux forfaits PREMIUM
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-5">
            Passez au forfait <strong>PREMIUM</strong> pour personnaliser la section "Nos Services & Offres Spéciales" de votre vitrine et promouvoir vos propres formules exclusives.
          </p>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-600/20 transition-all"
            >
              <Crown className="w-4 h-4" /> Passer à PREMIUM
            </button>
          )}
        </div>
      ) : services.length === 0 ? (
        /* Empty State */
        <div className="p-12 text-center bg-white dark:bg-slate-900 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
            <Layers className="w-8 h-8" />
          </div>
          <h3 className="font-bold text-base text-slate-900 dark:text-white">
            Aucun service ou offre pour le moment
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-6">
            Votre section est actuellement masquée sur votre vitrine. Créez votre première offre (ex: coaching bien-être, pack cure, bilan personnalisé) pour la rendre visible.
          </p>
          <button
            onClick={handleOpenCreate}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all"
          >
            <Plus className="w-4 h-4" /> Créer mon premier service / offre
          </button>
        </div>
      ) : (
        /* Services Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service, idx) => (
            <div
              key={service.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      Ordre #{service.order ?? idx + 1}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-2 leading-snug">
                  {service.name}
                </h3>

                <div className="mt-2 text-xs">
                  {service.url ? (
                    <a
                      href={service.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-medium break-all"
                    >
                      <span>Lien configuré</span>
                      <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  ) : (
                    <span className="text-slate-400 dark:text-slate-500 italic">
                      Sur demande (aucun lien externe)
                    </span>
                  )}
                </div>
              </div>

              {/* Card Footer / Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-1.5">
                <button
                  onClick={() => handleOpenEdit(service)}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Modifier"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-500" />
                  <span>Modifier</span>
                </button>
                <button
                  onClick={() => handleDelete(service)}
                  disabled={deletingId === service.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{deletingId === service.id ? "Suppression..." : "Supprimer"}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Service */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {editingService ? "Modifier l'Offre / Service" : "Ajouter une Offre ou Service"}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Configuration de l'élément pour votre vitrine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Intitulé de l'offre ou service <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Programme Détox 30 Jours, Coaching Nutritionnel 1h..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Le nom principal qui apparaîtra en titre sur la carte de votre vitrine.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Lien externe ou action (URL)
                </label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://wa.me/... ou https://calendly.com/... ou lien de commande"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Facultatif. Si laissé vide, la mention "Offre disponible sur demande" sera affichée.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Ordre d'affichage
                </label>
                <input
                  type="number"
                  min="0"
                  value={order}
                  onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Permet de hiérarchiser l'ordre d'apparition sur votre vitrine (du plus petit au plus grand).
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow-md shadow-emerald-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{submitting ? "Enregistrement..." : editingService ? "Mettre à jour" : "Créer l'offre"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

