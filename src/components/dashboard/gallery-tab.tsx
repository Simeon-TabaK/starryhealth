"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Lock,
  Camera,
  X,
  Edit,
  Trash2,
  Upload,
  Check,
  CheckSquare,
  Square,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { CloudinaryUpload } from "@/components/media/cloudinary-upload";

interface GalleryTabProps {
  user: any;
  hasPremiumFeatures: boolean;
  gallery?: any[];
  onNavigateTab: (tabId: string) => void;
  onNotify: (message: string, type?: "success" | "error" | "warning", description?: string) => void;
  onAddGalleryImage: (formData: FormData) => Promise<any>;
  onAddMultipleGalleryImages?: (images: Array<{ imageUrl: string; caption?: string }>) => Promise<any>;
  onUpdateGalleryImage: (imageId: number, formData: FormData) => Promise<any>;
  onDeleteGalleryImage: (imageId: number) => Promise<any>;
  onDeleteMultipleGalleryImages?: (imageIds: number[]) => Promise<any>;
}

// Helper pour uploader un fichier individuel vers Cloudinary
async function uploadFileToCloudinary(file: File, folder = "starryhealth/gallery"): Promise<string> {
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const defaultCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dq7q7k57t";
  const formData = new FormData();
  formData.append("file", file);

  let targetCloudName = defaultCloudName;
  if (uploadPreset) {
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
  } else {
    const sigRes = await fetch("/api/cloudinary/sign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ folder }),
    });
    if (!sigRes.ok) {
      const err = await sigRes.json().catch(() => ({}));
      throw new Error(err.error || "Impossible d'obtenir la signature Cloudinary.");
    }
    const { signature, timestamp, apiKey, cloudName } = await sigRes.json();
    targetCloudName = cloudName;
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);
  }

  const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${targetCloudName}/image/upload`, {
    method: "POST",
    body: formData,
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || "Échec de l'envoi de l'image.");
  }

  const data = await uploadRes.json();
  return data.secure_url;
}

export function GalleryTab({
  user,
  hasPremiumFeatures,
  gallery = [],
  onNavigateTab,
  onNotify,
  onAddGalleryImage,
  onAddMultipleGalleryImages,
  onUpdateGalleryImage,
  onDeleteGalleryImage,
  onDeleteMultipleGalleryImages,
}: GalleryTabProps) {
  // État local réactif pour affichage immédiat sans rechargement
  const [localGallery, setLocalGallery] = useState<any[]>(gallery);

  useEffect(() => {
    setLocalGallery(gallery);
  }, [gallery]);

  // Modales
  const [showAddSingle, setShowAddSingle] = useState(false);
  const [showAddMultiple, setShowAddMultiple] = useState(false);
  const [addGalleryImageUrl, setAddGalleryImageUrl] = useState<string>("");
  const [editingGalleryImage, setEditingGalleryImage] = useState<any | null>(null);
  const [editGalleryImageUrl, setEditGalleryImageUrl] = useState<string>("");
  const [saving, setSaving] = useState(false);

  // Visionneuse Lightbox (Agrandissement / Diaporama)
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);

  // Mode sélection multiple pour suppression en masse
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Téléversement multiple
  const [multiFiles, setMultiFiles] = useState<File[]>([]);
  const [multiProgress, setMultiProgress] = useState<{ current: number; total: number } | null>(null);
  const multiInputRef = useRef<HTMLInputElement>(null);

  // ── 1. AJOUT UNIQUE AVEC ROGNAGE ──
  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!addGalleryImageUrl) {
      onNotify("Veuillez sélectionner ou rogner une photo.", "error");
      return;
    }
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    formData.set("imageUrl", addGalleryImageUrl);
    const caption = (formData.get("caption") as string)?.trim() || "";

    try {
      const res = await onAddGalleryImage(formData);
      const newImg = {
        id: res?.image?.id || Date.now(),
        userId: user.id,
        imageUrl: addGalleryImageUrl,
        caption: caption || null,
        order: 0,
        createdAt: new Date().toISOString(),
      };
      setLocalGallery((prev) => [newImg, ...prev]);
      onNotify("Photo ajoutée à la galerie avec succès !", "success");
      setShowAddSingle(false);
      setAddGalleryImageUrl("");
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de l'ajout.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── 2. TÉLÉVERSEMENT MULTIPLE DIRECT ──
  const handleMultiFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const filesArray = Array.from(e.target.files).filter((f) => f.type.startsWith("image/"));
    if (filesArray.length === 0) {
      onNotify("Veuillez choisir des fichiers images valides (JPG, PNG, WebP).", "error");
      return;
    }
    setMultiFiles(filesArray);
  };

  const handleStartMultiUpload = async () => {
    if (multiFiles.length === 0) return;
    setSaving(true);
    setMultiProgress({ current: 0, total: multiFiles.length });

    const uploadedUrls: string[] = [];

    try {
      for (let i = 0; i < multiFiles.length; i++) {
        setMultiProgress({ current: i + 1, total: multiFiles.length });
        const file = multiFiles[i];
        const url = await uploadFileToCloudinary(file, "starryhealth/gallery");
        uploadedUrls.push(url);
      }

      // Enregistrement en base de données
      const imagesToSave = uploadedUrls.map((url) => ({
        imageUrl: url,
        caption: "",
      }));

      if (onAddMultipleGalleryImages) {
        const res = await onAddMultipleGalleryImages(imagesToSave);
        if (res?.images && Array.isArray(res.images)) {
          setLocalGallery((prev) => [...res.images, ...prev]);
        } else {
          const optimisticList = uploadedUrls.map((url, idx) => ({
            id: Date.now() + idx,
            userId: user.id,
            imageUrl: url,
            caption: null,
            order: 0,
          }));
          setLocalGallery((prev) => [...optimisticList, ...prev]);
        }
      } else {
        // Fallback: enregistrer séquentiellement si onAddMultipleGalleryImages n'est pas fourni
        const addedList: any[] = [];
        for (const url of uploadedUrls) {
          const fd = new FormData();
          fd.set("imageUrl", url);
          const res = await onAddGalleryImage(fd);
          addedList.push({
            id: res?.image?.id || Date.now() + Math.random(),
            userId: user.id,
            imageUrl: url,
            caption: null,
            order: 0,
          });
        }
        setLocalGallery((prev) => [...addedList, ...prev]);
      }

      onNotify(`${uploadedUrls.length} photo(s) ajoutée(s) avec succès à la galerie !`, "success");
      setShowAddMultiple(false);
      setMultiFiles([]);
      setMultiProgress(null);
    } catch (err: any) {
      onNotify(err.message || "Erreur lors du téléversement multiple.", "error");
    } finally {
      setSaving(false);
      setMultiProgress(null);
    }
  };

  // ── 3. MODIFICATION ──
  const handleUpdateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingGalleryImage) return;
    setSaving(true);
    const formData = new FormData(e.currentTarget);
    const newUrl = editGalleryImageUrl || editingGalleryImage.imageUrl;
    const caption = (formData.get("caption") as string)?.trim() || "";
    formData.set("imageUrl", newUrl);
    formData.set("caption", caption);

    try {
      await onUpdateGalleryImage(editingGalleryImage.id, formData);
      setLocalGallery((prev) =>
        prev.map((img) =>
          img.id === editingGalleryImage.id
            ? { ...img, imageUrl: newUrl, caption: caption || null }
            : img
        )
      );
      onNotify("Photo modifiée avec succès !", "success");
      setEditingGalleryImage(null);
      setEditGalleryImageUrl("");
    } catch (err: any) {
      onNotify(err.message || "Erreur lors de la modification.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── 4. SUPPRESSION INDIVIDUELLE ──
  const handleDelete = async (imageId: number) => {
    if (!confirm("Voulez-vous vraiment supprimer cette photo ?")) return;
    try {
      await onDeleteGalleryImage(imageId);
      setLocalGallery((prev) => prev.filter((img) => img.id !== imageId));
      setSelectedIds((prev) => prev.filter((id) => id !== imageId));
      onNotify("Photo supprimée de la galerie !", "success");
    } catch {
      onNotify("Erreur lors de la suppression.", "error");
    }
  };

  // ── 5. SUPPRESSION MULTIPLE ──
  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!confirm(`Supprimer ces ${selectedIds.length} photo(s) sélectionnée(s) ?`)) return;

    setSaving(true);
    try {
      if (onDeleteMultipleGalleryImages) {
        await onDeleteMultipleGalleryImages(selectedIds);
      } else {
        for (const id of selectedIds) {
          await onDeleteGalleryImage(id);
        }
      }
      setLocalGallery((prev) => prev.filter((img) => !selectedIds.includes(img.id)));
      onNotify(`${selectedIds.length} photo(s) supprimée(s) !`, "success");
      setSelectedIds([]);
      setSelectionMode(false);
    } catch {
      onNotify("Erreur lors de la suppression groupée.", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggleSelectImage = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === localGallery.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(localGallery.map((img) => img.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Galerie d'Images ("Notre univers en images")
            </h2>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
              {localGallery.length} photo{localGallery.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Gérez vos photos haute définition, ajoutez plusieurs visuels à la fois, modifiez ou supprimez vos clichés.
          </p>
        </div>

        {hasPremiumFeatures && (
          <div className="flex items-center gap-2 flex-wrap">
            {localGallery.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSelectionMode(!selectionMode);
                  setSelectedIds([]);
                }}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectionMode
                    ? "bg-slate-800 text-white border-slate-800 dark:bg-slate-200 dark:text-slate-900"
                    : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {selectionMode ? <CheckSquare className="w-3.5 h-3.5" /> : <Square className="w-3.5 h-3.5" />}
                {selectionMode ? "Quitter sélection" : "Sélectionner"}
              </button>
            )}

            <button
              onClick={() => {
                setMultiFiles([]);
                setShowAddMultiple(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 cursor-pointer shadow-sm transition-all"
            >
              <Upload className="w-3.5 h-3.5" /> Téléverser Plusieurs
            </button>

            <button
              onClick={() => {
                setAddGalleryImageUrl("");
                setShowAddSingle(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Ajouter une Photo
            </button>
          </div>
        )}
      </div>

      {/* Barre d'action sélection multiple */}
      {selectionMode && localGallery.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 p-4 rounded-2xl flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSelectAll}
              className="text-xs font-bold text-amber-800 dark:text-amber-300 hover:underline flex items-center gap-1 cursor-pointer"
            >
              {selectedIds.length === localGallery.length ? "Tout désélectionner" : "Tout sélectionner"}
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {selectedIds.length} sur {localGallery.length} photo(s) sélectionnée(s)
            </span>
          </div>

          <button
            onClick={handleBulkDelete}
            disabled={selectedIds.length === 0 || saving}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Trash2 className="w-3.5 h-3.5" /> Supprimer la sélection ({selectedIds.length})
          </button>
        </div>
      )}

      {/* Verrouillage si pas Premium */}
      {!hasPremiumFeatures ? (
        <div className="p-8 text-center bg-amber-50 dark:bg-amber-950/20 border border-amber-500/30 rounded-3xl">
          <Lock className="w-8 h-8 text-amber-500 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 dark:text-white">Réservé au Forfait PREMIUM</h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Sur votre vitrine, une galerie de haute qualité est affichée par défaut. Passez à PREMIUM pour personnaliser, rogner et ajouter vos propres visuels multiples.
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
          {/* Modal 1: Ajout Unique avec Cadrage */}
          {showAddSingle && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <form
                onSubmit={handleAddSubmit}
                className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl max-w-lg w-full"
              >
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Ajouter une photo à la galerie
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddSingle(false)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-semibold block mb-1.5">
                    Photo <span className="text-slate-400 font-normal">(Rognage interactif 16:9 recommandé)</span>
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
                  <label className="text-xs font-semibold block mb-1">Légende (optionnelle)</label>
                  <input
                    type="text"
                    name="caption"
                    placeholder="Ex: Laboratoire de contrôle qualité certifié..."
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-sm"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowAddSingle(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
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
            </div>
          )}

          {/* Modal 2: Téléversement Multiple Direct */}
          {showAddMultiple && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl max-w-lg w-full">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Téléversement multiple de photos
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!saving) setShowAddMultiple(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Sélectionnez plusieurs photos simultanément sur votre appareil pour les importer d'un coup dans votre galerie.
                  </p>

                  <div
                    onClick={() => multiInputRef.current?.click()}
                    className="border-2 border-dashed border-amber-300 dark:border-amber-700/60 hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer bg-amber-50/40 dark:bg-amber-950/20 transition-all"
                  >
                    <input
                      ref={multiInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleMultiFilesSelected}
                      className="hidden"
                    />
                    <Upload className="w-8 h-8 text-amber-600 mx-auto mb-2" />
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Cliquez pour choisir plusieurs images
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">JPG, PNG, WebP (jusqu'à 20 photos)</p>
                  </div>

                  {multiFiles.length > 0 && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-3 max-h-40 overflow-y-auto space-y-1.5 border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 pb-1 border-b border-slate-200 dark:border-slate-700">
                        <span>Fichiers sélectionnés ({multiFiles.length})</span>
                        <button
                          type="button"
                          onClick={() => setMultiFiles([])}
                          className="text-rose-500 hover:underline text-[10px]"
                        >
                          Réinitialiser
                        </button>
                      </div>
                      {multiFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                          <span className="truncate max-w-[280px]">{f.name}</span>
                          <span className="text-[10px] text-slate-400">
                            {(f.size / (1024 * 1024)).toFixed(2)} Mo
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {multiProgress && (
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-semibold text-amber-700 dark:text-amber-400">
                        <span>Envoi vers le serveur Cloud...</span>
                        <span>
                          {multiProgress.current} / {multiProgress.total}
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-amber-600 h-2 transition-all duration-300 rounded-full"
                          style={{
                            width: `${(multiProgress.current / multiProgress.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => setShowAddMultiple(false)}
                    className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="button"
                    disabled={saving || multiFiles.length === 0}
                    onClick={handleStartMultiUpload}
                    className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                  >
                    {saving ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Téléversement en cours...
                      </>
                    ) : (
                      `Téléverser (${multiFiles.length}) photos`
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Modal 3: Modification Photo & Légende */}
          {editingGalleryImage && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 text-amber-600" />
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                      Modifier la photo de galerie
                    </h3>
                  </div>
                  <button
                    onClick={() => setEditingGalleryImage(null)}
                    className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
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
                    <button
                      type="button"
                      onClick={() => setEditingGalleryImage(null)}
                      className="px-4 py-2 text-xs text-slate-500 hover:text-slate-700 cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      {saving ? "Enregistrement..." : "Enregistrer"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal 4: Visionneuse HD / Lightbox */}
          {viewerIndex !== null && localGallery[viewerIndex] && (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4">
              <button
                onClick={() => setViewerIndex(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Flèche précédente */}
              {localGallery.length > 1 && (
                <button
                  onClick={() =>
                    setViewerIndex((prev) => (prev! > 0 ? prev! - 1 : localGallery.length - 1))
                  }
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              {/* Image active */}
              <div className="max-w-4xl max-h-[80vh] flex flex-col items-center">
                <img
                  src={localGallery[viewerIndex].imageUrl}
                  alt={localGallery[viewerIndex].caption || "Photo"}
                  className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl"
                />
                {localGallery[viewerIndex].caption && (
                  <p className="text-white text-sm font-medium mt-3 text-center bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-sm">
                    {localGallery[viewerIndex].caption}
                  </p>
                )}
                <p className="text-white/60 text-xs mt-2">
                  {viewerIndex + 1} / {localGallery.length}
                </p>
              </div>

              {/* Flèche suivante */}
              {localGallery.length > 1 && (
                <button
                  onClick={() =>
                    setViewerIndex((prev) => (prev! < localGallery.length - 1 ? prev! + 1 : 0))
                  }
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>
          )}

          {/* Grille des photos ou état vide */}
          {localGallery.length === 0 ? (
            <div className="p-12 text-center bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
              <Camera className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                Aucune photo dans votre galerie
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                Enrichissez votre vitrine publique avec des photos attractives de vos produits, locaux ou équipes.
              </p>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setShowAddMultiple(true)}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Téléverser plusieurs photos
                </button>
                <button
                  onClick={() => setShowAddSingle(true)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Ajouter une photo
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {localGallery.map((img: any, idx: number) => {
                const isSelected = selectedIds.includes(img.id);
                return (
                  <div
                    key={img.id}
                    className={`relative rounded-2xl overflow-hidden border bg-white dark:bg-slate-900 group shadow-sm transition-all ${
                      isSelected
                        ? "border-amber-500 ring-2 ring-amber-500/40"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {/* Image Thumbnail avec zoom */}
                    <div className="relative h-48 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => {
                      if (selectionMode) {
                        toggleSelectImage(img.id);
                      } else {
                        setViewerIndex(idx);
                      }
                    }}>
                      <img
                        src={img.imageUrl}
                        alt={img.caption || ""}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />

                      {/* Overlay loupe au hover */}
                      {!selectionMode && (
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="p-2 bg-black/60 rounded-full text-white">
                            <Maximize2 className="w-4 h-4" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Sélection checkbox si mode sélection */}
                    {selectionMode && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleSelectImage(img.id);
                        }}
                        className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/70 text-white shadow-md z-10 cursor-pointer"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    )}

                    {/* Footer carte avec légende et actions */}
                    <div className="p-3.5 flex items-center justify-between gap-2 bg-white dark:bg-slate-900">
                      <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-100 flex-1">
                        {img.caption || <span className="text-slate-400 italic font-normal">Sans légende</span>}
                      </p>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            setEditingGalleryImage(img);
                            setEditGalleryImageUrl(img.imageUrl);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Modifier la photo ou la légende"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(img.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                          title="Supprimer la photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
