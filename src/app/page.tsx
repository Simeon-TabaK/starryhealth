import { getCurrentTenant } from "@/lib/get-current-tenant";
import { getCarouselItems, getProductsForTenant, getTestimonialsForTenant, getPartners } from "@/lib/tenant";
import { HeroCarousel } from "@/components/hero-carousel";
import { StatsSection } from "@/components/stats-section";
import { PartnerScroll } from "@/components/partner-scroll";
import { ProductCard } from "@/components/product-card";
import { TestimonialCard } from "@/components/testimonial-card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";
import { Sparkles, ArrowRight, ShieldCheck, HeartPulse } from "lucide-react";
import Link from "next/link";

interface PageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(params.tenant);

  const carouselItems = await getCarouselItems(tenant?.user?.id);
  const products = await getProductsForTenant(tenant);
  const testimonials = await getTestimonialsForTenant(tenant);
  const partners = await getPartners();

  const primaryColor = tenant?.user?.primaryColor || "#0f766e";
  const tenantQuery = tenant?.isTenant && tenant?.slug ? `?tenant=${tenant.slug}` : "";

  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. Hero Carousel - Full Width (100% écran) */}
      <section className="w-full">
        <HeroCarousel
          slides={carouselItems}
          primaryColor={primaryColor}
          tenantQuery={tenantQuery}
        />
      </section>

      {/* 2. Welcome Title Section */}
      <section className="max-w-4xl mx-auto text-center px-4 space-y-4">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold tracking-wide uppercase">
            <Sparkles className="w-4 h-4" /> Excellence & Science
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-3">
            Bienvenu à <span style={{ color: primaryColor }}>Starry Health</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-3xl mx-auto mt-2">
            Leader global dans la promotion de la santé et le bien-être de l'humanité par l'utilisation des produits lisses, testés et approuvés scientifiquement.
          </p>

          {tenant?.isTenant && tenant?.user && (
            <div className="pt-4 inline-flex items-center gap-3 bg-white dark:bg-slate-900 px-5 py-3 rounded-2xl border border-emerald-500/30 shadow-md">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="text-left text-xs">
                <span className="text-slate-500 dark:text-slate-400 block">Votre Distributeur Agréé Starry Health</span>
                <strong className="text-slate-900 dark:text-white text-sm">{tenant.user.name}</strong> ({tenant.user.bio || "Conseiller Nutrition & Santé"})
              </div>
            </div>
          )}
        </ScrollReveal>
      </section>

      {/* 3. Stats Section */}
      <section>
        <StatsSection primaryColor={primaryColor} />
      </section>

      {/* 4. Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block mb-1">
                Gamme Sélectionnée
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Nos Produits Phares
              </h2>
            </div>

            <Link
              href={`/produits${tenantQuery}`}
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300 transition-colors"
            >
              Voir tout le catalogue ({products.length} produits) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                product={product}
                tenantQuery={tenantQuery}
                primaryColor={primaryColor}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* 5. Partners Scroll */}
      <section>
        <PartnerScroll partners={partners} />
      </section>

      {/* 6. Testimonials Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
              Avis & Expériences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Ce que nos clients disent de Starry Health
            </h2>
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.slice(0, 3).map((testimonial) => (
            <StaggerItem key={testimonial.id}>
              <TestimonialCard testimonial={testimonial} />
            </StaggerItem>
          ))}
        </StaggerContainer>

        <ScrollReveal direction="up" delay={0.2}>
          <div className="mt-8 text-center">
            <Link
              href={`/temoignages${tenantQuery}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-sm"
            >
              Consulter tous les témoignages <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal direction="up">
          <div
            className="rounded-3xl border border-slate-200 dark:border-white/10 p-8 sm:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl"
            style={{
              background: `linear-gradient(135deg, rgba(15, 118, 110, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)`,
            }}
          >
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold uppercase">
                <HeartPulse className="w-4 h-4" /> Prenez soin de votre corps aujourd'hui
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Prêt à transformer votre bien-être au quotidien ?
              </h2>
              <p className="text-slate-200 text-sm leading-relaxed">
                Consultez notre catalogue complet et profitez d'un accompagnement personnalisé avec nos experts Oqata & Starry Health.
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <Link
                href={`/produits${tenantQuery}`}
                className="px-8 py-4 rounded-xl font-bold text-white shadow-xl text-center transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                Commander nos Produits
              </Link>
              <Link
                href={`/contacts${tenantQuery}`}
                className="px-8 py-4 rounded-xl font-medium text-white bg-slate-900/60 hover:bg-slate-900 border border-white/20 text-center transition-colors"
              >
                Nous Contacter
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}
