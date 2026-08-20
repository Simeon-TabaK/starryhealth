import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    redirect("/auth/signin");
  }

  const userId = parseInt((session.user as any).id, 10);
  if (isNaN(userId)) {
    redirect("/auth/signin");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: true,
    },
  });

  if (!currentUser) {
    redirect("/auth/signin");
  }

  const userSubscription = await prisma.subscription.findFirst({
    where: { userId: currentUser.id },
    orderBy: { createdAt: "desc" },
  });

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const customPrices = await prisma.userProductPrice.findMany({
    where: { userId: currentUser.id },
  });

  const userCarousel = await prisma.carouselItem.findMany({
    where: { userId: currentUser.id },
    orderBy: { order: "asc" },
  });

  const globalCarousel = await prisma.carouselItem.findMany({
    where: { userId: null },
    orderBy: { order: "asc" },
  });

  const userTestimonials = await prisma.testimonial.findMany({
    where: { userId: currentUser.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });

  const allTestimonials = await prisma.testimonial.findMany({
    include: { product: true, user: true },
    orderBy: { id: "desc" },
  });

  let allUsers: any[] = [];
  if (currentUser.role === "SUPER_ADMIN") {
    allUsers = await prisma.user.findMany({
      include: { subscriptions: true },
      orderBy: { id: "asc" },
    });
  }

  return (
    <DashboardClient
      user={currentUser}
      userSubscription={userSubscription}
      products={products}
      customPrices={customPrices}
      userCarousel={userCarousel}
      globalCarousel={globalCarousel}
      userTestimonials={userTestimonials}
      allTestimonials={allTestimonials}
      allUsers={allUsers}
    />
  );
}
