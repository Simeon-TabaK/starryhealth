"use client";

import { useState, useMemo } from "react";
import {
  Building,
  Search,
  Check,
  X,
  Ban,
  RefreshCw,
  Eye,
  Globe,
  User,
  Package,
  Calendar,
  ShieldCheck,
  ShieldX,
  Clock,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  AlertTriangle,
  ExternalLink,
} from "lucide-react";
import {
  adminValidateTenant,
  adminSuspendTenant,
  adminReactivateTenant,
  adminRejectTenant,
} from "@/app/dashboard/admin-actions";

interface TenantRecord {
  id: number;
  name: string | null;
  email: string;
  username: string | null;
  slug: string;
  role: string;
  subscriptionStatus: string;
  subscriptionPlan: string | null;
  avatar: string | null;
  createdAt: string | Date;
  subscriptions: any[];
  tenantConfig: {
    id: number;
    orgName: string | null;
    orgDescription: string | null;
    orgLogo: string | null;
    favicon: string | null;
    status: string;
    validatedAt: string | Date | null;
    rejectionReason: string | null;
  } | null;
  products: any[];
}

interface AdminTenantManagementProps {
  adminId: number;
  users: TenantRecord[];
  onNotify: (msg: string, type?: "success" | "error") => void;
}

const TENANT_STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  REJECTED: "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400",
};

const TENANT_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  ACTIVE: "Actif",
  SUSPENDED: "Suspendu",
  REJECTED: "Rejeté",
};

const PLAN_ICONS: Record<string, React.ReactNode> = {
  STANDARD: <Package className="w-4 h-4 text-blue-500" />,
  SMART: <Zap className="w-4 h-4 text-purple-500" />,
  PREMIUM: <Crown className="w-4 h-4 text-amber-500" />,
};

const TENANTS_PER_PAGE = 10;

export function AdminTenantManagement({ adminId, users: initialUsers, onNotify }: AdminTenantManagementProps) {
  const [users, setUsers] = useState<TenantRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedTenant, setSelectedTenant] = useState<TenantRecord | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [saving, setSaving] = useState(false);

  // Only users with tenantConfig
  const tenants = users.filter((u) => u.role !== "SUPER_ADMIN");

  const filtered = useMemo(() => {
    return tenants.filter((u) => {
      const q = search.toLowerCase();
      const tenantStatus = u.tenantConfig?.status || "ACTIVE";
      const matchSearch =
        !q ||
        (u.name?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q) ||
        (u.username?.toLowerCase().includes(q) ?? false) ||
        (u.tenantConfig?.orgName?.toLowerCase().includes(q) ?? false);
      const matchStatus = filterStatus === "ALL" || tenantStatus === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [tenants, search, filterStatus]);

  const totalPages = Math.ceil(filtered.length / TENANTS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * TENANTS_PER_PAGE, page * TENANTS_PER_PAGE);

  // Stats
  const stats = useMemo(() => ({
    total: tenants.length,
    active: tenants.filter((u) => (u.tenantConfig?.status || "ACTIVE") === "ACTIVE").length,
    pending: tenants.filter((u) => u.tenantConfig?.status === "PENDING").length,
    suspended: tenants.filter((u) => u.tenantConfig?.status === "SUSPENDED").length,
    rejected: tenants.filter((u) => u.tenantConfig?.status === "REJECTED").length,
  }), [tenants]);

  const updateTenantStatus = (userId: number, status: string, extra?: Partial<TenantRecord["tenantConfig"]>) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              tenantConfig: u.tenantConfig
                ? { ...u.tenantConfig, status, ...extra }
                : null,
            }
          : u
      )
    );
    if (selectedTenant?.id === userId) {
      setSelectedTenant((t) =>
        t
          ? {
              ...t,
              tenantConfig: t.tenantConfig
                ? { ...t.tenantConfig, status, ...extra }
                : null,
            }
          : null
      );
    }
  };

  const handleValidate = async (user: TenantRecord) => {
    if (!user.tenantConfig) return;
    setSaving(true);
    try {
      await adminValidateTenant(adminId, user.id);
      updateTenantStatus(user.id, "ACTIVE", { validatedAt: new Date().toISOString() });
      onNotify("Tenant validé et activé !");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleSuspend = async (user: TenantRecord) => {
    if (!confirm(`Suspendre le tenant de ${user.name || user.email} ?`)) return;
    setSaving(true);
    try {
      await adminSuspendTenant(adminId, user.id);
      updateTenantStatus(user.id, "SUSPENDED");
      onNotify("Tenant suspendu.");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReactivate = async (user: TenantRecord) => {
    setSaving(true);
    try {
      await adminReactivateTenant(adminId, user.id);
      updateTenantStatus(user.id, "ACTIVE", { validatedAt: new Date().toISOString() });
      onNotify("Tenant réactivé !");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleReject = async () => {
    if (!selectedTenant?.tenantConfig) return;
    if (!rejectReason.trim()) { onNotify("Veuillez indiquer une raison de rejet.", "error"); return; }
    setSaving(true);
    try {
      await adminRejectTenant(adminId, selectedTenant.id, rejectReason);
      updateTenantStatus(selectedTenant.id, "REJECTED", { rejectionReason: rejectReason });
      setShowRejectModal(false);
      setRejectReason("");
      onNotify("Tenant rejeté.");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (d: string | Date | null | undefined) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getTenantStatus = (u: TenantRecord) => u.tenantConfig?.status || "ACTIVE";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gestion des Tenants</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Validez, suspendez ou rejetez les tenants (espaces utilisateurs).</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-800 dark:text-slate-100" },
          { label: "Actifs", value: stats.active, color: "text-emerald-600" },
          { label: "En attente", value: stats.pending, color: "text-amber-600" },
          { label: "Suspendus", value: stats.suspended, color: "text-red-500" },
          { label: "Rejetés", value: stats.rejected, color: "text-slate-400" },
        ].map((s) => (
          <div key={s.label} className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700 text-center">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Rechercher par nom, organisation, email..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
        >
          <option value="ALL">Tous les statuts</option>
          {Object.entries(TENANT_STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Tenant / Propriétaire</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Produits</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Créé le</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Building className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucun tenant trouvé.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((user) => {
                  const tenantStatus = getTenantStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {user.tenantConfig?.orgLogo ? (
                            <img src={user.tenantConfig.orgLogo} alt="" className="w-8 h-8 rounded object-contain flex-shrink-0 border border-slate-200" />
                          ) : (
                            <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                              <Building className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-100">
                              {user.tenantConfig?.orgName || user.name || "—"}
                            </p>
                            <p className="text-xs text-slate-400">
                              @{user.username || user.slug} · {user.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {user.subscriptionPlan ? (
                          <div className="flex items-center gap-1.5">
                            {PLAN_ICONS[user.subscriptionPlan]}
                            <span className="text-slate-600 dark:text-slate-300">{user.subscriptionPlan}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${TENANT_STATUS_STYLES[tenantStatus] || TENANT_STATUS_STYLES.ACTIVE}`}>
                          {TENANT_STATUS_LABELS[tenantStatus] || tenantStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                        {user.products?.length ?? 0}
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedTenant(user)}
                            className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                            title="Voir détails"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {tenantStatus === "PENDING" && (
                            <button
                              onClick={() => handleValidate(user)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                              title="Valider"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          {(tenantStatus === "ACTIVE" || tenantStatus === "PENDING") && (
                            <button
                              onClick={() => handleSuspend(user)}
                              className="p-1.5 text-slate-400 hover:text-amber-600 rounded"
                              title="Suspendre"
                            >
                              <Ban className="w-4 h-4" />
                            </button>
                          )}
                          {(tenantStatus === "SUSPENDED" || tenantStatus === "REJECTED") && (
                            <button
                              onClick={() => handleReactivate(user)}
                              className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                              title="Réactiver"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                          {tenantStatus !== "REJECTED" && (
                            <button
                              onClick={() => { setSelectedTenant(user); setShowRejectModal(true); }}
                              className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                              title="Rejeter"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              {filtered.length} tenant{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">{page} / {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Panel */}
      {selectedTenant && !showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Détails du Tenant</h3>
              <button onClick={() => setSelectedTenant(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Logo + Org */}
              <div className="flex items-center gap-4">
                {selectedTenant.tenantConfig?.orgLogo ? (
                  <img src={selectedTenant.tenantConfig.orgLogo} alt="" className="w-16 h-16 rounded-lg object-contain border border-slate-200 bg-white p-1" />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <Building className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">
                    {selectedTenant.tenantConfig?.orgName || "Organisation sans nom"}
                  </p>
                  <a
                    href={`/${selectedTenant.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-emerald-600 hover:underline flex items-center gap-1"
                  >
                    /{selectedTenant.slug} <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Tenant Status */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Statut du tenant</p>
                  <span className={`text-sm px-2 py-0.5 rounded-full font-medium ${
                    TENANT_STATUS_STYLES[getTenantStatus(selectedTenant)] || TENANT_STATUS_STYLES.ACTIVE
                  }`}>
                    {TENANT_STATUS_LABELS[getTenantStatus(selectedTenant)] || getTenantStatus(selectedTenant)}
                  </span>
                </div>
                {selectedTenant.tenantConfig?.validatedAt && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Validé le</p>
                    <p className="text-sm text-slate-700 dark:text-slate-200">
                      {formatDate(selectedTenant.tenantConfig.validatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Rejection reason */}
              {selectedTenant.tenantConfig?.rejectionReason && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">Raison du rejet</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{selectedTenant.tenantConfig.rejectionReason}</p>
                </div>
              )}

              {/* Owner */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Propriétaire</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <User className="w-4 h-4 text-slate-400" /> {selectedTenant.name || "—"}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Globe className="w-4 h-4 text-slate-400" /> {selectedTenant.email}
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedTenant.tenantConfig?.orgDescription && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Description</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{selectedTenant.tenantConfig.orgDescription}</p>
                </div>
              )}

              {/* Stats */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activité</h4>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedTenant.products?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Produits</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedTenant.subscriptions?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Abonnements</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {selectedTenant.subscriptionPlan || "—"}
                    </p>
                    <p className="text-xs text-slate-500">Plan actif</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Inscrit le</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {formatDate(selectedTenant.createdAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                {getTenantStatus(selectedTenant) === "PENDING" && (
                  <button
                    onClick={() => handleValidate(selectedTenant)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
                  >
                    <ShieldCheck className="w-4 h-4" /> Valider le tenant
                  </button>
                )}
                {(getTenantStatus(selectedTenant) === "SUSPENDED" || getTenantStatus(selectedTenant) === "REJECTED") && (
                  <button
                    onClick={() => handleReactivate(selectedTenant)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
                  >
                    <RefreshCw className="w-4 h-4" /> Réactiver le tenant
                  </button>
                )}
                {getTenantStatus(selectedTenant) === "ACTIVE" && (
                  <button
                    onClick={() => handleSuspend(selectedTenant)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
                  >
                    <Ban className="w-4 h-4" /> Suspendre le tenant
                  </button>
                )}
                {getTenantStatus(selectedTenant) !== "REJECTED" && (
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={saving}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-60"
                  >
                    <ShieldX className="w-4 h-4" /> Rejeter le tenant
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedTenant && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Rejeter le tenant</h3>
              <button onClick={() => { setShowRejectModal(false); setRejectReason(""); }} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Cette action va rejeter le tenant de <strong>{selectedTenant.tenantConfig?.orgName || selectedTenant.name}</strong>.
                  L&apos;utilisateur en sera notifié.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Raison du rejet *
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                  placeholder="Expliquez la raison du rejet..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => { setShowRejectModal(false); setRejectReason(""); }}
                className="flex-1 px-4 py-2 text-sm text-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleReject}
                disabled={saving || !rejectReason.trim()}
                className="flex-1 px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium disabled:opacity-60 transition"
              >
                {saving ? "En cours..." : "Confirmer le rejet"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

