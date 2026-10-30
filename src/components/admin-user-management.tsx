"use client";

import { useState, useMemo } from "react";
import {
  Users,
  Search,
  Filter,
  User,
  Shield,
  Ban,
  CheckCircle,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  Crown,
  Zap,
  Package,
  Clock,
  Calendar,
  Mail,
  Phone,
  Globe,
  CreditCard,
  History,
  X,
  AlertTriangle,
} from "lucide-react";
import {
  adminSuspendUser,
  adminActivateUser,
  adminDeleteUser,
} from "@/app/dashboard/admin-actions";
import { adminDirectAssignSubscription } from "@/app/dashboard/actions";

interface UserRecord {
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
  tenantConfig: any | null;
  products: any[];
  contactPhone?: string | null;
  contactEmail?: string | null;
}

interface AdminUserManagementProps {
  adminId: number;
  users: UserRecord[];
  onNotify: (msg: string, type?: "success" | "error") => void;
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  STANDARD: <Package className="w-4 h-4 text-blue-500" />,
  SMART: <Zap className="w-4 h-4 text-purple-500" />,
  PREMIUM: <Crown className="w-4 h-4 text-amber-500" />,
};

const STATUS_STYLES: Record<string, string> = {
  FREE: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300",
  ACTIVE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  PENDING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  EXPIRED: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  SUSPENDED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
  REFUSED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
};

const STATUS_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  ACTIVE: "Actif",
  PENDING: "En attente",
  EXPIRED: "Expiré",
  SUSPENDED: "Suspendu",
  REFUSED: "Refusé",
};

const PLAN_LABELS: Record<string, string> = {
  STANDARD: "Standard",
  SMART: "Smart",
  PREMIUM: "Premium",
};

const USERS_PER_PAGE = 12;

export function AdminUserManagement({ adminId, users: initialUsers, onNotify }: AdminUserManagementProps) {
  const [users, setUsers] = useState<UserRecord[]>(initialUsers);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPlan, setFilterPlan] = useState("ALL");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assignForm, setAssignForm] = useState<{
    plan: "STANDARD" | "SMART" | "PREMIUM";
    durationMonths: number;
    status: "ACTIVE" | "PENDING";
    adminNotes: string;
  }>({
    plan: "STANDARD",
    durationMonths: 1,
    status: "ACTIVE",
    adminNotes: "",
  });
  const [saving, setSaving] = useState(false);

  // Filtered + paginated users
  const nonAdminUsers = users.filter((u) => u.role !== "SUPER_ADMIN");

  const filtered = useMemo(() => {
    return nonAdminUsers.filter((u) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        (u.name?.toLowerCase().includes(q) ?? false) ||
        u.email.toLowerCase().includes(q) ||
        (u.username?.toLowerCase().includes(q) ?? false);
      const matchStatus = filterStatus === "ALL" || u.subscriptionStatus === filterStatus;
      const matchPlan = filterPlan === "ALL" || u.subscriptionPlan === filterPlan;
      return matchSearch && matchStatus && matchPlan;
    });
  }, [nonAdminUsers, search, filterStatus, filterPlan]);

  const totalPages = Math.ceil(filtered.length / USERS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * USERS_PER_PAGE, page * USERS_PER_PAGE);

  // Stats
  const stats = useMemo(() => ({
    total: nonAdminUsers.length,
    active: nonAdminUsers.filter((u) => u.subscriptionStatus === "ACTIVE").length,
    pending: nonAdminUsers.filter((u) => u.subscriptionStatus === "PENDING").length,
    suspended: nonAdminUsers.filter((u) => u.subscriptionStatus === "SUSPENDED").length,
    free: nonAdminUsers.filter((u) => u.subscriptionStatus === "FREE").length,
  }), [nonAdminUsers]);

  const handleSuspend = async (user: UserRecord) => {
    if (!confirm(`Suspendre l'utilisateur ${user.name || user.email} ?`)) return;
    setSaving(true);
    try {
      await adminSuspendUser(adminId, user.id);
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, subscriptionStatus: "SUSPENDED" } : u));
      if (selectedUser?.id === user.id) setSelectedUser((u) => u ? { ...u, subscriptionStatus: "SUSPENDED" } : null);
      onNotify("Utilisateur suspendu.");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleActivate = async (user: UserRecord) => {
    setSaving(true);
    try {
      await adminActivateUser(adminId, user.id);
      const newStatus = user.subscriptionPlan ? "ACTIVE" : "FREE";
      setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, subscriptionStatus: newStatus } : u));
      if (selectedUser?.id === user.id) setSelectedUser((u) => u ? { ...u, subscriptionStatus: newStatus } : null);
      onNotify("Utilisateur réactivé.");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: UserRecord) => {
    if (!confirm(`Supprimer définitivement ${user.name || user.email} ? Cette action est irréversible.`)) return;
    setSaving(true);
    try {
      await adminDeleteUser(adminId, user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      if (selectedUser?.id === user.id) setSelectedUser(null);
      onNotify("Utilisateur supprimé.");
    } catch (err: any) {
      onNotify(err.message || "Erreur.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleAssignSubscription = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await adminDirectAssignSubscription(
        adminId,
        selectedUser.id,
        assignForm.plan,
        assignForm.durationMonths,
        assignForm.status,
        assignForm.adminNotes
      );
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id
            ? { ...u, subscriptionPlan: assignForm.plan, subscriptionStatus: assignForm.status }
            : u
        )
      );
      setSelectedUser((u) =>
        u ? { ...u, subscriptionPlan: assignForm.plan, subscriptionStatus: assignForm.status } : null
      );
      setShowAssignModal(false);
      onNotify("Abonnement attribué avec succès !");
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gestion des Utilisateurs</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">Gérez les comptes utilisateurs et leurs abonnements.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-800 dark:text-slate-100" },
          { label: "Actifs", value: stats.active, color: "text-emerald-600" },
          { label: "En attente", value: stats.pending, color: "text-amber-600" },
          { label: "Suspendus", value: stats.suspended, color: "text-red-500" },
          { label: "Gratuits", value: stats.free, color: "text-slate-400" },
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
            placeholder="Rechercher par nom, email, username..."
            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
        >
          <option value="ALL">Tous les statuts</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          value={filterPlan}
          onChange={(e) => { setFilterPlan(e.target.value); setPage(1); }}
          className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm"
        >
          <option value="ALL">Tous les plans</option>
          <option value="STANDARD">Standard</option>
          <option value="SMART">Smart</option>
          <option value="PREMIUM">Premium</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Utilisateur</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Plan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Statut</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Produits</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Inscrit</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-slate-400">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-40" />
                    <p>Aucun utilisateur trouvé.</p>
                  </td>
                </tr>
              ) : (
                paginated.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.avatar ? (
                          <img src={user.avatar} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-100">{user.name || "—"}</p>
                          <p className="text-xs text-slate-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {user.subscriptionPlan ? (
                        <div className="flex items-center gap-1.5">
                          {PLAN_ICONS[user.subscriptionPlan]}
                          <span className="text-slate-700 dark:text-slate-200">{PLAN_LABELS[user.subscriptionPlan]}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[user.subscriptionStatus] || STATUS_STYLES.FREE}`}>
                        {STATUS_LABELS[user.subscriptionStatus] || user.subscriptionStatus}
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
                          onClick={() => setSelectedUser(user)}
                          className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded"
                          title="Voir détails"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {user.subscriptionStatus === "SUSPENDED" ? (
                          <button
                            onClick={() => handleActivate(user)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 rounded"
                            title="Réactiver"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleSuspend(user)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 rounded"
                            title="Suspendre"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(user)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-700">
            <p className="text-xs text-slate-500">
              {filtered.length} utilisateur{filtered.length > 1 ? "s" : ""}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-slate-600 dark:text-slate-300">
                {page} / {totalPages}
              </span>
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

      {/* User Detail Panel */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full overflow-y-auto shadow-2xl">
            {/* Panel header */}
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-6 py-4 flex items-center justify-between z-10">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Détails utilisateur</h3>
              <button onClick={() => setSelectedUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* User Avatar + Basic */}
              <div className="flex items-center gap-4">
                {selectedUser.avatar ? (
                  <img src={selectedUser.avatar} alt="" className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-semibold text-slate-800 dark:text-slate-100 text-lg">{selectedUser.name || "Sans nom"}</p>
                  <p className="text-sm text-slate-500">@{selectedUser.username || selectedUser.slug}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[selectedUser.subscriptionStatus] || ""}`}>
                    {STATUS_LABELS[selectedUser.subscriptionStatus] || selectedUser.subscriptionStatus}
                  </span>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Contact</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    {selectedUser.email}
                  </div>
                  {selectedUser.contactPhone && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {selectedUser.contactPhone}
                    </div>
                  )}
                  {selectedUser.tenantConfig?.orgName && (
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                      <Globe className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      {selectedUser.tenantConfig.orgName}
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Abonnement actif</h4>
                {selectedUser.subscriptionPlan ? (
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      {PLAN_ICONS[selectedUser.subscriptionPlan]}
                      <span className="font-medium text-slate-800 dark:text-slate-100">
                        {PLAN_LABELS[selectedUser.subscriptionPlan]}
                      </span>
                    </div>
                    {selectedUser.subscriptions?.[0] && (
                      <>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          Début : {formatDate(selectedUser.subscriptions[0].startDate)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          Expiration : {formatDate(selectedUser.subscriptions[0].expiresAt)}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">Pas d&apos;abonnement actif.</div>
                )}
              </div>

              {/* Stats */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Activité</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedUser.products?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Produits</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-center">
                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{selectedUser.subscriptions?.length ?? 0}</p>
                    <p className="text-xs text-slate-500">Abonnements</p>
                  </div>
                </div>
              </div>

              {/* Subscription History */}
              {selectedUser.subscriptions && selectedUser.subscriptions.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3 flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5" /> Historique abonnements
                  </h4>
                  <div className="space-y-2">
                    {selectedUser.subscriptions.slice(0, 5).map((sub: any) => (
                      <div key={sub.id} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2">
                          {PLAN_ICONS[sub.plan] || <Package className="w-4 h-4" />}
                          <span className="text-slate-700 dark:text-slate-200">{PLAN_LABELS[sub.plan] || sub.plan}</span>
                        </div>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${STATUS_STYLES[sub.status] || STATUS_STYLES.FREE}`}>
                          {STATUS_LABELS[sub.status] || sub.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={() => { setShowAssignModal(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition"
                >
                  <CreditCard className="w-4 h-4" />
                  Attribuer un abonnement
                </button>

                {selectedUser.subscriptionStatus === "SUSPENDED" ? (
                  <button
                    onClick={() => handleActivate(selectedUser)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Réactiver le compte
                  </button>
                ) : (
                  <button
                    onClick={() => handleSuspend(selectedUser)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    <Ban className="w-4 h-4" />
                    Suspendre le compte
                  </button>
                )}

                <button
                  onClick={() => handleDelete(selectedUser)}
                  className="w-full flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Supprimer définitivement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assign Subscription Modal */}
      {showAssignModal && selectedUser && (
        <div className="fixed inset-0 bg-black/60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">Attribuer un abonnement</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                Utilisateur : <strong className="text-slate-700 dark:text-slate-200">{selectedUser.name || selectedUser.email}</strong>
              </p>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Formule</label>
                <select
                  value={assignForm.plan}
                  onChange={(e) => setAssignForm((p) => ({ ...p, plan: e.target.value as any }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                >
                  <option value="STANDARD">Standard</option>
                  <option value="SMART">Smart</option>
                  <option value="PREMIUM">Premium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Durée (mois)</label>
                <input
                  type="number"
                  min={1}
                  value={assignForm.durationMonths}
                  onChange={(e) => setAssignForm((p) => ({ ...p, durationMonths: parseInt(e.target.value) || 1 }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Statut initial</label>
                <select
                  value={assignForm.status}
                  onChange={(e) => setAssignForm((p) => ({ ...p, status: e.target.value as "ACTIVE" | "PENDING" }))}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm"
                >
                  <option value="ACTIVE">Actif</option>
                  <option value="PENDING">En attente</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes admin</label>
                <textarea
                  value={assignForm.adminNotes}
                  onChange={(e) => setAssignForm((p) => ({ ...p, adminNotes: e.target.value }))}
                  rows={2}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 p-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={() => setShowAssignModal(false)}
                className="flex-1 px-4 py-2 text-sm text-slate-600 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                Annuler
              </button>
              <button
                onClick={handleAssignSubscription}
                disabled={saving}
                className="flex-1 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium disabled:opacity-60 transition"
              >
                {saving ? "En cours..." : "Attribuer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

