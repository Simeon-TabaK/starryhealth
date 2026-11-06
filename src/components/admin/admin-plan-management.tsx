"use client";

import { useState } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Crown,
  Star,
  Package,
  Save,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import {
  adminCreatePlanConfig,
  adminUpdatePlanConfig,
  adminDeletePlanConfig,
  adminTogglePlanActive,
} from "@/app/dashboard/admin-actions";

interface PlanConfig {
  id: number;
  name: string;
  displayName: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  monthlyPrice: number;
  quarterlyPrice: number | null;
  semiAnnualPrice: number | null;
  annualPrice: number | null;
  features: string[];
  limits: Record<string, unknown>;
  badge: string | null;
  color: string | null;
  icon: string | null;
}

interface AdminPlanManagementProps {
  adminId: number;
  plans: PlanConfig[];
  onNotify: (msg: string, type?: "success" | "error") => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Package: <Package className="w-5 h-5" />,
};

const DEFAULT_FEATURES = [
  "Catalogue produits",
  "Galerie d'images",
  "Carrousel",
  "Témoignages",
  "Partenaires",
  "Services personnalisés",
  "FAQ",
  "Nom de domaine personnalisé",
  "Champs produit avancés",
  "Catégories de produits",
  "Couleurs personnalisées",
  "Typographie personnalisée",
];

const EMPTY_PLAN = {
  name: "",
  displayName: "",
  description: "",
  monthlyPrice: 0,
  quarterlyPrice: "",
  semiAnnualPrice: "",
  annualPrice: "",
  features: [] as string[],
  limits: { maxProducts: -1 } as Record<string, unknown>,
  badge: "",
  color: "#0ea5e9",
  icon: "Shield",
  sortOrder: 0,
  isActive: true,
};

export function AdminPlanManagement({ adminId, plans: initialPlans, onNotify }: AdminPlanManagementProps) {
  const [plans, setPlans] = useState<PlanConfig[]>(initialPlans);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PlanConfig | null>(null);
  const [formData, setFormData] = useState(EMPTY_PLAN);
  const [featureInput, setFeatureInput] = useState("");
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const openCreate = () => {
    setFormData(EMPTY_PLAN);
    setShowCreateModal(true);
    setEditingPlan(null);
  };

  const openEdit = (plan: PlanConfig) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      displayName: plan.displayName,
      description: plan.description || "",
      monthlyPrice: plan.monthlyPrice,
      quarterlyPrice: plan.quarterlyPrice?.toString() || "",
      semiAnnualPrice: plan.semiAnnualPrice?.toString() || "",
      annualPrice: plan.annualPrice?.toString() || "",
      features: [...plan.features],
      limits: { ...plan.limits },
      badge: plan.badge || "",
      color: plan.color || "#0ea5e9",
      icon: plan.icon || "Shield",
      sortOrder: plan.sortOrder,
      isActive: plan.isActive,
    });
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingPlan(null);
    setFormData(EMPTY_PLAN);
    setFeatureInput("");
  };

  const addFeature = (feat: string) => {
    if (!feat.trim() || formData.features.includes(feat.trim())) return;
    setFormData((p) => ({ ...p, features: [...p.features, feat.trim()] }));
    setFeatureInput("");
  };

  const removeFeature = (feat: string) => {
    setFormData((p) => ({ ...p, features: p.features.filter((f) => f !== feat) }));
  };

  const handleSave = async () => {
    if (!formData.name.trim() || !formData.displayName.trim()) {
      onNotify("Nom du plan obligatoire.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        displayName: formData.displayName,
        description: formData.description || undefined,
        monthlyPrice: Number(formData.monthlyPrice),
        quarterlyPrice: formData.quarterlyPrice ? Number(formData.quarterlyPrice) : undefined,
        semiAnnualPrice: formData.semiAnnualPrice ? Number(formData.semiAnnualPrice) : undefined,
        annualPrice: formData.annualPrice ? Number(formData.annualPrice) : undefined,
        features: formData.features,
        limits: formData.limits,
        badge: formData.badge || undefined,
        color: formData.color || undefined,
        icon: formData.icon || undefined,
        sortOrder: formData.sortOrder,
        isActive: formData.isActive,
      };

      if (editingPlan) {
        const res = await adminUpdatePlanConfig(adminId, editingPlan.id, payload);
        setPlans((prev) => prev.map((p) => (p.id === editingPlan.id ? { ...p, ...res.plan } as any : p)));
        onNotify("Plan mis à jour avec succès !");
      } else {
        const res = await adminCreatePlanConfig(adminId, payload);
        setPlans((prev) => [...prev, res.plan as any]);
        onNotify("Plan créé avec succès !");
      }
      closeModal();
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de la sauvegarde.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (plan: PlanConfig) => {
    try {
      await adminTogglePlanActive(adminId, plan.id, !plan.isActive);
      setPlans((prev) => prev.map((p) => (p.id === plan.id ? { ...p, isActive: !p.isActive } : p)));
      onNotify(plan.isActive ? "Plan désactivé." : "Plan activé !");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    }
  };

  const handleDelete = async (plan: PlanConfig) => {
    if (!confirm(`Supprimer définitivement le plan "${plan.displayName}" ?`)) return;
    setDeletingId(plan.id);
    try {
      await adminDeletePlanConfig(adminId, plan.id);
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
      onNotify("Plan supprimé.");
    } catch (err: any) {
      onNotify(err.message || "Erreur de suppression.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  const sorted = [...plans].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gestion des Plans</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Créez et gérez les formules d&apos;abonnement disponibles pour vos utilisateurs.
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nouveau plan
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Plans créés</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{plans.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Plans actifs</p>
          <p className="text-2xl font-bold text-emerald-600">{plans.filter((p) => p.isActive).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
          <p className="text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Plans désactivés</p>
          <p className="text-2xl font-bold text-slate-400">{plans.filter((p) => !p.isActive).length}</p>
        </div>
      </div>

      {/* Plan Cards */}
      {sorted.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 dark:text-slate-400">Aucun plan configuré.</p>
          <button
            onClick={openCreate}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 transition"
          >
            Créer le premier plan
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white dark:bg-slate-800 rounded-xl border transition-all ${
                plan.isActive
                  ? "border-slate-200 dark:border-slate-700"
                  : "border-slate-200 dark:border-slate-700 opacity-60"
              }`}
            >
              {/* Plan Header */}
              <div className="flex items-center gap-4 p-4">
                {/* Color Dot + Icon */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{ backgroundColor: plan.color || "#64748b" }}
                >
                  {ICON_MAP[plan.icon || ""] || <Package className="w-5 h-5" />}
                </div>

                {/* Name + badge */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800 dark:text-slate-100">{plan.displayName}</span>
                    <span className="text-xs font-mono text-slate-400 bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                        {plan.badge}
                      </span>
                    )}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        plan.isActive
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {plan.isActive ? "Actif" : "Désactivé"}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {plan.description || "Pas de description"}
                  </p>
                </div>

                {/* Price */}
                <div className="text-right flex-shrink-0">
                  <div className="font-bold text-slate-800 dark:text-slate-100">
                    {plan.monthlyPrice === 0 ? "Gratuit" : `$${plan.monthlyPrice.toFixed(2)}/mois`}
                  </div>
                  {plan.annualPrice && (
                    <div className="text-xs text-slate-500">${plan.annualPrice.toFixed(2)}/an</div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => setExpandedPlan(expandedPlan === plan.id ? null : plan.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded"
                    title="Voir détails"
                  >
                    {expandedPlan === plan.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEdit(plan)}
                    className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(plan)}
                    className={`p-1.5 rounded ${
                      plan.isActive
                        ? "text-slate-400 hover:text-amber-600"
                        : "text-slate-400 hover:text-emerald-600"
                    }`}
                    title={plan.isActive ? "Désactiver" : "Activer"}
                  >
                    {plan.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(plan)}
                    disabled={deletingId === plan.id}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded disabled:opacity-50"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedPlan === plan.id && (
                <div className="px-4 pb-4 border-t border-slate-100 dark:border-slate-700 pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Pricing */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Tarification</h4>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Mensuel</span>
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {plan.monthlyPrice === 0 ? "Gratuit" : `$${plan.monthlyPrice.toFixed(2)}`}
                          </span>
                        </div>
                        {plan.quarterlyPrice && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Trimestriel</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">${plan.quarterlyPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {plan.semiAnnualPrice && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Semi-annuel</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">${plan.semiAnnualPrice.toFixed(2)}</span>
                          </div>
                        )}
                        {plan.annualPrice && (
                          <div className="flex justify-between">
                            <span className="text-slate-500">Annuel</span>
                            <span className="font-medium text-slate-800 dark:text-slate-200">${plan.annualPrice.toFixed(2)}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                        Fonctionnalités ({plan.features.length})
                      </h4>
                      <div className="space-y-1">
                        {plan.features.length === 0 ? (
                          <p className="text-sm text-slate-400">Aucune fonctionnalité définie.</p>
                        ) : (
                          plan.features.map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                              <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                              {f}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {editingPlan ? "Modifier le plan" : "Créer un plan"}
              </h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Identifiant *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value.toUpperCase() }))}
                    disabled={!!editingPlan}
                    placeholder="STANDARD"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 font-mono text-sm disabled:opacity-60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Nom affiché *
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData((p) => ({ ...p, displayName: e.target.value }))}
                    placeholder="Standard"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm resize-none"
                />
              </div>

              {/* Visual */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Couleur</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                      className="w-10 h-10 rounded cursor-pointer border border-slate-300"
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData((p) => ({ ...p, color: e.target.value }))}
                      className="flex-1 px-2 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Icône</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData((p) => ({ ...p, icon: e.target.value }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                  >
                    {Object.keys(ICON_MAP).map((k) => (
                      <option key={k} value={k}>{k}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
                    placeholder="Populaire"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" /> Tarification ($)
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "monthlyPrice", label: "Mensuel *", type: "number" },
                    { key: "quarterlyPrice", label: "Trimestriel", type: "number" },
                    { key: "semiAnnualPrice", label: "Semi-annuel", type: "number" },
                    { key: "annualPrice", label: "Annuel", type: "number" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-xs text-slate-500 mb-1">{label}</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={(formData as any)[key]}
                        onChange={(e) => setFormData((p) => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Ordre d'affichage</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData((p) => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                  />
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData((p) => ({ ...p, isActive: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Plan actif</span>
                  </label>
                </div>
              </div>

              {/* Features */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Fonctionnalités incluses</h4>

                {/* Quick add from suggestions */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {DEFAULT_FEATURES.filter((f) => !formData.features.includes(f)).map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => addFeature(f)}
                      className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-700 transition"
                    >
                      + {f}
                    </button>
                  ))}
                </div>

                {/* Custom feature input */}
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addFeature(featureInput))}
                    placeholder="Fonctionnalité personnalisée..."
                    className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addFeature(featureInput)}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Selected features */}
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {formData.features.map((f) => (
                    <div key={f} className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-600 dark:text-slate-300">{f}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFeature(f)}
                        className="text-slate-300 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-sm text-slate-400">Aucune fonctionnalité sélectionnée.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-800 transition"
              >
                Annuler
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {editingPlan ? "Enregistrer" : "Créer le plan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

