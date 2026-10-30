"use client";

/**
 * CloudinaryUpload — Composant d'upload d'image moderne, direct et simplifié.
 *
 * Caractéristiques :
 *  - Une seule zone d'upload épurée (suppression des boutons redondants / doublons).
 *  - Glisser-déposer ou clic pour parcourir les fichiers.
 *  - Support optionnel du recadrage interactif (ImageCropModal).
 *  - Envoi direct et sécurisé vers Cloudinary avec barre de progression en direct.
 *  - Prévisualisation nette avec boutons de modification ou suppression.
 */

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImagePlus, Check, Crop } from "lucide-react";
import { ImageCropModal, CropAspectOption } from "./image-crop-modal";

interface CloudinaryUploadProps {
  /** Dossier Cloudinary cible (ex: "starryhealth/products", "starryhealth/logos", "starryhealth/avatars") */
  folder?: string;
  /** Format initial pour le recadrage (ex: "4:3", "1:1", "16:9", "free") */
  cropAspect?: CropAspectOption;
  /** Activer ou désactiver l'étape de rognage interactif (défaut: true) */
  enableCrop?: boolean;
  /** Callback appelé avec l'URL Cloudinary finale après upload réussi */
  onUpload: (url: string) => void;
  /** URL d'image actuelle pour affichage */
  currentUrl?: string | null;
  /** Couleur primaire thématique */
  primaryColor?: string;
  /** Libellé explicatif */
  label?: string;
  /** Classe CSS additionnelle */
  className?: string;
}

const CLOUDINARY_UPLOAD_URL = (cloudName: string) =>
  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

export function CloudinaryUpload({
  folder = "starryhealth/uploads",
  cropAspect = "4:3",
  enableCrop = true,
  onUpload,
  currentUrl,
  primaryColor = "#0f766e",
  label = "Sélectionner une image",
  className = "",
}: CloudinaryUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  // État du modal de recadrage
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Upload direct vers Cloudinary via XHR (progression en direct)
  const performUpload = useCallback(
    async (fileOrBlob: File | Blob, originalFilename?: string) => {
      setError(null);
      setUploading(true);
      setProgress(0);

      try {
        const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
        const defaultCloudName =
          process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dau4wzqrr";

        const formData = new FormData();
        const filename = originalFilename || `img_${Date.now()}.jpg`;
        formData.append("file", fileOrBlob, filename);

        let targetCloudName = defaultCloudName;

        if (uploadPreset) {
          // Mode Unsigned (avec Upload Preset) : aucun calcul de signature nécessaire
          formData.append("upload_preset", uploadPreset);
          if (folder) formData.append("folder", folder);
        } else {
          // Mode Signé : récupération de la signature SHA-1 depuis le serveur
          const sigRes = await fetch("/api/cloudinary/sign", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ folder }),
          });

          if (!sigRes.ok) {
            const errData = await sigRes.json().catch(() => ({}));
            throw new Error(errData.error || "Impossible d'obtenir la signature Cloudinary.");
          }

          const { signature, timestamp, apiKey, cloudName } = await sigRes.json();
          targetCloudName = cloudName;

          formData.append("api_key", apiKey);
          formData.append("timestamp", String(timestamp));
          formData.append("signature", signature);
          formData.append("folder", folder);
        }

        // Envoi direct vers Cloudinary
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", CLOUDINARY_UPLOAD_URL(targetCloudName));

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const data = JSON.parse(xhr.responseText);
                const finalUrl = data.secure_url;
                setPreview(finalUrl);
                onUpload(finalUrl);
                resolve();
              } catch (parseErr) {
                reject(new Error("Réponse Cloudinary invalide."));
              }
            } else {
              let msg = "Échec du téléchargement vers Cloudinary.";
              try {
                const errData = JSON.parse(xhr.responseText);
                if (errData.error?.message) msg = errData.error.message;
              } catch {}
              reject(new Error(msg));
            }
          };

          xhr.onerror = () => reject(new Error("Erreur réseau pendant l'envoi de l'image."));
          xhr.send(formData);
        });
      } catch (err: any) {
        setError(err.message || "Une erreur est survenue lors du téléchargement.");
        setPreview(currentUrl || null);
      } finally {
        setUploading(false);
        setProgress(0);
        setRawImageForCrop(null);
        setPendingFile(null);
      }
    },
    [folder, onUpload, currentUrl]
  );

  const handleSelectedFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP).");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError("L'image est trop volumineuse (maximum 15 Mo).");
        return;
      }

      setError(null);

      if (enableCrop) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setRawImageForCrop(e.target?.result as string);
          setPendingFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        performUpload(file, file.name);
      }
    },
    [enableCrop, performUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleSelectedFile(file);
    },
    [handleSelectedFile]
  );

  const triggerInput = () => {
    if (!uploading && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  const removeImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onUpload("");
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Modal de recadrage interactif */}
      {rawImageForCrop && (
        <ImageCropModal
          imageSrc={rawImageForCrop}
          initialAspect={cropAspect}
          primaryColor={primaryColor}
          onCropComplete={(croppedBlob) => {
            performUpload(
              croppedBlob,
              pendingFile?.name?.replace(/\.[^/.]+$/, ".jpg") || "image.jpg"
            );
          }}
          onSkipCrop={() => {
            if (pendingFile) performUpload(pendingFile, pendingFile.name);
          }}
          onCancel={() => {
            setRawImageForCrop(null);
            setPendingFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      )}

      {/* Zone d'Upload unique et moderne */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={triggerInput}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-5 text-center min-h-[140px]
          ${
            dragging
              ? "border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 scale-[0.99]"
              : "border-slate-300 dark:border-slate-700 hover:border-emerald-500/80 bg-slate-50/80 dark:bg-slate-900/40"
          }
          ${uploading ? "pointer-events-none opacity-80" : ""}
        `}
      >
        {/* Aperçu de l'image courante en arrière-plan */}
        {preview && !uploading && (
          <img
            src={preview}
            alt="Aperçu"
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Overlay pour l'état en cours de chargement */}
        {uploading ? (
          <div className="relative z-10 flex flex-col items-center justify-center gap-2.5 bg-black/60 backdrop-blur-sm p-4 rounded-2xl text-white">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-400" />
            <p className="text-xs font-bold">Envoi vers Cloudinary… {progress}%</p>
            <div className="w-36 h-2 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : preview ? (
          /* Overlay d'actions sur l'image chargée */
          <div className="relative z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-3.5 py-2 rounded-xl text-white shadow-lg transition-transform group-hover:scale-105">
            <button
              type="button"
              onClick={triggerInput}
              className="flex items-center gap-1.5 text-xs font-semibold hover:text-emerald-300 transition-colors"
            >
              <Crop className="w-3.5 h-3.5 text-emerald-400" /> Changer / Recadrer
            </button>
            <span className="text-white/30">|</span>
            <button
              type="button"
              onClick={removeImage}
              className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-100 transition-colors"
              title="Supprimer cette image"
            >
              <X className="w-3.5 h-3.5" /> Supprimer
            </button>
          </div>
        ) : (
          /* État vide : invitation à sélectionner ou glisser une image */
          <div className="relative z-10 flex flex-col items-center justify-center gap-2">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110"
              style={{ backgroundColor: primaryColor }}
            >
              <ImagePlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {label}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Glissez-déposez ou cliquez ici pour choisir une photo
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Affichage d'erreur en cas d'échec */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center justify-between">
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-400 hover:text-rose-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Élément input HTML natif masqué */}
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleSelectedFile(file);
        }}
        disabled={uploading}
      />
    </div>
  );
}
