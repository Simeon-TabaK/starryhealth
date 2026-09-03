"use client";

import { ExternalLink, Layers } from "lucide-react";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";

interface ServiceItem {
  id: number;
  name: string;
  url: string | null;
}

interface ServicesSectionProps {
  services: ServiceItem[];
  primaryColor?: string;
  vendorName?: string;
}

export function ServicesSection({
  services,
  primaryColor = "#0f766e",
  vendorName,
}: ServicesSectionProps) {
  if (!services || services.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <ScrollReveal direction="up">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Offres & Solutions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Nos Services & Offres Spéciales
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Découvrez nos accompagnements, packs et programmes exclusifs proposés par {vendorName || "notre équipe"}.
          </p>
        </div>
      </ScrollReveal>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <StaggerItem key={service.id}>
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full group">
              <div>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-105 transition-transform"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Layers className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                  {service.name}
                </h3>
              </div>

              {service.url ? (
                <a
                  href={service.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold hover:underline"
                  style={{ color: primaryColor }}
                >
                  Découvrir l'offre <ExternalLink className="w-3.5 h-3.5" />
                </a>
              ) : (
                <span className="mt-4 text-xs font-medium text-slate-400 dark:text-slate-500">
                  Offre disponible sur demande
                </span>
              )}
            </div>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </section>
  );
}
