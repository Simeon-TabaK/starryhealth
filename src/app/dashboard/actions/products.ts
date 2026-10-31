"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

import { getProductLimit } from "@/lib/tenant";

// --- PRODUCTS ACTIONS ---
export async function createUserProduct(userId: number, formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      subscriptionStatus: true,
      subscriptionPlan: true,
    },
  });

  if (!user) throw new Error("Utilisateur introuvable.");

  const isSuperAdmin = user.role === "SUPER_ADMIN";

  // Check quota for regular users if finite quota
  if (!isSuperAdmin) {
    const quota = getProductLimit(user.subscriptionPlan);
    if (isFinite(quota)) {
      const existingCount = await prisma.product.count({
        where: { userId },
      });

      if (existingCount >= quota) {
        throw new Error(
          `Limite atteinte ! Votre forfait (${user.subscriptionPlan || "STANDARD"}) vous autorise un maximum de ${quota} produit(s). Passez à l'abonnement supérieur pour débloquer plus de produits.`
        );
      }
    }
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const defaultPrice = parseFloat((formData.get("defaultPrice") as string) || "0");
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const category = ((formData.get("category") as string) || "Santé & Bien-être").trim();
  const images = ((formData.get("images") as string) || "").trim();
  const isVisibleRaw = formData.get("isVisible") as string;
  const isVisible = isVisibleRaw === "false" || isVisibleRaw === "0" ? false : true;

  if (!name) {
    throw new Error("Le nom du produit est obligatoire.");
  }

  if (!images) {
    throw new Error("Une image principale est obligatoire pour créer ce produit.");
  }

  // Advanced fields (PREMIUM)
  const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
  const ingredients = (formData.get("ingredients") as string)?.trim() || null;
  const benefits = (formData.get("benefits") as string)?.trim() || null;
  const usage = (formData.get("usage") as string)?.trim() || null;
  const contraindications = (formData.get("contraindications") as string)?.trim() || null;
  const origin = (formData.get("origin") as string)?.trim() || null;
  const packaging = (formData.get("packaging") as string)?.trim() || null;
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || null;
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || null;
  const seoSlug = (formData.get("seoSlug") as string)?.trim() || null;
  const categoryIdRaw = formData.get("categoryId") as string;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null;

  await prisma.product.create({
    data: {
      userId: isSuperAdmin ? null : userId,
      name,
      description,
      shortDescription,
      defaultPrice,
      originalPrice,
      category,
      categoryId,
      images,
      isVisible,
      ingredients,
      benefits,
      usage,
      contraindications,
      origin,
      packaging,
      metaTitle,
      metaDescription,
      seoSlug,
    },
  });

  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateUserProduct(
  productId: number,
  userId: number,
  formData: FormData
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Produit introuvable.");

  // Super admin can edit any product; user can only edit their own
  if (user?.role !== "SUPER_ADMIN" && product.userId !== userId) {
    throw new Error("Vous n'avez pas la permission de modifier ce produit.");
  }

  const name = (formData.get("name") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const defaultPrice = parseFloat((formData.get("defaultPrice") as string) || "0");
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const category = (formData.get("category") as string)?.trim() || "Santé & Bien-être";
  const images = ((formData.get("images") as string) || "").trim();
  const isVisibleRaw = formData.get("isVisible") as string;
  const isVisible = isVisibleRaw === "false" || isVisibleRaw === "0" ? false : true;

  if (!name) {
    throw new Error("Le nom du produit est obligatoire.");
  }

  if (!images) {
    throw new Error("Une image principale est obligatoire pour enregistrer ce produit.");
  }

  // Advanced fields (PREMIUM)
  const shortDescription = (formData.get("shortDescription") as string)?.trim() || null;
  const ingredients = (formData.get("ingredients") as string)?.trim() || null;
  const benefits = (formData.get("benefits") as string)?.trim() || null;
  const usage = (formData.get("usage") as string)?.trim() || null;
  const contraindications = (formData.get("contraindications") as string)?.trim() || null;
  const origin = (formData.get("origin") as string)?.trim() || null;
  const packaging = (formData.get("packaging") as string)?.trim() || null;
  const metaTitle = (formData.get("metaTitle") as string)?.trim() || null;
  const metaDescription = (formData.get("metaDescription") as string)?.trim() || null;
  const seoSlug = (formData.get("seoSlug") as string)?.trim() || null;
  const categoryIdRaw = formData.get("categoryId") as string;
  const categoryId = categoryIdRaw ? parseInt(categoryIdRaw) : null;

  await prisma.product.update({
    where: { id: productId },
    data: {
      name,
      description,
      shortDescription,
      defaultPrice,
      originalPrice,
      category,
      categoryId,
      images,
      isVisible,
      ingredients,
      benefits,
      usage,
      contraindications,
      origin,
      packaging,
      metaTitle,
      metaDescription,
      seoSlug,
    },
  });

  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUserProduct(productId: number, userId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) throw new Error("Produit introuvable.");

  if (user?.role !== "SUPER_ADMIN" && product.userId !== userId) {
    throw new Error("Action non autorisée.");
  }

  await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

// Custom pricing for tenant on existing products
export async function updateCustomProductPrice(
  userId: number,
  productId: number,
  customPrice: number
) {
  await prisma.userProductPrice.upsert({
    where: {
      userId_productId: {
        userId,
        productId,
      },
    },
    update: { customPrice },
    create: { userId, productId, customPrice },
  });

  revalidatePath("/");
  revalidatePath("/produits");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- SERVICES & OFFERS (SMART+) ---

