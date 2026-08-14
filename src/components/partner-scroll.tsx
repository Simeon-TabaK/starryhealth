"use client";

import { Handshake } from "lucide-react";
import { motion } from "framer-motion";

export interface PartnerItem {
  id: number;
  name: string;
  logoUrl: string;
  website?: string | null;
}

interface PartnerScrollProps {
  partners: PartnerItem[];
}

export function PartnerScroll({ partners }: PartnerScrollProps) {
  if (!partners || partners.length === 0) return null;

  // Duplicate list for infinite marquee feel
  const marqueePartners = [...partners, ...partners];

  return (
    <div className="py-12 border-t border-b border-slate-200 dark:border-slate-800 my-12 bg-slate-100/50 dark:bg-slate-900/40 transition-colors overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
          <Handshake className="w-4 h-4" /> Partenaires de Confiance
        </span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-2">
          Réseau Officiel Oqata & Laboratoires Associés
        </h3>
      </div>

      <div className="relative w-full overflow-hidden">
        <motion.div
          className="flex items-center gap-8 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
        >
          {marqueePartners.map((partner, index) => (
            <a
              key={`${partner.id}-${index}`}
              href={partner.website || "#"}
              target={partner.website && partner.website !== "#" ? "_blank" : "_self"}
              rel="noopener noreferrer"
              className="bg-white dark:bg-slate-900 px-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-3 group transition-all shadow-sm hover:shadow-md shrink-0"
            >
              <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 shrink-0">
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {partner.name}
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
