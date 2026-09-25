import { prisma } from "./prisma";
import { headers } from "next/headers";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export interface TenantUser {
  id: number;
  name: string | null;
  email: string;
  slug: string;
  role: string;
  subscriptionStatus: "FREE" | "ACTIVE";
  subscriptionPlan: "STANDARD" | "SMART" | "PREMIUM" | null;
  primaryColor: string;
  bio: string | null;
  avatar: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactAddress: string | null;
  contactWebsite: string | null;
  whatsapp: string | null;
  facebook: string | null;
  linkedin: string | null;
  tiktok: string | null;
  instagram: string | null;
  copyright: string | null;
}

export interface TenantConfig {
  orgName: string | null;
  orgDescription: string | null;
  orgLogo: string | null;
  secondaryColor: string | null;
  headerColor: string | null;
  fontFamily: string | null;
}

export interface TenantContext {
  isTenant: boolean;
  slug: string | null;
  user: TenantUser | null;
  config: TenantConfig | null;
}

// ─────────────────────────────────────────────
// PLAN HELPERS
// ─────────────────────────────────────────────

export { getProductLimit, planHasFeature } from "./plans";
export type { SubscriptionPlanTier } from "./plans";

// ─────────────────────────────────────────────
// TENANT CONTEXT RESOLUTION
// ─────────────────────────────────────────────

export async function getTenantContext(
  slug?: string | null,
  customHost?: string | null
): Promise<TenantContext> {
  const empty: TenantContext = {
    isTenant: false,
    slug: null,
    user: null,
    config: null,
  };

  // Resolve by custom domain if no slug
  let resolvedSlug = slug;
  if (!resolvedSlug && customHost) {
    const customDomain = await prisma.customDomain.findUnique({
      where: { domain: customHost },
      include: { user: { select: { slug: true } } },
    });
    if (customDomain) {
      resolvedSlug = customDomain.user.slug;
    }
  }

  if (
    !resolvedSlug ||
    resolvedSlug === "www" ||
    resolvedSlug === "main" ||
    resolvedSlug === "starryhealth"
  ) {
    // Default: load the SUPER_ADMIN config as the main site
    try {
      const admin = await prisma.user.findFirst({
        where: { role: "SUPER_ADMIN" },
        select: {
          id: true,
          name: true,
          email: true,
          slug: true,
          role: true,
          subscriptionStatus: true,
          subscriptionPlan: true,
          primaryColor: true,
          bio: true,
          avatar: true,
          contactPhone: true,
          contactEmail: true,
          contactAddress: true,
          contactWebsite: true,
          whatsapp: true,
          facebook: true,
          linkedin: true,
          tiktok: true,
          instagram: true,
          copyright: true,
          tenantConfig: true,
        },
      });
      if (admin) {
        return {
          isTenant: false,
          slug: null,
          user: {
            ...admin,
            subscriptionStatus: admin.subscriptionStatus as "FREE" | "ACTIVE",
            subscriptionPlan: admin.subscriptionPlan as "STANDARD" | "SMART" | "PREMIUM" | null,
          },
          config: admin.tenantConfig
            ? {
                orgName: admin.tenantConfig.orgName,
                orgDescription: admin.tenantConfig.orgDescription,
                orgLogo: admin.tenantConfig.orgLogo,
                secondaryColor: admin.tenantConfig.secondaryColor,
                headerColor: admin.tenantConfig.headerColor,
                fontFamily: admin.tenantConfig.fontFamily,
              }
            : null,
        };
      }
    } catch {
      // silently fall through
    }
    return empty;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { slug: resolvedSlug.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        primaryColor: true,
        bio: true,
        avatar: true,
        contactPhone: true,
        contactEmail: true,
        contactAddress: true,
        contactWebsite: true,
        whatsapp: true,
        facebook: true,
        linkedin: true,
        tiktok: true,
        instagram: true,
        copyright: true,
        tenantConfig: true,
      },
    });

    if (!user) return empty;

    return {
      isTenant: true,
      slug: user.slug,
      user: {
        ...user,
        subscriptionStatus: user.subscriptionStatus as "FREE" | "ACTIVE",
        subscriptionPlan: user.subscriptionPlan as "STANDARD" | "SMART" | "PREMIUM" | null,
      },
      config: user.tenantConfig
        ? {
            orgName: user.tenantConfig.orgName,
            orgDescription: user.tenantConfig.orgDescription,
            orgLogo: user.tenantConfig.orgLogo,
            secondaryColor: user.tenantConfig.secondaryColor,
            headerColor: user.tenantConfig.headerColor,
            fontFamily: user.tenantConfig.fontFamily,
          }
        : null,
    };
  } catch (error) {
    console.error("Error fetching tenant context:", error);
    return empty;
  }
}

export async function getCurrentTenant(searchParamSlug?: string): Promise<TenantContext> {
  if (searchParamSlug) {
    return getTenantContext(searchParamSlug);
  }

  const headerList = await headers();
  const tenantSlug = headerList.get("x-tenant-slug");
  const customHost = headerList.get("x-custom-host");

  return getTenantContext(tenantSlug, customHost);
}

// ─────────────────────────────────────────────
// CAROUSEL
// ─────────────────────────────────────────────

export async function getCarouselItems(userId?: number | null) {
  try {
    if (userId) {
      const customItems = await prisma.carouselItem.findMany({
        where: { userId },
        orderBy: { order: "asc" },
      });
      if (customItems.length > 0) return customItems;
    }
    return await prisma.carouselItem.findMany({
      where: { userId: null },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// PRODUCTS
// ─────────────────────────────────────────────

export interface ProductWithPricing {
  id: number;
  name: string;
  description: string;
  defaultPrice: number;
  originalPrice: number | null;
  effectivePrice: number;
  discountPercent: number | null;
  isCustomPrice: boolean;
  images: string;
  category: string;
  userId: number | null;
}

export async function getProductsForTenant(
  tenant?: TenantContext | null
): Promise<ProductWithPricing[]> {
  try {
    const userId = tenant?.user?.id ?? null;

    // If tenant exists and HAS ACTIVE SUBSCRIPTION, load their own products
    const isSubscribed =
      tenant?.user?.subscriptionStatus === "ACTIVE" ||
      tenant?.user?.role === "SUPER_ADMIN";

    if (userId && isSubscribed) {
      const ownProducts = await prisma.product.findMany({
        where: { userId, isVisible: true },
        orderBy: { createdAt: "desc" },
      });

      if (ownProducts.length > 0) {
        // Use custom prices if ACTIVE subscription
        let customPriceMap = new Map<number, number>();
        const cps = await prisma.userProductPrice.findMany({ where: { userId } });
        cps.forEach((cp) => customPriceMap.set(cp.productId, cp.customPrice));

        return ownProducts.map((p) => {
          const customPrice = customPriceMap.get(p.id);
          const hasCustom = customPrice !== undefined;
          const effectivePrice = hasCustom ? customPrice! : p.defaultPrice;
          const origPrice = p.originalPrice ?? (hasCustom ? p.defaultPrice : null);
          const discountPercent =
            origPrice && origPrice > effectivePrice
              ? Math.round(((origPrice - effectivePrice) / origPrice) * 100)
              : null;
          return {
            ...p,
            effectivePrice,
            isCustomPrice: hasCustom,
            originalPrice: origPrice,
            discountPercent,
          };
        });
      }
    }

    // Fall back to global products (no userId)
    const products = await prisma.product.findMany({
      where: { userId: null, isVisible: true },
      orderBy: { createdAt: "desc" },
    });

    // Apply custom prices if ACTIVE tenant
    let customPriceMap = new Map<number, number>();
    if (userId && tenant?.user?.subscriptionStatus === "ACTIVE") {
      const cps = await prisma.userProductPrice.findMany({ where: { userId } });
      cps.forEach((cp) => customPriceMap.set(cp.productId, cp.customPrice));
    }

    return products.map((p) => {
      const customPrice = customPriceMap.get(p.id);
      const hasCustom = customPrice !== undefined;
      const effectivePrice = hasCustom ? customPrice! : p.defaultPrice;
      const origPrice = p.originalPrice ?? (hasCustom ? p.defaultPrice : null);
      const discountPercent =
        origPrice && origPrice > effectivePrice
          ? Math.round(((origPrice - effectivePrice) / origPrice) * 100)
          : null;
      return {
        ...p,
        effectivePrice,
        isCustomPrice: hasCustom,
        originalPrice: origPrice,
        discountPercent,
      };
    });
  } catch (error) {
    console.error("Error fetching products for tenant:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────

export async function getTestimonialsForTenant(tenant?: TenantContext | null) {
  try {
    if (tenant && tenant.isTenant && tenant.user) {
      return await prisma.testimonial.findMany({
        where: {
          isPublic: true,
          OR: [{ userId: null }, { userId: tenant.user.id }],
        },
        include: { product: true },
        orderBy: { id: "desc" },
      });
    }

    return await prisma.testimonial.findMany({
      where: { userId: null, isPublic: true },
      include: { product: true },
      orderBy: { id: "desc" },
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// PARTNERS
// ─────────────────────────────────────────────

export async function getPartners(userId?: number | null) {
  try {
    if (userId) {
      const ownPartners = await prisma.partner.findMany({
        where: { userId },
        orderBy: { id: "asc" },
      });
      if (ownPartners.length > 0) return ownPartners;
    }
    return await prisma.partner.findMany({
      where: { userId: null },
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// SERVICES (SMART+)
// ─────────────────────────────────────────────

export async function getServicesForTenant(userId?: number | null) {
  if (!userId) return [];
  try {
    return await prisma.service.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// FAQ (PREMIUM)
// ─────────────────────────────────────────────

export async function getFaqsForTenant(userId?: number | null) {
  if (!userId) return [];
  try {
    return await prisma.fAQ.findMany({
      where: { userId },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// GALLERY (PREMIUM) + FALLBACK DEFAULT
// ─────────────────────────────────────────────

export const DEFAULT_GALLERY_IMAGES = [
  {
    id: 9901,
    imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    caption: "Contrôle qualité de pointe & Recherche clinique avancée",
  },
  {
    id: 9902,
    imageUrl: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    caption: "Sélection d'extraits naturels purs et principes actifs testés",
  },
  {
    id: 9903,
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
    caption: "Accompagnement expert & Protocoles nutritionnels sur mesure",
  },
  {
    id: 9904,
    imageUrl: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&w=1200&q=80",
    caption: "Pureté et traçabilité biologique certifiée pour chaque lot",
  },
];

export async function getGalleryForTenant(userId?: number | null) {
  try {
    if (userId) {
      const userImages = await prisma.galleryImage.findMany({
        where: { userId },
        orderBy: { order: "asc" },
      });
      if (userImages.length > 0) return userImages;
    }
    // Default fallback demo gallery images if tenant has not configured any
    return DEFAULT_GALLERY_IMAGES;
  } catch (error) {
    console.error("Error fetching gallery:", error);
    return DEFAULT_GALLERY_IMAGES;
  }
}

// ─────────────────────────────────────────────
// SUBSCRIPTION PRICING
// ─────────────────────────────────────────────

export async function getSubscriptionPricing() {
  try {
    return await prisma.subscriptionPlanPricing.findMany({
      orderBy: [{ plan: "asc" }, { billingPeriod: "asc" }],
    });
  } catch (error) {
    console.error("Error fetching pricing:", error);
    return [];
  }
}

// ─────────────────────────────────────────────
// OPTIMIZED HOMEPAGE BATCH FETCH (PARALLEL EXECUTION)
// ─────────────────────────────────────────────

export async function getHomePageDataOptimized(searchParamSlug?: string) {
  const tenant = await getCurrentTenant(searchParamSlug);
  const tenantUserId = tenant?.user?.id ?? null;

  // Execute all secondary queries concurrently via Promise.all to reduce latency
  const [
    carouselItems,
    products,
    testimonials,
    partners,
    services,
    faqs,
    gallery,
  ] = await Promise.all([
    getCarouselItems(tenantUserId),
    getProductsForTenant(tenant),
    getTestimonialsForTenant(tenant),
    getPartners(tenantUserId),
    getServicesForTenant(tenantUserId),
    getFaqsForTenant(tenantUserId),
    getGalleryForTenant(tenantUserId),
  ]);

  return {
    tenant,
    carouselItems,
    products,
    testimonials,
    partners,
    services,
    faqs,
    gallery,
  };
}

