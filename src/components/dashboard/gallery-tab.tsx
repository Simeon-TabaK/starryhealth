"use client";

import React, { useState } from "react";
import { Plus, Lock, Camera, X, Edit, Trash2 } from "lucide-react";
import { CloudinaryUpload } from "@/components/cloudinary-upload";

interface GalleryTabProps {
  user: any;
  hasPremiumFeatures: boolean;
  gallery?: any[];
  onNavigateTab: (tabId: string) => void;
  onNotify: (message: string, type?: "success" | "error" | "warning", description?: string) => void;
  onAddGalleryImage: (formData: FormData) => Promise<any>;
  onUpdateGalleryImage: (imageId: number, formData: FormData) => Promise<any>;
  onDeleteGalleryImage: (imageId: number) => Promise<any>;
}

export function GalleryTab({
  user,
  hasPremiumFeatures,
  gallery = [],
  onNavigateTab,
  onNotify,
  onAddGalleryImage,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
}: GalleryTabProps) {
  const [showAddGallery, setShowAddGallery] = useState(false);
  const [addGalleryImageUrl, setAddGalleryImageUrl] = useState<string>("");
  const [editingGalleryImage, setEditingGalleryImage] = useState<any | null>(null);
  const [editGalleryImageUrl, setEditGalleryImageUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addGalleryImageUrl) {
      onNotify("Veuillez ajouter une photo.", "error");
      return;
    }
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", addGalleryImageUrl);
    try {
      await onAddGalleryImage(formData);
      onNotify("Image ajoutée à la galerie !");
      setShowAddGallery(false);
      setAddGalleryImageUrl("");
    } catch {
      onNotify("Erreur lors de l'ajout.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGalleryImage) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    if (editGalleryImageUrl) {
      formData.set("imageUrl", editGalleryImageUrl);
    }
    try {
      await onUpdateGalleryImage(editingGalleryImage.id, formData);
      onNotify("Photo de la galerie mise à jour !");
      setEditingGalleryImage(null);
    } catch (err: any) {
      onNotify(err.message || "Erreur de modification de la photo.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (imageId: number) => {
    if (!confirm("Supprimer cette photo ?")) return;
    try {
      await onDeleteGalleryImage(imageId);
      onNotify("Image supprimée !");
    } catch {
      onNotify("Erreur lors de la suppression.", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Galerie d'Images ("Notre univers en images")</h2>
          <p className="text-xs text-slate-500 mt-1">Carrousel de photos immersives visible sur votre vitrine avec upload et rognage.</p>
        </div>

        {hasPremiumFeatures && (
          <button
            onClick={() => {
              setAddGalleryImageUrl("");
              setShowAddGallery(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Ajouter une Photo
          </button>
        )}
      </div>

      {!hasPremiumFeatures ? (
        <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-3xl">
          <Lock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Réservé au Forfait PREMIUM</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Sur votre vitrine, une galerie de haute qualité est affichée par défaut. Passez à PREMIUM pour personnaliser et rogner vos propres clichés.
          </p>
          <button
            onClick={() => onNavigateTab("users")}
            className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            Voir les forfaits
          </button>
        </div>
      ) : (
        <>
          {/* Modal Add Gallery Image with Crop */}
          {showAddGallery && (
            <form
              onSubmit={handleAddSubmit}
              className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl max-w-lg mx-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <Camera className="w-4 h-4 text-amber-600" />
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">Ajouter une photo à la galerie</h3>
                </div>
                <button type="button" onClick={() => setShowAddGallery(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1.5">
                  Photo <span className="text-slate-400 font-normal">(Upload direct Cloudinary & Rognage interactif)</span>
                </label>
                <CloudinaryUpload
                  folder="starryhealth/gallery"
                  cropAspect="16:9"
                  onUpload={(url) => setAddGalleryImageUrl(url)}
                  currentUrl={addGalleryImageUrl}
                  label="Sélectionner, rogner et uploader la photo"
                  primaryColor={user.primaryColor || "#0f766e"}
                />
              </div>

              <div>
                <label className="text-xs font-semibold block mb-1">Légende</label>
                <input
                  type="text"
                  name="caption"
                  placeholder="Ex: Laboratoire de contrôle qualité certifié..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowAddGallery(false)} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={saving || !addGalleryImageUrl}
                  className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold disabled:opacity-50 cursor-pointer"
                >
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          )}

          {/* Modal Edit Gallery Image with Crop */}
          {editingGalleryImage && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">Modifier la photo de galerie</h3>
                  </div>
                  <button onClick={() => setEditingGalleryImage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={handleUpdateSubmit} className="space-y-4 pt-4">
                  <div>
                    <label className="text-xs font-semibold block mb-1.5">
                      Photo <span className="text-slate-400 font-normal">(Remplacer ou rogner à nouveau)</span>
                    </label>
                    <CloudinaryUpload
                      folder="starryhealth/gallery"
                      cropAspect="16:9"
                      onUpload={(url) => setEditGalleryImageUrl(url)}
                      currentUrl={editGalleryImageUrl || editingGalleryImage.imageUrl}
                      label="Changer, rogner et uploader"
                      primaryColor={user.primaryColor || "#0f766e"}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold block mb-1">Légende</label>
                    <input
                      type="text"
                      name="caption"
                      defaultValue={editingGalleryImage.caption || ""}
                      placeholder="Ex: Laboratoire de recherche..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button type="button" onClick={() => setEditingGalleryImage(null)} className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer">
                      Annuler
                    </button>
                    <button type="submit" disabled={saving} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer">
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {gallery.map((img: any) => (
              <div key={img.id} className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-900 group">
                <img src={img.imageUrl} alt={img.caption || ""} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="p-3 bg-white dark:bg-slate-900">
                  <p className="text-xs font-medium truncate text-slate-900 dark:text-white">{img.caption || "Sans légende"}</p>
                </div>
                <div className="absolute top-2 right-2 flex items-center gap-1.5 opacity-90 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingGalleryImage(img);
                      setEditGalleryImageUrl(img.imageUrl);
                    }}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-amber-600 text-white transition-colors shadow-md cursor-pointer"
                    title="Modifier la photo"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(img.id)}
                    className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-600 text-white transition-colors shadow-md cursor-pointer"
                    title="Supprimer la photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

