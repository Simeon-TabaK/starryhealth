"use client";

import { useState } from "react";
import { Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollReveal } from "@/components/scroll-reveal";

interface GalleryImageItem {
  id: number;
  imageUrl: string;
  caption: string | null;
}

interface GallerySectionProps {
  images: GalleryImageItem[];
  primaryColor?: string;
}

export function GallerySection({ images, primaryColor = "#0f766e" }: GallerySectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) return null;

  const current = images[currentIndex];

  const prev = () => {
    setCurrentIndex((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  };

  const next = () => {
    setCurrentIndex((curr) => (curr === images.length - 1 ? 0 : curr + 1));
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" /> Galerie Exclusive
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Notre univers en images
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Découvrez nos réalisations, coulisses, événements et certifications en images.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl bg-slate-950">
        <div className="relative h-[340px] sm:h-[460px] w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <img
                src={current.imageUrl}
                alt={current.caption || "Image de galerie"}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {current.caption && (
                <div className="absolute bottom-6 left-6 right-6 text-white text-sm sm:text-base font-medium drop-shadow-md">
                  {current.caption}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Image précédente"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                aria-label="Image suivante"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Indicators */}
        {images.length > 1 && (
          <div className="py-3 bg-slate-900/80 flex items-center justify-center gap-2">
            {images.map((img, idx) => (
              <button
                key={img.id}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex ? "w-6 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
                style={idx === currentIndex ? { backgroundColor: primaryColor } : undefined}
                aria-label={`Aller à l'image ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
