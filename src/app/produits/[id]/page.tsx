import { getCurrentTenant } from "@/lib/get-current-tenant";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, ShieldCheck, Tag, Phone, ShoppingCart, EyeOff } from "lucide-react";
import { ScrollReveal } from "@/components/scroll-reveal";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ tenant?: string }>;
}

export default async function ProductDetailPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const sParams = searchParams ? await searchParams : {};
  const tenant = await getCurrentTenant(sParams.tenant);

  const productId = parseInt(id, 10);
  if (isNaN(productId)) return notFound();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return notFound();

  let effectivePrice = product.defaultPrice;
  let isCustomPrice = false;
  const showPrice = !!(tenant?.isTenant && tenant?.user);

  if (tenant?.isTenant && tenant?.user && tenant.user.subscriptionStatus === "ACTIVE") {
    const custom = await prisma.userProductPrice.findUnique({
      where: {
        userId_productId: {
          userId: tenant.user.id,
          productId: product.id,
        },
      },
    });

    if (custom) {
      effectivePrice = custom.customPrice;
      isCustomPrice = true;
    }
  }

  const primaryColor = tenant?.user?.primaryColor || "#0f766e";
  const tenantQuery = tenant?.isTenant && tenant?.slug ? `?tenant=${tenant.slug}` : "";

  const imageList = product.images ? product.images.split(",") : [];
  const mainImage = imageList[0] || "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back Link */}
      <Link
        href={`/produits${tenantQuery}`}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Retour au catalogue
      </Link>

      <ScrollReveal direction="up">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          
          {/* Product Image */}
          <div className="rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 h-[420px] relative border border-slate-200 dark:border-slate-800">
            <img
              src={mainImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {showPrice && isCustomPrice && (
              <div className="absolute top-4 right-4 bg-sky-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-lg">
                <Tag className="w-3.5 h-3.5" /> Tarif Réduit Partenaire
              </div>
            )}
          </div>

          {/* Details & Pricing */}
          <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-semibold uppercase">
                {product.category}
              </span>

              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">{product.name}</h1>

              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Features list */}
              <div className="space-y-2 pt-2 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Formule certifiée et testée scientifiquement
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Ingrédients 100% naturels sans conservateurs artificiels
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" /> Contrôle de pureté et traçabilité biologique garantie
                </div>
              </div>
            </div>

            {/* Pricing Box & Call to Action */}
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4">
              {showPrice ? (
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl font-extrabold" style={{ color: primaryColor }}>
                    ${effectivePrice.toFixed(2)}
                  </span>
                  {isCustomPrice && (
                    <span className="text-sm text-slate-400 line-through">
                      ${product.defaultPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                  <EyeOff className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <div>
                    <strong className="text-slate-900 dark:text-white text-sm block">Prix masqué</strong>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Accédez au lien d&apos;un distributeur agréé pour voir les prix.
                    </span>
                  </div>
                </div>
              )}

              {tenant?.isTenant && tenant?.user && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-emerald-500/30 text-xs text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Conseiller: <strong>{tenant.user.name}</strong>
                  </span>
                  {tenant.user.whatsapp && (
                    <a
                      href={`https://wa.me/${tenant.user.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour ${tenant.user.name}, je souhaite commander ${product.name}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold flex items-center gap-1"
                    >
                      <Phone className="w-3.5 h-3.5" /> WhatsApp Direct
                    </a>
                  )}
                </div>
              )}

              <div className="flex gap-4">
                <a
                  href={
                    tenant?.isTenant && tenant?.user?.whatsapp
                      ? `https://wa.me/${tenant.user.whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Bonjour, je souhaite commander ${product.name}`)}`
                      : `/contacts${tenantQuery}`
                  }
                  target={tenant?.isTenant && tenant?.user?.whatsapp ? "_blank" : "_self"}
                  rel="noopener noreferrer"
                  className="w-full py-4 rounded-xl font-bold text-white shadow-xl flex items-center justify-center gap-2 transition-transform hover:scale-105"
                  style={{ backgroundColor: primaryColor }}
                >
                  <ShoppingCart className="w-5 h-5" /> Passer Commande
                </a>
              </div>
            </div>

          </div>

        </div>
      </ScrollReveal>
    </div>
  );
}
