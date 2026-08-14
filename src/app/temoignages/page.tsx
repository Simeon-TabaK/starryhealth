import { getCurrentTenant } from "@/lib/get-current-tenant";
import { getTestimonialsForTenant } from "@/lib/tenant";
import { TestimonialCard } from "@/components/testimonial-card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";
import { Sparkles, ShieldCheck } from "lucide-react";

interface PageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function TestimonialsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(params.tenant);
  const testimonials = await getTestimonialsForTenant(tenant);

  const primaryColor = tenant?.user?.primaryColor || "#0f766e";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header */}
      <ScrollReveal direction="down">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" /> Expériences Clients & Avis
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Témoignages & Retours <span style={{ color: primaryColor }}>Starry Health</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Découvrez la satisfaction de nos utilisateurs à travers leurs récits d'amélioration de la santé et du bien-être général.
          </p>

          {tenant?.isTenant && tenant?.user && (
            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 inline-flex items-center gap-2 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Affichage combiné : Témoignages généraux + avis spécifiques au conseiller <strong>{tenant.user.name}</strong></span>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Grid */}
      {testimonials.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-500 border border-slate-200 dark:border-slate-800">
          Aucun témoignage enregistré pour le moment.
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <StaggerItem key={t.id}>
              <TestimonialCard testimonial={t} />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

    </div>
  );
}
