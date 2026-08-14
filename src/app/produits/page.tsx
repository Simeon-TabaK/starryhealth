import { getCurrentTenant } from "@/lib/get-current-tenant";
import { getProductsForTenant } from "@/lib/tenant";
import { ProductCard } from "@/components/product-card";
import { ScrollReveal, StaggerContainer, StaggerItem } from "@/components/scroll-reveal";
import { Sparkles, ShieldCheck, Tag } from "lucide-react";

interface PageProps {
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(params.tenant);
  const products = await getProductsForTenant(tenant);

  const primaryColor = tenant?.user?.primaryColor || "#0f766e";
  const tenantQuery = tenant?.isTenant && tenant?.slug ? `?tenant=${tenant.slug}` : "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header Banner */}
      <ScrollReveal direction="down">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase">
            <Sparkles className="w-4 h-4" /> Gamme Certifiée Oqata
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Catalogue des Produits <span style={{ color: primaryColor }}>Starry Health</span>
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
            Découvrez des formules innovantes et 100% naturelles, rigoureusement sélectionnées pour répondre à tous vos besoins en nutrition et vitalité.
          </p>

          {/* Notice: no tenant slug = prices hidden */}
          {(!tenant?.isTenant || !tenant?.user) && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30 text-left flex items-center gap-3 mt-6 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-amber-600 dark:text-amber-400 shrink-0" />
              <div>
                <strong className="text-slate-900 dark:text-white text-sm block">Prix masqués</strong>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Connectez-vous via le lien d'un distributeur agréé pour afficher les prix et bénéficier de tarifs préférentiels.
                </span>
              </div>
            </div>
          )}

          {/* Tenant Vendor Price Notice */}
          {tenant?.isTenant && tenant?.user && (
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-500/30 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shadow-sm">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <strong className="text-slate-900 dark:text-white text-sm block">Vendeur Officiel: {tenant.user.name}</strong>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {tenant.user.subscriptionStatus === "ACTIVE"
                      ? "Abonnement Vendeur Actif — Tarifs privilégiés appliqués automatiquement !"
                      : "Tarifs officiels du catalogue public."}
                  </span>
                </div>
              </div>

              {tenant.user.subscriptionStatus === "ACTIVE" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-500/40 text-xs font-semibold shrink-0">
                  <Tag className="w-3.5 h-3.5" /> Prix Réduits Partenaire
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Product Grid */}
      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl text-center text-slate-500 border border-slate-200 dark:border-slate-800">
          Aucun produit n'est disponible pour le moment.
        </div>
      ) : (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <StaggerItem key={product.id}>
              <ProductCard
                product={product}
                tenantQuery={tenantQuery}
                primaryColor={primaryColor}
              />
            </StaggerItem>
          ))}
        </StaggerContainer>
      )}

    </div>
  );
}
