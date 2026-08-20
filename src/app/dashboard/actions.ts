"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// --- USER PROFILE ACTIONS ---
export async function updateUserProfile(userId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const avatar = formData.get("avatar") as string;
  const bio = formData.get("bio") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const primaryColor = formData.get("primaryColor") as string;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      avatar,
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

// --- CAROUSEL ACTIONS ---
export async function addUserCarouselItem(userId: number | null, formData: FormData) {
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

export async function deleteCarouselItem(itemId: number) {
  await prisma.carouselItem.delete({
    where: { id: itemId },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateCarouselItem(itemId: number, formData: FormData) {
  const title = formData.get("title") as string;
  const subtitle = formData.get("subtitle") as string;
  const imageUrl = formData.get("imageUrl") as string;
  const link = formData.get("link") as string;

  await prisma.carouselItem.update({
    where: { id: itemId },
    data: {
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

// --- TESTIMONIAL ACTIONS ---
export async function addUserTestimonial(userId: number | null, formData: FormData) {
  const authorName = formData.get("authorName") as string;
  const content = formData.get("content") as string;
  const rating = parseInt((formData.get("rating") as string) || "5", 10);
  const avatar = formData.get("avatar") as string;
  const productIdRaw = formData.get("productId") as string;
  const isPublicRaw = formData.get("isPublic") as string;

  const productId = productIdRaw ? parseInt(productIdRaw, 10) : null;
  const isPublic = isPublicRaw === "false" || isPublicRaw === "0" ? false : true;

  await prisma.testimonial.create({
    data: {
      userId,
      productId: isNaN(productId as number) ? null : productId,
      authorName,
      content,
      rating,
      avatar,
      isPublic,
    },
  });

  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateTestimonial(testimonialId: number, formData: FormData) {
  const authorName = formData.get("authorName") as string;
  const content = formData.get("content") as string;
  const rating = parseInt((formData.get("rating") as string) || "5", 10);
  const avatar = formData.get("avatar") as string;
  const productIdRaw = formData.get("productId") as string;
  const isPublicRaw = formData.get("isPublic") as string;

  const productId = productIdRaw ? parseInt(productIdRaw, 10) : null;
  const isPublic = isPublicRaw === "false" || isPublicRaw === "0" ? false : true;

  await prisma.testimonial.update({
    where: { id: testimonialId },
    data: {
      authorName,
      content,
      rating,
      avatar,
      productId: isNaN(productId as number) ? null : productId,
      isPublic,
    },
  });

  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTestimonial(testimonialId: number) {
  await prisma.testimonial.delete({
    where: { id: testimonialId },
  });

  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleTestimonialPublicity(testimonialId: number, isPublic: boolean) {
  await prisma.testimonial.update({
    where: { id: testimonialId },
    data: { isPublic },
  });

  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- SUPER ADMIN: USER MANAGEMENT ---
export async function createUserByAdmin(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;
  const role = (formData.get("role") as "SUPER_ADMIN" | "USER") || "USER";
  const subscriptionStatus = (formData.get("subscriptionStatus") as "FREE" | "ACTIVE") || "FREE";

  const passwordHash = await bcrypt.hash(password || "Pass12345", 10);
  const slug = username.toLowerCase().replace(/[^a-z0-9]/g, "_");

  await prisma.user.create({
    data: {
      name,
      email,
      username: username.toLowerCase(),
      slug,
      password: passwordHash,
      role,
      subscriptionStatus,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateUserByAdmin(targetUserId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as "SUPER_ADMIN" | "USER";
  const subscriptionStatus = formData.get("subscriptionStatus") as "FREE" | "ACTIVE";

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      name,
      email,
      role,
      subscriptionStatus,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUserByAdmin(targetUserId: number) {
  await prisma.user.delete({
    where: { id: targetUserId },
  });

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

export async function updateUserSubscriptionDetails(
  userId: number,
  status: "FREE" | "ACTIVE",
  plan: "PRO" | "VITRINE" | "TUNNEL",
  expiresAtStr?: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: status,
    },
  });

  const expiresAt = expiresAtStr ? new Date(expiresAtStr) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000);

  const existingSub = await prisma.subscription.findFirst({
    where: { userId },
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        status: status === "ACTIVE" ? "ACTIVE" : "EXPIRED",
        plan,
        expiresAt,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId,
        status: status === "ACTIVE" ? "ACTIVE" : "EXPIRED",
        plan,
        expiresAt,
      },
    });
  }

  revalidatePath("/dashboard");
  return { success: true };
}

// --- SUPER ADMIN: PRODUCT MANAGEMENT ---
export async function createGlobalProduct(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const defaultPrice = parseFloat(formData.get("defaultPrice") as string);
  const category = formData.get("category") as string;
  const images = formData.get("images") as string;
  const isVisibleRaw = formData.get("isVisible") as string;

  const isVisible = isVisibleRaw === "false" || isVisibleRaw === "0" ? false : true;

  await prisma.product.create({
    data: {
      name,
      description,
      defaultPrice,
      category,
      images,
      isVisible,
    },
  });

  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateGlobalProduct(productId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const defaultPrice = parseFloat(formData.get("defaultPrice") as string);
  const category = formData.get("category") as string;
  const images = formData.get("images") as string;
  const isVisibleRaw = formData.get("isVisible") as string;

  const isVisible = isVisibleRaw === "false" || isVisibleRaw === "0" ? false : true;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      defaultPrice,
      category,
      images,
      isVisible,
    },
  });

  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleProductVisibility(productId: number, isVisible: boolean) {
  await prisma.product.update({
    where: { id: productId },
    data: { isVisible },
  });

  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteGlobalProduct(productId: number) {
  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}
