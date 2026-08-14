"use me";
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateUserProfile(userId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const bio = formData.get("bio") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const primaryColor = formData.get("primaryColor") as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      bio,
      contactPhone,
      contactEmail,
      whatsapp,
      primaryColor,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCustomProductPrice(userId: number, productId: number, customPrice: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.subscriptionStatus !== "ACTIVE") {
    throw new Error("Un abonnement actif Starry Boxx est requis pour personnaliser les prix.");
  }

  await prisma.userProductPrice.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: {
      customPrice,
    },
    create: {
      userId,
      productId,
      customPrice,
    },
  });

  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addUserCarouselItem(userId: number, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const link = formData.get("link") as string;

  await prisma.carouselItem.create({
    data: {
      userId,
      title,
      subtitle,
      imageUrl,
      link,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function addUserTestimonial(userId: number, formData: FormData) {
  const authorName = formData.get("authorName") as string;
  const content = formData.get("content") as string;
  const rating = parseInt(formData.get("rating") as string || "5", 10);
  const avatar = formData.get("avatar") as string;

  await prisma.testimonial.create({
    data: {
      userId,
      authorName,
      content,
      rating,
      avatar,
    },
  });

  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleUserSubscription(userId: number, newStatus: "FREE" | "ACTIVE") {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: newStatus,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function createGlobalProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const defaultPrice = parseFloat(formData.get("defaultPrice") as string);
  const category = formData.get("category") as string;
  const images = formData.get("images") as string;

  await prisma.product.create({
    data: {
      name,
      description,
      defaultPrice,
      category,
      images,
    },
  });

  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}
