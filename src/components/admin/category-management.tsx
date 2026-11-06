"use client";

import { useState } from "react";
import {
  FolderPlus,
  Folder,
  FolderTree,
  Edit,
  Trash2,
  Plus,
  Save,
  X,
  ChevronRight,
  ChevronDown,
  Crown,
  Layers,
  Tag,
} from "lucide-react";
import {
  createProductCategory,
  updateProductCategory,
  deleteProductCategory,
} from "@/app/dashboard/admin-actions";

export interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parentId: number | null;
  sortOrder: number;
  userId: number | null;
  children?: CategoryItem[];
  products?: any[];
}

interface CategoryManagementProps {
  userId: number;
  isSuperAdmin: boolean;
  canManageCategories: boolean;
  categories: CategoryItem[];
  onNotify: (msg: string, type?: "success" | "error") => void;
  onRefresh?: () => void;
}

export function CategoryManagement({
  userId,
  isSuperAdmin,
  canManageCategories,
  categories: initialCategories = [],
  onNotify,
}: CategoryManagementProps) {
  const [categories, setCategories] = useState<CategoryItem[]>(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [parentForNew, setParentForNew] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  // Build tree
  const rootCategories = categories.filter((c) => !c.parentId);
  const getChildren = (parentId: number) => categories.filter((c) => c.parentId === parentId);

  const toggleExpand = (id: number) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openCreate = (parentId?: number) => {
    setEditingCat(null);
    setParentForNew(parentId ?? null);
    setName("");
    setSlug("");
    setDescription("");
    setSortOrder(0);
    setShowModal(true);
  };

  const openEdit = (cat: CategoryItem) => {
    setEditingCat(cat);
    setParentForNew(cat.parentId);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || "");
    setSortOrder(cat.sortOrder);
    setShowModal(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!editingCat) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      onNotify("Le nom de la catégorie est obligatoire.", "error");
      return;
    }
    const finalSlug = slug.trim() || generateSlug(name);
    setSaving(true);
    try {
      if (editingCat) {
        await updateProductCategory(userId, editingCat.id, {
          name: name.trim(),
          description: description.trim() || undefined,
          parentId: parentForNew ?? undefined,
          sortOrder,
        });
        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCat.id
              ? {
                  ...c,
                  name: name.trim(),
                  description: description.trim() || null,
                  parentId: parentForNew ?? null,
                  sortOrder,
                }
              : c
          )
        );
        onNotify("Catégorie mise à jour !");
      } else {
        const res = await createProductCategory(userId, {
          name: name.trim(),
          slug: finalSlug,
          description: description.trim() || undefined,
          parentId: parentForNew ?? undefined,
          sortOrder,
        });
        setCategories((prev) => [...prev, res.category as any]);
        onNotify("Catégorie créée avec succès !");
      }
      setShowModal(false);
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de l'enregistrement.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cat: CategoryItem) => {
    const hasKids = categories.some((c) => c.parentId === cat.id);
    if (hasKids) {
      onNotify("Veuillez d'abord supprimer ou déplacer les sous-catégories.", "error");
      return;
    }
    if (!confirm(`Supprimer la catégorie "${cat.name}" ?`)) return;

    setSaving(true);
    try {
      await deleteProductCategory(userId, cat.id);
      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      onNotify("Catégorie supprimée.");
    } catch (err: any) {
      onNotify(err.message || "Erreur de suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!canManageCategories && !isSuperAdmin) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 text-center max-w-xl mx-auto shadow-sm">
        <div className="w-14 h-14 bg-amber-50 dark:bg-amber-950/40 text-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
          Catégories de Produits (Formule Premium)
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
          La gestion des catégories et sous-catégories arborescentes est réservée aux abonnés de la formule <strong>Premium</strong>. Passez au niveau supérieur pour organiser vos produits en rayons et sous-familles.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <FolderTree className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Arborescence des Catégories ({categories.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Structurez votre catalogue par catégories principales et sous-catégories enfants.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition"
        >
          <FolderPlus className="w-4 h-4" /> Nouvelle catégorie parente
        </button>
      </div>

      {/* Categories tree view */}
      {rootCategories.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
          <Folder className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Aucune catégorie créée pour le moment.
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Créez des catégories pour classer vos produits par rayon ou thématique.
          </p>
          <button
            type="button"
            onClick={() => openCreate()}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition"
          >
            Créer la première catégorie
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm">
          {rootCategories.map((root) => {
            const children = getChildren(root.id);
            const isExp = expanded[root.id] ?? true;
            return (
              <div key={root.id} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-center justify-between gap-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    {children.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => toggleExpand(root.id)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
                      >
                        {isExp ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </button>
                    ) : (
                      <span className="w-6" />
                    )}
                    <Folder className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-sm text-slate-900 dark:text-white truncate">
                      {root.name}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      /{root.slug}
                    </span>
                    {children.length > 0 && (
                      <span className="text-[10px] text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full font-bold">
                        {children.length} sous-catégorie{children.length > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openCreate(root.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition"
                      title="Ajouter une sous-catégorie"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => openEdit(root)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-950/30 transition"
                      title="Modifier"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(root)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Subcategories */}
                {isExp && children.length > 0 && (
                  <div className="pl-10 pr-2 pt-2 space-y-1.5 border-l-2 border-emerald-500/20 ml-5 my-1">
                    {children.map((child) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between gap-3 p-2 rounded-lg bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Tag className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="text-xs font-medium text-slate-800 dark:text-slate-200 truncate">
                            {child.name}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">/{child.slug}</span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEdit(child)}
                            className="p-1 rounded text-slate-400 hover:text-sky-600"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(child)}
                            className="p-1 rounded text-slate-400 hover:text-rose-600"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modal create / edit */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">
                  {editingCat ? "Modifier la Catégorie" : parentForNew ? "Nouvelle Sous-Catégorie" : "Nouvelle Catégorie Parente"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 pt-4">
              {/* Parent category selector */}
              <div>
                <label className="text-xs font-semibold block mb-1">Catégorie parente (optionnel)</label>
                <select
                  value={parentForNew ?? ""}
                  onChange={(e) => setParentForNew(e.target.value ? Number(e.target.value) : null)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                >
                  <option value="">-- Aucune (Catégorie principale) --</option>
                  {rootCategories
                    .filter((r) => !editingCat || r.id !== editingCat.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">
                  Nom de la catégorie <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="Ex: Compléments alimentaires, Huiles essentielles..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Slug URL</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="complements-alimentaires"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 font-mono text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Description courte</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Brève présentation des articles de cette catégorie..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Ordre d&apos;affichage</label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !name.trim()}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 shadow"
                >
                  {saving ? "Enregistrement..." : editingCat ? "Enregistrer" : "Créer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

