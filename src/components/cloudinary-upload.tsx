"use client";

/**
 * CloudinaryUpload — Input Image avec sélection de fichier direct et Rognage Intégré.
 *
 * Fonctionnalités :
 *  1. Input de type fichier image (`<input type="file" accept="image/*">`) stylisé et interactif.
 *  2. Ouvre directement l'explorateur de fichiers / galerie photo de l'appareil.
 *  3. Modal interactif de recadrage / rognage (ratios 1:1, 4:3, 16:9, 3:4, zoom, rotation).
 *  4. Upload direct vers Cloudinary avec barre de progression XHR.
 *  5. Prévisualisation de l'image sélectionnée et bouton pour modifier/remplacer.
 */

import { useState, useRef, useCallback } from "react";
import { Upload, X, Loader2, ImagePlus, Check, Crop, FolderOpen, ImageIcon } from "lucide-react";
import { ImageCropModal, CropAspectOption } from "./image-crop-modal";

interface CloudinaryUploadProps {
  /** Dossier Cloudinary (ex: "starryhealth/products", "starryhealth/gallery", "starryhealth/avatars") */
  folder?: string;
  /** Format initial pour le recadrage (ex: "4:3", "1:1", "16:9", "3:4", "free") */
  cropAspect?: CropAspectOption;
  /** Activer ou non l'étape de rognage interactif (défaut: true) */
  enableCrop?: boolean;
  /** Callback appelé avec l'URL Cloudinary finale après upload */
  onUpload: (url: string) => void;
  /** URL courante (pour prévisualisation initiale) */
  currentUrl?: string | null;
  /** Couleur primaire */
  primaryColor?: string;
  /** Label affiché */
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
  const [success, setSuccess] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  // Crop Modal state
  const [rawImageForCrop, setRawImageForCrop] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Direct upload to Cloudinary (from Blob or File)
  const performUpload = useCallback(
    async (fileOrBlob: File | Blob, originalFilename?: string) => {
      setError(null);
      setSuccess(false);
      setUploading(true);
      setProgress(0);

      try {
        // 1. Get signature from server
        const sigRes = await fetch("/api/cloudinary/sign", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ folder }),
        });

        if (!sigRes.ok) {
          throw new Error("Erreur de signature Cloudinary.");
        }

        const { signature, timestamp, apiKey, cloudName } = await sigRes.json();

        // 2. Prepare Form Data
        const formData = new FormData();
        const filename = originalFilename || `upload_${Date.now()}.jpg`;
        formData.append("file", fileOrBlob, filename);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);
        formData.append("folder", folder);

        // 3. Upload directly to Cloudinary with progress
        await new Promise<void>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", CLOUDINARY_UPLOAD_URL(cloudName));

          xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) {
              setProgress(Math.round((e.loaded / e.total) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              const data = JSON.parse(xhr.responseText);
              const finalUrl = data.secure_url;
              setPreview(finalUrl);
              onUpload(finalUrl);
              setSuccess(true);
              resolve();
            } else {
              let msg = "Échec de l'upload.";
              try {
                const errData = JSON.parse(xhr.responseText);
                if (errData.error?.message) msg = errData.error.message;
              } catch {}
              reject(new Error(msg));
            }
          };

          xhr.onerror = () => reject(new Error("Erreur réseau pendant l'upload."));
          xhr.send(formData);
        });
      } catch (err: any) {
        setError(err.message || "Erreur lors de l'upload.");
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

  // Process selected file
  const handleSelectedFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Veuillez sélectionner un fichier image valide (JPG, PNG, WebP…).");
        return;
      }
      if (file.size > 15 * 1024 * 1024) {
        setError("L'image ne doit pas dépasser 15 Mo.");
        return;
      }

      setError(null);
      setFileName(file.name);

      if (enableCrop) {
        // Read file as data url for cropper modal
        const reader = new FileReader();
        reader.onload = (e) => {
          setRawImageForCrop(e.target?.result as string);
          setPendingFile(file);
        };
        reader.readAsDataURL(file);
      } else {
        // Direct upload without crop
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleSelectedFile(file);
  };

  const triggerFileInput = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!uploading && inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.click();
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Interactive Crop Modal */}
      {rawImageForCrop && (
        <ImageCropModal
          imageSrc={rawImageForCrop}
          initialAspect={cropAspect}
          primaryColor={primaryColor}
          onCropComplete={(croppedBlob) => {
            performUpload(croppedBlob, pendingFile?.name?.replace(/\.[^/.]+$/, ".jpg") || "cropped.jpg");
          }}
          onSkipCrop={() => {
            if (pendingFile) {
              performUpload(pendingFile, pendingFile.name);
            }
          }}
          onCancel={() => {
            setRawImageForCrop(null);
            setPendingFile(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        />
      )}

      {/* Styled Image Input Bar */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <button
          type="button"
          onClick={triggerFileInput}
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white shadow transition-all hover:opacity-95 shrink-0"
          style={{ backgroundColor: primaryColor }}
        >
          <FolderOpen className="w-4 h-4" /> Parcourir...
        </button>

        <div
          onClick={triggerFileInput}
          className="flex-1 px-3 py-1.5 text-xs text-slate-500 dark:text-slate-400 truncate cursor-pointer hover:text-slate-900 dark:hover:text-white"
        >
          {uploading ? (
            <span className="flex items-center gap-2 font-medium text-emerald-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Upload en cours ({progress}%)...
            </span>
          ) : fileName ? (
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-600" /> {fileName}
            </span>
          ) : preview ? (
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Image chargée (Cliquer pour remplacer)
            </span>
          ) : (
            <span>Aucun fichier choisi (Cliquer pour sélectionner)</span>
          )}
        </div>

        {preview && !uploading && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setPreview(null);
              setFileName("");
              setSuccess(false);
              onUpload("");
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Effacer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Visual Dropzone & Preview Box */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center p-4 text-center
          ${
            dragging
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 scale-[0.99]"
              : "border-slate-200 dark:border-slate-700 hover:border-emerald-500/70 dark:hover:border-emerald-500/70 bg-slate-50 dark:bg-slate-900/40"
          }
          ${uploading ? "pointer-events-none opacity-80" : ""}
        `}
        style={{ minHeight: 135 }}
      >
        {/* Background Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Aperçu"
            className="absolute inset-0 w-full h-full object-cover opacity-85 group-hover:opacity-60 transition-opacity"
          />
        )}

        {/* Content & Action overlay */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-2">
          {uploading ? (
            <>
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Envoi vers Cloudinary… {progress}%
              </p>
              <div className="w-44 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden shadow-inner">
                <div
                  className="h-full rounded-full transition-all duration-150"
                  style={{ width: `${progress}%`, backgroundColor: primaryColor }}
                />
              </div>
            </>
          ) : preview ? (
            <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-2xl text-white flex items-center gap-3 shadow-lg">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <Crop className="w-3.5 h-3.5 text-emerald-400" /> Remplacer & Rogner
              </div>
              <span className="text-white/40">|</span>
              <span className="text-[11px] text-white/80">Cliquer pour changer</span>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <ImagePlus className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {label}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Glissez-déposez ou cliquez pour ouvrir vos dossiers
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
          <X className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Real HTML Input File Element */}
      <input
        ref={inputRef}
        type="file"
        name="imageFile"
        accept="image/png,image/jpeg,image/webp,image/jpg"
        className="hidden"
        onChange={handleChange}
        disabled={uploading}
      />
    </div>
  );
}
