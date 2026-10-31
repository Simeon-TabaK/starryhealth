import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";
import { getTenantAnalyticsSummary } from "@/lib/analytics";

interface DashboardPageProps {
  searchParams?: Promise<{ tab?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = parseInt((session.user as any).id, 10);
  if (isNaN(userId)) {
    redirect("/auth/signin");
  }

  const sParams = searchParams ? await searchParams : {};
  const initialTab = sParams.tab || undefined;

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: true,
      tenantConfig: true,
      customDomain: true,
    },
  });

  if (!currentUser) {
    redirect("/auth/signin");
  }

  // Si l'utilisateur connecté via Google n'a pas finalisé son username / tenant
  if ((session.user as any)?.needsUsername || !currentUser.username) {
    redirect("/auth/complete-profile");
  }

  const isSuperAdmin = currentUser.role === "SUPER_ADMIN";

  // Fetch all secondary dashboard data concurrently
  const [
    userSubscription,
    ownProducts,
    globalProducts,
    customPrices,
    userCarousel,
    globalCarousel,
    userTestimonials,
    allTestimonials,
    userPartners,
    userServices,
    userFaqs,
    userGallery,
    visitorSuggestions,
    adminSuggestions,
    planPricings,
    allUsers,
    tenantChangeRequests,
    planConfigs,
    userSubscriptions,
    allSubscriptionHistory,
    categories,
  ] = await Promise.all([
    prisma.subscription.findFirst({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: isSuperAdmin ? {} : { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findMany({
      where: { userId: null },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userProductPrice.findMany({
      where: { userId: currentUser.id },
    }),
    prisma.carouselItem.findMany({
      where: { userId: currentUser.id },
      orderBy: { order: "asc" },
    }),
    prisma.carouselItem.findMany({
      where: { userId: null },
      orderBy: { order: "asc" },
    }),
    prisma.testimonial.findMany({
      where: { userId: currentUser.id },
      include: { product: true },
      orderBy: { id: "desc" },
    }),
    prisma.testimonial.findMany({
      include: { product: true, user: true },
      orderBy: { id: "desc" },
    }),
    prisma.partner.findMany({
      where: isSuperAdmin ? {} : { userId: currentUser.id },
      orderBy: { id: "asc" },
    }),
    prisma.service.findMany({
      where: { userId: currentUser.id },
      orderBy: { order: "asc" },
    }),
    prisma.fAQ.findMany({
      where: { userId: currentUser.id },
      orderBy: { order: "asc" },
    }),
    prisma.galleryImage.findMany({
      where: { userId: currentUser.id },
      orderBy: { order: "asc" },
    }),
    prisma.suggestion.findMany({
      where: isSuperAdmin ? {} : { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.adminSuggestion.findMany({
      where: isSuperAdmin ? {} : { userId: currentUser.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            slug: true,
            role: true,
            subscriptionPlan: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.subscriptionPlanPricing.findMany({
      orderBy: [{ plan: "asc" }, { billingPeriod: "asc" }],
    }),
    isSuperAdmin
      ? prisma.user.findMany({
          include: {
            subscriptions: { orderBy: { createdAt: "desc" } },
            tenantConfig: true,
            customDomain: true,
            products: true,
          },
          orderBy: { id: "asc" },
        })
      : Promise.resolve([]),
    isSuperAdmin
      ? (prisma as any).usernameChangeRequest.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                username: true,
                slug: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        })
      : (prisma as any).usernameChangeRequest.findMany({
          where: { userId: currentUser.id },
          orderBy: { createdAt: "desc" },
        }),
    ((prisma as any).subscriptionPlanConfig?.findMany
      ? (prisma as any).subscriptionPlanConfig.findMany({
          orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        })
      : Promise.resolve([])),
    prisma.subscription.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    }),
    isSuperAdmin
      ? prisma.subscriptionHistory.findMany({
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 200,
        })
      : prisma.subscriptionHistory.findMany({
          where: { userId: currentUser.id },
          orderBy: { createdAt: "desc" },
        }),
    ((prisma as any).productCategory?.findMany
      ? (prisma as any).productCategory.findMany({
          where: isSuperAdmin ? {} : { OR: [{ userId: currentUser.id }, { userId: null }] },
          orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
        })
      : Promise.resolve([])),
  ]);

  const tenantSlug = currentUser.slug || currentUser.username || undefined;
  const tenantAnalytics = tenantSlug ? await getTenantAnalyticsSummary(tenantSlug, currentUser.id) : null;

  return (
    <DashboardClient
      user={currentUser}
      userSubscription={userSubscription}
      products={ownProducts}
      globalProducts={globalProducts}
      customPrices={customPrices}
      userCarousel={userCarousel}
      globalCarousel={globalCarousel}
      userTestimonials={userTestimonials}
      allTestimonials={allTestimonials}
      partners={userPartners}
      services={userServices}
      faqs={userFaqs}
      gallery={userGallery}
      suggestions={visitorSuggestions}
      adminSuggestions={adminSuggestions}
      planPricings={planPricings}
      allUsers={allUsers}
      tenantChangeRequests={tenantChangeRequests}
      planConfigs={planConfigs}
      userSubscriptions={userSubscriptions}
      allSubscriptionHistory={allSubscriptionHistory}
      categories={categories}
      initialTab={initialTab}
      tenantAnalytics={tenantAnalytics}
    />
  );
}
