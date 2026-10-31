"use client";

import React, { useState } from "react";
import {
  AlertCircle,
  Plus,
  Lock,
  Package,
  X,
  Crown,
  Check,
  Edit,
  Eye,
  EyeOff,
  Trash2,
} from "lucide-react";
import { CloudinaryUpload } from "@/components/cloudinary-upload";
import { getProductLimit } from "@/lib/plans";

interface ProductsTabProps {
  user: any;
  isSuperAdmin: boolean;
  isSubscribed: boolean;
  hasPremiumFeatures: boolean;
  plan: "STANDARD" | "SMART" | "PREMIUM" | null;
  products: any[];
  categories?: any[];
  customPrices?: any[];
  onNavigateTab: (tabId: string) => void;
  onNotify: (message: string, type?: "success" | "error" | "warning", description?: string) => void;
  onCreateProduct: (formData: FormData) => Promise<any>;
  onUpdateProduct: (productId: number, formData: FormData) => Promise<any>;
  onDeleteProduct: (productId: number) => Promise<any>;
  onUpdateCustomPrice: (productId: number, price: number) => Promise<any>;
}

export function ProductsTab({
  user,
  isSuperAdmin,
  isSubscribed,
  hasPremiumFeatures,
  plan,
  products = [],
  categories = [],
  customPrices = [],
  onNavigateTab,
  onNotify,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateCustomPrice,
}: ProductsTabProps) {
  // Pagination
  const [productPage, setProductPage] = useState(1);
  const PRODUCTS_PER_PAGE = 6;

  // Modals & form state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [createProductImageUrl, setCreateProductImageUrl] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editProductImageUrl, setEditProductImageUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Custom prices local map
  const [pricesState, setPricesState] = useState<Record<number, number>>(() => {
    const map: Record<number, number> = {};
    customPrices.forEach((cp: any) => {
      map[cp.productId] = cp.customPrice;
    });
    return map;
  });

  // Quotas
  const productQuota = getProductLimit(plan);
  const ownProductsCount = products.filter((p) => p.userId === user.id).length;
  const canAddMoreProducts = isSuperAdmin || ownProductsCount < productQuota;

  const handleCreateProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!createProductImageUrl) {
      onNotify("Photo obligatoire", "error", "Veuillez sélectionner et uploader une photo pour le produit.");
      return;
    }
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("images", createProductImageUrl);
    try {
      await onCreateProduct(formData);
      onNotify("Produit créé avec succès !", "success", "Votre nouveau produit est enregistré dans le catalogue.");
      setShowAddProduct(false);
      setCreateProductImageUrl("");
      (e.target as HTMLFormElement).reset();
    } catch (err: any) {
      onNotify("Erreur de création", "error", err.message || "Impossible de créer ce produit.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    if (editProductImageUrl) {
      formData.set("images", editProductImageUrl);
    }
    try {
      await onUpdateProduct(editingProduct.id, formData);
      onNotify("Produit modifié avec succès !");
      setEditingProduct(null);
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de la modification du produit.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (productId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    setSaving(true);
    try {
      await onDeleteProduct(productId);
      onNotify("Produit supprimé !");
    } catch (err: any) {
      onNotify(err.message || "Erreur de suppression.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePriceSave = async (productId: number) => {
    const priceVal = pricesState[productId];
    if (priceVal === undefined || isNaN(priceVal)) return;
    setSaving(true);
    try {
      await onUpdateCustomPrice(productId, priceVal);
      onNotify("Prix revendeur enregistré !");
    } catch (err: any) {
      onNotify(err.message || "Erreur de mise à jour du prix.", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Visibility status notice if user is not active */}
      {!isSubscribed && !isSuperAdmin && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
            <div>
              <strong className="block text-slate-900 dark:text-white font-semibold">Note de visibilité publique</strong>
              <span>Vous pouvez créer et configurer vos produits dès maintenant. Toutefois, vos produits créés restent <strong>masqués publiquement</strong> sur votre vitrine tant que vous n'avez pas souscrit à un abonnement actif.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab("users")}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold shrink-0 shadow-sm transition-colors cursor-pointer"
          >
            Activer un abonnement
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Mes Produits ({ownProductsCount} / {isFinite(productQuota) ? productQuota : "Illimité"})
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Créez vos produits propres avec photos rognées ou ajustez vos tarifs revendeurs privilégiés.
          </p>
        </div>

        {canAddMoreProducts ? (
          <button
            onClick={() => {
              setCreateProductImageUrl("");
              setShowAddProduct(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md transition-transform hover:scale-105 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajouter un Produit
          </button>
        ) : (
          <div className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/50 px-3 py-2 rounded-xl border border-rose-500/30 flex items-center gap-2 font-semibold">
            <Lock className="w-4 h-4" /> Quota atteint ({productQuota} max)
          </div>
        )}
      </div>

      {/* Modal Add Product with Cloudinary Upload & Crop */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Nouveau Produit</h3>
              </div>
              <button onClick={() => setShowAddProduct(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateProductSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nom du produit</label>
                <input required type="text" name="name" placeholder="Ex: Spiruline Bio Pure" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <textarea required name="description" rows={3} placeholder="Présentez les bienfaits et ingrédients..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Prix public ($)</label>
                  <input required type="number" step="0.01" name="defaultPrice" placeholder="Ex: 39.99" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Prix barré avant réduction ($)</label>
                  <input type="number" step="0.01" name="originalPrice" placeholder="Optionnel (ex: 49.99)" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Catégorie</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">Catégorie (texte)</label>
                    <input type="text" name="category" defaultValue="Santé & Bien-être" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 mb-1 block">Rayon / Arborescence</label>
                    <select name="categoryId" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800">
                      <option value="">-- Aucun rayon rattaché --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.parentId ? '  ↳ ' : ''}{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Advanced PREMIUM Fields */}
                {hasPremiumFeatures && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3 mt-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                      <Crown className="w-4 h-4 text-amber-500" />
                      Fiche Produit Détaillée (PREMIUM)
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Description courte (résumé)</label>
                      <input type="text" name="shortDescription" placeholder="Accroche en une phrase pour la liste..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Origine / Fabrication</label>
                        <input type="text" name="origin" placeholder="Ex: France, Bio..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Format / Packaging</label>
                        <input type="text" name="packaging" placeholder="Ex: Flacon 60 gélules..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Ingrédients & Composition</label>
                      <textarea name="ingredients" rows={2} placeholder="Liste des principes actifs..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Bienfaits & Avantages</label>
                      <textarea name="benefits" rows={2} placeholder="Effets constatés, bénéfices santé..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Conseils d'utilisation & Posologie</label>
                      <textarea name="usage" rows={2} placeholder="2 gélules par jour avec un grand verre d'eau..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Contre-indications & Mises en garde</label>
                      <textarea name="contraindications" rows={2} placeholder="Déconseillé aux femmes enceintes..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">Titre SEO (Meta title)</label>
                        <input type="text" name="metaTitle" placeholder="Titre pour Google..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold block mb-1">URL personnalisée (Slug)</label>
                        <input type="text" name="seoSlug" placeholder="nom-du-produit" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 font-mono text-xs" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Description SEO (Meta description)</label>
                      <textarea name="metaDescription" rows={2} placeholder="Description affichée dans les moteurs de recherche..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Image Upload with Crop Section */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold block">
                    Photo du produit <span className="text-rose-500">*</span>
                  </label>
                  {!createProductImageUrl ? (
                    <span className="text-[11px] text-rose-500 font-medium bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-md">
                      Image requise
                    </span>
                  ) : (
                    <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3" /> Image prête
                    </span>
                  )}
                </div>
                <CloudinaryUpload
                  folder="starryhealth/products"
                  cropAspect="4:3"
                  onUpload={(url) => setCreateProductImageUrl(url)}
                  currentUrl={createProductImageUrl}
                  label="Sélectionner, rogner et uploader la photo"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
                {!createProductImageUrl && (
                  <p className="text-[11px] text-rose-500 mt-1">
                    Une photo principale est indispensable pour enregistrer ce produit.
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddProduct(false)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !createProductImageUrl}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed shadow cursor-pointer"
                >
                  {saving ? "Création en cours..." : "Créer le produit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Product with Cloudinary Upload & Crop */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 flex items-center justify-center">
                  <Edit className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">Modifier le Produit</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateProductSubmit} className="space-y-4 pt-4">
              <div>
                <label className="text-xs font-semibold block mb-1">Nom du produit</label>
                <input required type="text" name="name" defaultValue={editingProduct.name} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
              </div>
              <div>
                <label className="text-xs font-semibold block mb-1">Description</label>
                <textarea required name="description" rows={3} defaultValue={editingProduct.description} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold block mb-1">Prix public ($)</label>
                  <input required type="number" step="0.01" name="defaultPrice" defaultValue={editingProduct.defaultPrice} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-xs font-semibold block mb-1">Prix original barré ($)</label>
                  <input type="number" step="0.01" name="originalPrice" defaultValue={editingProduct.originalPrice || ""} placeholder="Optionnel" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Catégorie (texte)</label>
                  <input type="text" name="category" defaultValue={editingProduct.category || "Santé & Bien-être"} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800" />
                </div>
                <div>
                  <label className="text-[11px] text-slate-500 mb-1 block">Rayon / Arborescence</label>
                  <select name="categoryId" defaultValue={editingProduct.categoryId || ""} className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-slate-50 dark:bg-slate-800">
                    <option value="">-- Aucun rayon rattaché --</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.parentId ? '  ↳ ' : ''}{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced PREMIUM Fields */}
              {hasPremiumFeatures && (
                <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 space-y-3 mt-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                    <Crown className="w-4 h-4 text-amber-500" />
                    Fiche Produit Détaillée (PREMIUM)
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Description courte (résumé)</label>
                    <input type="text" name="shortDescription" defaultValue={editingProduct.shortDescription || ""} placeholder="Accroche en une phrase pour la liste..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Origine / Fabrication</label>
                      <input type="text" name="origin" defaultValue={editingProduct.origin || ""} placeholder="Ex: France, Bio..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Format / Packaging</label>
                      <input type="text" name="packaging" defaultValue={editingProduct.packaging || ""} placeholder="Ex: Flacon 60 gélules..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Ingrédients & Composition</label>
                    <textarea name="ingredients" rows={2} defaultValue={editingProduct.ingredients || ""} placeholder="Liste des principes actifs..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Bienfaits & Avantages</label>
                    <textarea name="benefits" rows={2} defaultValue={editingProduct.benefits || ""} placeholder="Effets constatés, bénéfices santé..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Conseils d'utilisation & Posologie</label>
                    <textarea name="usage" rows={2} defaultValue={editingProduct.usage || ""} placeholder="2 gélules par jour avec un grand verre d'eau..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Contre-indications & Mises en garde</label>
                    <textarea name="contraindications" rows={2} defaultValue={editingProduct.contraindications || ""} placeholder="Déconseillé aux femmes enceintes..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">Titre SEO (Meta title)</label>
                      <input type="text" name="metaTitle" defaultValue={editingProduct.metaTitle || ""} placeholder="Titre pour Google..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900" />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold block mb-1">URL personnalisée (Slug)</label>
                      <input type="text" name="seoSlug" defaultValue={editingProduct.seoSlug || ""} placeholder="nom-du-produit" className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 font-mono text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold block mb-1">Description SEO (Meta description)</label>
                    <textarea name="metaDescription" rows={2} defaultValue={editingProduct.metaDescription || ""} placeholder="Description affichée dans les moteurs de recherche..." className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-sm bg-white dark:bg-slate-900 resize-none" />
                  </div>
                </div>
              )}

              {/* Image Upload with Crop Section */}
              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Photo du produit <span className="text-slate-400 font-normal">(Remplacer ou rogner à nouveau)</span>
                </label>
                <CloudinaryUpload
                  folder="starryhealth/products"
                  cropAspect="4:3"
                  onUpload={(url) => setEditProductImageUrl(url)}
                  currentUrl={editProductImageUrl || editingProduct.images?.split(",")[0]}
                  label="Changer, rogner et uploader la photo"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  name="isVisible"
                  value="true"
                  defaultChecked={editingProduct.isVisible !== false}
                  id="edit-prod-vis"
                  className="rounded accent-emerald-600"
                />
                <label htmlFor="edit-prod-vis" className="text-xs text-slate-600 dark:text-slate-300 font-medium cursor-pointer">
                  Activer ce produit (visible quand l'abonnement est actif)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer">
                  Annuler
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 cursor-pointer">
                  {saving ? "Enregistrement..." : "Enregistrer les modifications"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products
          .slice((productPage - 1) * PRODUCTS_PER_PAGE, productPage * PRODUCTS_PER_PAGE)
          .map((p) => {
            const isOwn = p.userId === user.id;
            const hasDiscount = p.originalPrice && p.originalPrice > p.defaultPrice;
            const discountPct = hasDiscount ? Math.round(((p.originalPrice - p.defaultPrice) / p.originalPrice) * 100) : 0;
            const mainImg = p.images?.split(",")[0] || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=600&q=80";

            return (
              <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between overflow-hidden">
                <div>
                  {/* Product Image Thumbnail */}
                  <div className="h-40 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 mb-3 border border-slate-100 dark:border-slate-800 relative group">
                    <img
                      src={mainImg}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {hasDiscount && (
                      <span className="absolute top-2 right-2 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                        -{discountPct}%
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                      {p.category}
                    </span>
                    {isOwn ? (
                      isSubscribed || isSuperAdmin ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Eye className="w-3 h-3" /> Visible en ligne
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <EyeOff className="w-3 h-3" /> Masqué (Sans abonnement)
                        </span>
                      )
                    ) : (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                        Catalogue Global
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-base text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">{p.description}</p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-emerald-600">${p.defaultPrice.toFixed(2)}</span>
                    {hasDiscount && (
                      <span className="text-xs text-slate-400 line-through">${p.originalPrice.toFixed(2)}</span>
                    )}
                  </div>

                  {/* Custom pricing */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <label className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      Votre Prix Revendeur Partenaire ($)
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        step="0.01"
                        value={pricesState[p.id] ?? ""}
                        onChange={(e) =>
                          setPricesState({ ...pricesState, [p.id]: parseFloat(e.target.value) })
                        }
                        placeholder={p.defaultPrice.toString()}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs"
                      />
                      <button
                        onClick={() => handlePriceSave(p.id)}
                        className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                      >
                        Fixer
                      </button>
                    </div>
                  </div>
                </div>

                {(isOwn || isSuperAdmin) && (
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setEditProductImageUrl(p.images?.split(",")[0] || "");
                      }}
                      className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" /> Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            );
          })}
      </div>

      {/* Pagination Controls */}
      {products.length > PRODUCTS_PER_PAGE && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 px-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-xs text-slate-500">
            Affichage de {((productPage - 1) * PRODUCTS_PER_PAGE) + 1} à {Math.min(productPage * PRODUCTS_PER_PAGE, products.length)} sur {products.length} produits
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={productPage === 1}
              onClick={() => setProductPage((p) => Math.max(p - 1, 1))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Précédent
            </button>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 px-2">
              {productPage} / {Math.ceil(products.length / PRODUCTS_PER_PAGE)}
            </span>
            <button
              type="button"
              disabled={productPage >= Math.ceil(products.length / PRODUCTS_PER_PAGE)}
              onClick={() => setProductPage((p) => Math.min(p + 1, Math.ceil(products.length / PRODUCTS_PER_PAGE)))}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Suivant
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
