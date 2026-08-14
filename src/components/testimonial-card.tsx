"use client";

import { Star, Quote } from "lucide-react";
import { motion } from "framer-motion";

export interface TestimonialItem {
  id: number;
  userId?: number | null;
  authorName: string;
  content: string;
  rating: number;
  avatar?: string | null;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  const avatarUrl =
    testimonial.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.authorName)}&background=0f766e&color=fff`;

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between h-full relative shadow-sm hover:shadow-md transition-all"
    >
      <Quote className="w-8 h-8 text-emerald-500/20 dark:text-emerald-400/20 absolute top-4 right-4" />

      <div className="space-y-4">
        {/* Rating Stars */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < testimonial.rating
                  ? "fill-amber-400 text-amber-400"
                  : "text-slate-300 dark:text-slate-700"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed italic">
          "{testimonial.content}"
        </p>
      </div>

      {/* Author Details */}
      <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
        <img
          src={avatarUrl}
          alt={testimonial.authorName}
          className="w-10 h-10 rounded-full object-cover border border-emerald-500/40 shrink-0"
        />
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            {testimonial.authorName}
            {testimonial.userId && (
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
                Avis Vendeur
              </span>
            )}
          </h4>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">Client Vérifié Starry Health</span>
        </div>
      </div>
    </motion.div>
  );
}
