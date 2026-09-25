"use client";

import { useState, useEffect, useCallback } from "react";
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

const DEFAULT_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Votre Santé, Notre Mission Absolue",
    subtitle:
      "Découvrez la gamme de produits testés et approuvés scientifiquement par Oqata & Starry Health.",
    imageUrl:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=80",
    link: "/produits",
  },
  {
    id: 2,
    title: "L'Excellence du Bien-être au Quotidien",
    subtitle:
      "Des formules naturelles de pointe conçues pour revitaliser votre corps et fortifier votre esprit.",
    imageUrl:
      "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1600&q=80",
    link: "/a-propos",
  },
];

export function HeroCarousel({
  slides,
  primaryColor = "#0f766e",
  tenantQuery = "",
}: HeroCarouselProps) {
  const activeSlides = slides && slides.length > 0 ? slides : DEFAULT_SLIDES;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex(
      (prev) => (prev - 1 + activeSlides.length) % activeSlides.length
    );
  }, [activeSlides.length]);

  useEffect(() => {
    if (activeSlides.length <= 1 || isPaused) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [activeSlides.length, isPaused, nextSlide]);

  const currentSlide = activeSlides[currentIndex] || activeSlides[0];

  return (
    <div
      className="relative w-full h-[580px] sm:h-[640px] overflow-hidden group bg-slate-950 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Full Width Background Slides with Smooth Crossfade */}
      <AnimatePresence>
        <motion.div
          key={currentSlide.id || currentIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${currentSlide.imageUrl})`,
            backgroundColor: "#020617",
          }}
        >
          {/* Dual Overlay Gradient for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/40" />
        </motion.div>
      </AnimatePresence>

      {/* Content Area Centered in max-w-7xl Container */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center text-left">
        <motion.div
          key={`content-${currentSlide.id || currentIndex}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
              href={
                currentSlide.link
                  ? `${currentSlide.link}${tenantQuery}`
                  : `/produits${tenantQuery}`
              }
              className="inline-flex items-center gap-2 px-7 py-4 rounded-xl font-bold text-white shadow-xl transition-all hover:scale-105 active:scale-95"
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
      {activeSlides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            aria-label="Slide précédent"
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg active:scale-90"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Slide suivant"
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-slate-900/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-slate-900 transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 shadow-lg active:scale-90"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2.5">
            {activeSlides.map((_, idx) => (
              <button
                key={idx}
                aria-label={`Aller au slide ${idx + 1}`}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2.5 sm:h-3 rounded-full transition-all ${
                  idx === currentIndex ? "w-8 sm:w-10" : "w-2.5 sm:w-3 bg-white/40 hover:bg-white/70"
                }`}
                style={{
                  backgroundColor:
                    idx === currentIndex ? primaryColor : undefined,
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
