"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Crop, ZoomIn, ZoomOut, RotateCw, Check, X, Move, Sparkles } from "lucide-react";

export type CropAspectOption = "1:1" | "4:3" | "16:9" | "3:4" | "free";

interface ImageCropModalProps {
  imageSrc: string;
  initialAspect?: CropAspectOption;
  primaryColor?: string;
  title?: string;
  onCropComplete: (croppedBlob: Blob) => void;
  onSkipCrop: () => void;
  onCancel: () => void;
}

export function ImageCropModal({
  imageSrc,
  initialAspect = "4:3",
  primaryColor = "#0f766e",
  title = "Recadrer et Ajuster l'image",
  onCropComplete,
  onSkipCrop,
  onCancel,
}: ImageCropModalProps) {
  const [aspect, setAspect] = useState<CropAspectOption>(initialAspect);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Aspect ratio calculations
  const getAspectDimensions = () => {
    switch (aspect) {
      case "1:1":
        return { width: 340, height: 340, ratio: 1 };
      case "4:3":
        return { width: 380, height: 285, ratio: 4 / 3 };
      case "16:9":
        return { width: 400, height: 225, ratio: 16 / 9 };
      case "3:4":
        return { width: 270, height: 360, ratio: 3 / 4 };
      case "free":
      default:
        return { width: 360, height: 270, ratio: 4 / 3 };
    }
  };

  const { width: cropWidth, height: cropHeight } = getAspectDimensions();

  // Reset offset when aspect or rotation changes
  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setOffset({ x: 0, y: 0 });
  };

  // Drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isDragging) return;
      setOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    },
    [isDragging, dragStart]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch handlers for mobile/tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const newZoom = Math.max(0.5, Math.min(3, zoom - e.deltaY * 0.002));
    setZoom(newZoom);
  };

  // Generate cropped image from canvas
  const handleApplyCrop = () => {
    const img = imageRef.current;
    if (!img) return;

    // High quality canvas
    const exportWidth = 1200;
    const exportHeight = Math.round(exportWidth / (cropWidth / cropHeight));

    const canvas = document.createElement("canvas");
    canvas.width = exportWidth;
    canvas.height = exportHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Fill background for transparent pngs
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, exportWidth, exportHeight);

    // Coordinate transformations
    ctx.save();
    ctx.translate(exportWidth / 2, exportHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const scaleFactor = exportWidth / cropWidth;
    const drawZoom = zoom * scaleFactor;

    // Render image transformed
    const imgNaturalRatio = img.naturalWidth / img.naturalHeight;
    const imgDisplayWidth = cropWidth * drawZoom;
    const imgDisplayHeight = (cropWidth / imgNaturalRatio) * drawZoom;

    ctx.drawImage(
      img,
      -imgDisplayWidth / 2 + offset.x * scaleFactor,
      -imgDisplayHeight / 2 + offset.y * scaleFactor,
      imgDisplayWidth,
      imgDisplayHeight
    );

    ctx.restore();

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onCropComplete(blob);
        } else {
          onSkipCrop();
        }
      },
      "image/jpeg",
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden max-h-[95vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <Crop className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">{title}</h3>
              <p className="text-[11px] text-slate-500">Ajustez le cadrage, zoomez et orientez votre photo</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Aspect Ratio Presets */}
        <div className="px-6 py-2.5 bg-slate-50 dark:bg-slate-950/60 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-xs font-semibold">
          <span className="text-slate-400 text-[11px] shrink-0">Format :</span>
          {(
            [
              { id: "4:3", label: "4:3 (Produit standard)" },
              { id: "1:1", label: "1:1 (Carré)" },
              { id: "16:9", label: "16:9 (Paysage)" },
              { id: "3:4", label: "3:4 (Portrait)" },
              { id: "free", label: "Libre" },
            ] as { id: CropAspectOption; label: string }[]
          ).map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                setAspect(item.id);
                setOffset({ x: 0, y: 0 });
              }}
              className={`px-3 py-1.5 rounded-xl transition-all shrink-0 ${
                aspect === item.id
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-400"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Interactive Viewport */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className="relative flex-1 min-h-[320px] sm:min-h-[380px] bg-slate-950 flex items-center justify-center overflow-hidden select-none cursor-grab active:cursor-grabbing p-4"
        >
          {/* Crop Area Overlay */}
          <div
            style={{
              width: cropWidth,
              height: cropHeight,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="relative z-10 border-2 border-dashed border-white/90 rounded-2xl shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] overflow-hidden flex items-center justify-center"
          >
            {/* Grid overlay */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-r border-b border-white/60" />
              <div className="border-b border-white/60" />
              <div className="border-r border-white/60" />
              <div className="border-r border-white/60" />
              <div />
            </div>

            {/* Hint */}
            <div className="absolute bottom-2 left-2 right-2 flex justify-center pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-[10px] text-white/90 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium">
                <Move className="w-2.5 h-2.5" /> Glissez pour positionner
              </span>
            </div>
          </div>

          {/* Under-layer Image */}
          <img
            ref={imageRef}
            src={imageSrc}
            alt="Source à rogner"
            draggable={false}
            style={{
              transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
              transition: isDragging ? "none" : "transform 0.1s ease-out",
              maxWidth: "none",
            }}
            className="absolute pointer-events-none"
          />
        </div>

        {/* Toolbar Controls */}
        <div className="px-6 py-3 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          {/* Zoom Controls */}
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Dézoomer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.05"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-emerald-600 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, z + 0.1))}
              className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
              title="Zoomer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-slate-400 w-9 text-right">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          {/* Rotate & Reset */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5"
            >
              <RotateCw className="w-3.5 h-3.5" /> 90°
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-500 hover:text-slate-800"
            >
              Réinitialiser
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onSkipCrop}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            Garder l'original (sans rogner)
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              style={{ backgroundColor: primaryColor }}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-emerald-600/20 hover:opacity-95 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" /> Rogner & Uploader
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
