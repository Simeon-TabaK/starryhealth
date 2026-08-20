import { prisma } from "./prisma";

export interface TenantContext {
  isTenant: boolean;
  slug: string | null;
  user: {
    id: number;
    name: string | null;
    email: string;
    slug: string;
    role: string;
    subscriptionStatus: "FREE" | "ACTIVE";
    primaryColor: string;
    bio: string | null;
    contactPhone: string | null;
    contactEmail: string | null;
    whatsapp: string | null;
  } | null;
}

export async function getTenantContext(slug?: string | null): Promise<TenantContext> {
  if (!slug || slug === "www" || slug === "main" || slug === "starryhealth") {
    return {
      isTenant: false,
      slug: null,
      user: null,
    };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { slug: slug.toLowerCase() },
      select: {
        id: true,
        name: true,
        email: true,
        slug: true,
        role: true,
        subscriptionStatus: true,
        primaryColor: true,
        bio: true,
        contactPhone: true,
        contactEmail: true,
        whatsapp: true,
      },
    });

    if (!user) {
      return {
        isTenant: false,
        slug: null,
        user: null,
      };
    }

    return {
      isTenant: true,
      slug: user.slug,
      user,
    };
  } catch (error) {
    console.error("Error fetching tenant context:", error);
    return {
      isTenant: false,
      slug: null,
      user: null,
    };
  }
}

export async function getCarouselItems(userId?: number | null) {
  try {
    if (userId) {
      const customItems = await prisma.carouselItem.findMany({
        where: { userId },
        orderBy: { order: "asc" },
      });
      if (customItems.length > 0) return customItems;
    }

    // Default global items
    return await prisma.carouselItem.findMany({
      where: { userId: null },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching carousel items:", error);
    return [];
  }
}

export async function getProductsForTenant(tenant?: TenantContext | null) {
  try {
    const products = await prisma.product.findMany({
      where: { isVisible: true },
      orderBy: { createdAt: "desc" },
    });

    // No tenant/slug => hide prices entirely
    if (!tenant || !tenant.isTenant || !tenant.user) {
      return products.map((p) => ({
        ...p,
        effectivePrice: p.defaultPrice,
        isCustomPrice: false,
        showPrice: false,
      }));
    }

    // Tenant exists but no ACTIVE subscription => show default prices
    if (tenant.user.subscriptionStatus !== "ACTIVE") {
      return products.map((p) => ({
        ...p,
        effectivePrice: p.defaultPrice,
        isCustomPrice: false,
        showPrice: true,
      }));
    }

    // ACTIVE subscription => apply custom prices if set
    const customPrices = await prisma.userProductPrice.findMany({
      where: { userId: tenant.user.id },
    });

    const priceMap = new Map<number, number>();
    customPrices.forEach((cp) => priceMap.set(cp.productId, cp.customPrice));

    return products.map((p) => {
      const customPrice = priceMap.get(p.id);
      const hasCustom = customPrice !== undefined && customPrice !== null;
      return {
        ...p,
        effectivePrice: hasCustom ? customPrice : p.defaultPrice,
        isCustomPrice: hasCustom,
        showPrice: true,
      };
    });
  } catch (error) {
    console.error("Error fetching products for tenant:", error);
    return [];
  }
}

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

export async function getPartners() {
  try {
    return await prisma.partner.findMany({
      orderBy: { id: "asc" },
    });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return [];
  }
}
