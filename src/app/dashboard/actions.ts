"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";
import { getProductLimit } from "@/lib/tenant";

// --- USER PROFILE & TENANT CONFIG ACTIONS ---

export async function updateUserProfile(userId: number, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const avatar = formData.get("avatar") as string;
  const bio = formData.get("bio") as string;
  const contactPhone = formData.get("contactPhone") as string;
  const contactEmail = formData.get("contactEmail") as string;
  const contactAddress = formData.get("contactAddress") as string;
  const contactWebsite = formData.get("contactWebsite") as string;
  const whatsapp = formData.get("whatsapp") as string;
  const facebook = formData.get("facebook") as string;
  const linkedin = formData.get("linkedin") as string;
  const tiktok = formData.get("tiktok") as string;
  const instagram = formData.get("instagram") as string;
  const copyright = formData.get("copyright") as string;
  const primaryColor = formData.get("primaryColor") as string;

  // TenantConfig fields
  const orgName = formData.get("orgName") as string;
  const orgDescription = formData.get("orgDescription") as string;
  const orgLogo = formData.get("orgLogo") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const headerColor = formData.get("headerColor") as string;
  const fontFamily = formData.get("fontFamily") as string;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, subscriptionStatus: true, role: true },
  });

  const isSuperAdmin = user?.role === "SUPER_ADMIN";
  const plan = user?.subscriptionPlan;

  // Theme color customization requires SMART or PREMIUM (or admin)
  const canCustomColors = isSuperAdmin || plan === "SMART" || plan === "PREMIUM";
  // Typography customization requires PREMIUM (or admin)
  const canCustomFont = isSuperAdmin || plan === "PREMIUM";

  await prisma.user.update({
    where: { id: userId },
    data: {
      name,
      email,
      avatar,
      bio,
      contactPhone,
      contactEmail,
      contactAddress,
      contactWebsite,
      whatsapp,
      facebook,
      linkedin,
      tiktok,
      instagram,
      copyright,
      primaryColor: canCustomColors && primaryColor ? primaryColor : undefined,
    },
  });

  await prisma.tenantConfig.upsert({
    where: { userId },
    update: {
      orgName: orgName || undefined,
      orgDescription: orgDescription || undefined,
      orgLogo: orgLogo || undefined,
      secondaryColor: canCustomColors ? secondaryColor : undefined,
      headerColor: canCustomColors ? headerColor : undefined,
      fontFamily: canCustomFont ? fontFamily : undefined,
    },
    create: {
      userId,
      orgName,
      orgDescription,
      orgLogo,
      secondaryColor: canCustomColors ? secondaryColor : undefined,
      headerColor: canCustomColors ? headerColor : undefined,
      fontFamily: canCustomFont ? fontFamily : undefined,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- PRODUCT MANAGEMENT WITH SUBSCRIPTION QUOTA ENFORCEMENT ---

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

  // Check quota for regular users
  if (!isSuperAdmin) {
    const quota = getProductLimit(user.subscriptionPlan);
    const existingCount = await prisma.product.count({
      where: { userId },
    });

    if (existingCount >= quota) {
      throw new Error(
        `Limite atteinte ! Votre forfait (${user.subscriptionPlan || "STANDARD"}) vous autorise un maximum de ${quota} produit(s). Passez à l'abonnement supérieur pour débloquer plus de produits.`
      );
    }
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const defaultPrice = parseFloat((formData.get("defaultPrice") as string) || "0");
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
  const category = (formData.get("category") as string) || "Santé & Bien-être";
  const images = (formData.get("images") as string) || "";
  const isVisibleRaw = formData.get("isVisible") as string;
  const isVisible = isVisibleRaw === "false" || isVisibleRaw === "0" ? false : true;

  await prisma.product.create({
    data: {
      userId: isSuperAdmin ? null : userId,
      name,
      description,
      defaultPrice,
      originalPrice,
      category,
      images,
      isVisible,
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

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const defaultPrice = parseFloat((formData.get("defaultPrice") as string) || "0");
  const originalPriceRaw = formData.get("originalPrice") as string;
  const originalPrice = originalPriceRaw ? parseFloat(originalPriceRaw) : null;
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
      originalPrice,
      category,
      images,
      isVisible,
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

export async function addUserService(userId: number, formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, role: true },
  });

  if (user?.role !== "SUPER_ADMIN" && user?.subscriptionPlan === "STANDARD") {
    throw new Error("L'ajout d'offres et services est réservé aux forfaits SMART et PREMIUM.");
  }

  const name = formData.get("name") as string;
  const url = formData.get("url") as string;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  await prisma.service.create({
    data: {
      userId,
      name,
      url: url || null,
      order,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUserService(serviceId: number, userId: number) {
  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.userId !== userId) throw new Error("Action non autorisée.");

  await prisma.service.delete({ where: { id: serviceId } });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- FAQ (PREMIUM) ---

export async function addUserFaq(userId: number, formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, role: true },
  });

  if (user?.role !== "SUPER_ADMIN" && user?.subscriptionPlan !== "PREMIUM") {
    throw new Error("La section FAQ est une fonctionnalité exclusive du plan PREMIUM.");
  }

  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  await prisma.fAQ.create({
    data: {
      userId,
      question,
      answer,
      order,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUserFaq(faqId: number, userId: number) {
  const faq = await prisma.fAQ.findUnique({ where: { id: faqId } });
  if (!faq || faq.userId !== userId) throw new Error("Action non autorisée.");

  await prisma.fAQ.delete({ where: { id: faqId } });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- GALLERY (PREMIUM) ---

export async function addUserGalleryImage(userId: number, formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, role: true },
  });

  if (user?.role !== "SUPER_ADMIN" && user?.subscriptionPlan !== "PREMIUM") {
    throw new Error("La galerie d'images est une fonctionnalité exclusive du plan PREMIUM.");
  }

  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  await prisma.galleryImage.create({
    data: {
      userId,
      imageUrl,
      caption: caption || null,
      order,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteUserGalleryImage(imageId: number, userId: number) {
  const img = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!img || img.userId !== userId) throw new Error("Action non autorisée.");

  await prisma.galleryImage.delete({ where: { id: imageId } });
  revalidatePath("/");
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
  await prisma.carouselItem.delete({ where: { id: itemId } });
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
  const isPublicRaw = formData.get("isPublic") as string;

  await prisma.testimonial.create({
    data: {
      userId,
      authorName,
      content,
      rating,
      avatar,
      isPublic: isPublicRaw !== "false",
    },
  });

  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteTestimonial(testimonialId: number) {
  await prisma.testimonial.delete({ where: { id: testimonialId } });
  revalidatePath("/");
  revalidatePath("/temoignages");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- PARTNERS (STANDARD+) ---

export async function addUserPartner(userId: number | null, formData: FormData) {
  const name = formData.get("name") as string;
  const logoUrl = formData.get("logoUrl") as string;
  const website = formData.get("website") as string;

  await prisma.partner.create({
    data: {
      userId,
      name,
      logoUrl,
      website: website || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deletePartner(partnerId: number) {
  await prisma.partner.delete({ where: { id: partnerId } });
  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- CUSTOM DOMAIN (PREMIUM) ---

export async function setCustomDomain(userId: number, domain: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, role: true },
  });

  if (user?.role !== "SUPER_ADMIN" && user?.subscriptionPlan !== "PREMIUM") {
    throw new Error("La liaison d'un nom de domaine personnalisé est réservée au plan PREMIUM.");
  }

  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/$/, "");

  await prisma.customDomain.upsert({
    where: { userId },
    update: { domain: cleanDomain, verifiedAt: new Date() },
    create: { userId, domain: cleanDomain, verifiedAt: new Date() },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

// --- ADMIN USER & SUBSCRIPTION MANAGEMENT ---

export async function updateUserSubscriptionDetails(
  userId: number,
  status: "FREE" | "ACTIVE" | "PENDING" | "EXPIRED",
  plan: "STANDARD" | "SMART" | "PREMIUM",
  expiresAtStr?: string
) {
  return adminManualActivateSubscription(userId, plan, status, undefined, expiresAtStr);
}

export async function adminManualActivateSubscription(
  userId: number,
  plan: "STANDARD" | "SMART" | "PREMIUM",
  status: "FREE" | "ACTIVE" | "PENDING" | "EXPIRED",
  startDateStr?: string,
  expiresAtStr?: string
) {
  const planEnum = SubscriptionPlan[plan];
  const statusEnum = SubscriptionStatus[status];

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: statusEnum,
      subscriptionPlan: status === "ACTIVE" ? planEnum : null,
    },
  });

  const startDate = startDateStr ? new Date(startDateStr) : new Date();
  const expiresAt = expiresAtStr
    ? new Date(expiresAtStr)
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  const existingSub = await prisma.subscription.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  if (existingSub) {
    await prisma.subscription.update({
      where: { id: existingSub.id },
      data: {
        status,
        plan: planEnum,
        startDate,
        expiresAt,
      },
    });
  } else {
    await prisma.subscription.create({
      data: {
        userId,
        status,
        plan: planEnum,
        startDate,
        expiresAt,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true };
}

// --- ADMIN SUGGESTIONS (Subscribers -> Starry Health Admin) ---

export async function sendAdminSuggestion(userId: number, formData: FormData) {
  const subject = formData.get("subject") as string;
  const message = formData.get("message") as string;

  if (!subject?.trim() || !message?.trim()) {
    throw new Error("Le sujet et le message sont obligatoires.");
  }

  await prisma.adminSuggestion.create({
    data: {
      userId,
      subject: subject.trim(),
      message: message.trim(),
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function toggleAdminSuggestionRead(suggestionId: number, isRead: boolean) {
  await prisma.adminSuggestion.update({
    where: { id: suggestionId },
    data: { isRead },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteAdminSuggestion(suggestionId: number) {
  await prisma.adminSuggestion.delete({
    where: { id: suggestionId },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

