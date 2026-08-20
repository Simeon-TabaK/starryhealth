"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string | null;
  imageUrl: string;
  link: string | null;
}

interface HeroCarouselProps {
  slides: CarouselSlide[];
  primaryColor?: string;
  tenantQuery?: string;
}

export function HeroCarousel({ slides, primaryColor = "#0f766e", tenantQuery = "" }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (!slides || slides.length === 0) {
    return (
      <div className="relative h-[500px] w-full bg-slate-900 flex items-center justify-center text-center p-8">
        <div>
          <h2 className="text-3xl font-extrabold text-white mb-2">Bienvenu à Starry Health</h2>
          <p className="text-slate-300 max-w-xl mx-auto text-sm">
            Leader global dans la promotion de la santé et le bien-être de l'humanité.
          </p>
        </div>
      </div>
    );
  }

  const currentSlide = slides[currentIndex];

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] overflow-hidden group bg-slate-950">
      
      {/* Full Width Background Slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${currentSlide.imageUrl})` }}
        >
          {/* Dual Overlay Gradient for readability in Light & Dark Mode */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Area Centered in max-w-7xl Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ y: 25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6 max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="w-4 h-4" /> Produits d'Excellence
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight drop-shadow-md">
            {currentSlide.title}
          </h1>

          {currentSlide.subtitle && (
            <p className="text-slate-200 text-base sm:text-lg max-w-2xl leading-relaxed font-normal">
              {currentSlide.subtitle}
            </p>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={currentSlide.link ? `${currentSlide.link}${tenantQuery}` : `/produits${tenantQuery}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-white shadow-xl transition-transform hover:scale-105"
              style={{ backgroundColor: primaryColor }}
            >
              Découvrir nos Produits <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href={`/a-propos${tenantQuery}`}
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-medium text-white bg-white/10 backdrop-blur-md hover:bg-white/20 border border-white/20 transition-colors"
            >
              En savoir plus
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Slide Navigation Buttons */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900 transition-opacity opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900 transition-opacity opacity-0 group-hover:opacity-100 shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-3 rounded-full transition-all ${
                  idx === currentIndex ? "w-10" : "w-3 bg-white/40"
                }`}
                style={{ backgroundColor: idx === currentIndex ? primaryColor : undefined }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
