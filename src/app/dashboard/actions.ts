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
  const theme = formData.get("theme") as string;

  // TenantConfig fields
  const orgName = formData.get("orgName") as string;
  const orgDescription = formData.get("orgDescription") as string;
  const orgLogo = formData.get("orgLogo") as string;
  const favicon = formData.get("favicon") as string;
  const secondaryColor = formData.get("secondaryColor") as string;
  const headerColor = formData.get("headerColor") as string;
  const accentColor = formData.get("accentColor") as string;
  const sidebarBgColor = formData.get("sidebarBgColor") as string;
  const sidebarTextColor = formData.get("sidebarTextColor") as string;
  const footerColor = formData.get("footerColor") as string;
  const dashboardBgColor = formData.get("dashboardBgColor") as string;
  const buttonColor = formData.get("buttonColor") as string;
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

  const dataToUpdate: any = {};
  if (name !== null && name !== undefined) dataToUpdate.name = name;
  if (email !== null && email !== undefined && email.trim() !== "") dataToUpdate.email = email;
  if (avatar !== null && avatar !== undefined) dataToUpdate.avatar = avatar;
  if (bio !== null && bio !== undefined) dataToUpdate.bio = bio;
  if (contactPhone !== null && contactPhone !== undefined) dataToUpdate.contactPhone = contactPhone;
  if (contactEmail !== null && contactEmail !== undefined) dataToUpdate.contactEmail = contactEmail;
  if (contactAddress !== null && contactAddress !== undefined) dataToUpdate.contactAddress = contactAddress;
  if (contactWebsite !== null && contactWebsite !== undefined) dataToUpdate.contactWebsite = contactWebsite;
  if (whatsapp !== null && whatsapp !== undefined) dataToUpdate.whatsapp = whatsapp;
  if (facebook !== null && facebook !== undefined) dataToUpdate.facebook = facebook;
  if (linkedin !== null && linkedin !== undefined) dataToUpdate.linkedin = linkedin;
  if (tiktok !== null && tiktok !== undefined) dataToUpdate.tiktok = tiktok;
  if (instagram !== null && instagram !== undefined) dataToUpdate.instagram = instagram;
  if (copyright !== null && copyright !== undefined) dataToUpdate.copyright = copyright;
  if (theme && ["light", "dark", "system"].includes(theme)) dataToUpdate.theme = theme;
  if (canCustomColors && primaryColor) dataToUpdate.primaryColor = primaryColor;

  await prisma.user.update({
    where: { id: userId },
    data: dataToUpdate,
  });

  try {
    await prisma.tenantConfig.upsert({
      where: { userId },
      update: {
        orgName: orgName || undefined,
        orgDescription: orgDescription || undefined,
        orgLogo: orgLogo || undefined,
        favicon: favicon !== null && favicon !== undefined ? (favicon || null) : undefined,
        secondaryColor: canCustomColors ? secondaryColor : undefined,
        headerColor: canCustomColors ? headerColor : undefined,
        accentColor: canCustomColors ? accentColor : undefined,
        sidebarBgColor: canCustomColors ? sidebarBgColor : undefined,
        sidebarTextColor: canCustomColors ? sidebarTextColor : undefined,
        footerColor: canCustomColors ? footerColor : undefined,
        dashboardBgColor: canCustomColors ? dashboardBgColor : undefined,
        buttonColor: canCustomColors ? buttonColor : undefined,
        fontFamily: canCustomFont ? fontFamily : undefined,
      },
      create: {
        userId,
        orgName,
        orgDescription,
        orgLogo,
        favicon: favicon || undefined,
        secondaryColor: canCustomColors ? secondaryColor : undefined,
        headerColor: canCustomColors ? headerColor : undefined,
        accentColor: canCustomColors ? accentColor : undefined,
        sidebarBgColor: canCustomColors ? sidebarBgColor : undefined,
        sidebarTextColor: canCustomColors ? sidebarTextColor : undefined,
        footerColor: canCustomColors ? footerColor : undefined,
        dashboardBgColor: canCustomColors ? dashboardBgColor : undefined,
        buttonColor: canCustomColors ? buttonColor : undefined,
        fontFamily: canCustomFont ? fontFamily : undefined,
      },
    });
  } catch (err: any) {
    if (err?.message?.includes("favicon")) {
      // Fallback si le client Prisma en mémoire (cache dev server / globalThis) n'a pas encore rechargé le champ
      await prisma.tenantConfig.upsert({
        where: { userId },
        update: {
          orgName: orgName || undefined,
          orgDescription: orgDescription || undefined,
          orgLogo: orgLogo || undefined,
          secondaryColor: canCustomColors ? secondaryColor : undefined,
          headerColor: canCustomColors ? headerColor : undefined,
          accentColor: canCustomColors ? accentColor : undefined,
          sidebarBgColor: canCustomColors ? sidebarBgColor : undefined,
          sidebarTextColor: canCustomColors ? sidebarTextColor : undefined,
          footerColor: canCustomColors ? footerColor : undefined,
          dashboardBgColor: canCustomColors ? dashboardBgColor : undefined,
          buttonColor: canCustomColors ? buttonColor : undefined,
          fontFamily: canCustomFont ? fontFamily : undefined,
        },
        create: {
          userId,
          orgName,
          orgDescription,
          orgLogo,
          secondaryColor: canCustomColors ? secondaryColor : undefined,
          headerColor: canCustomColors ? headerColor : undefined,
          accentColor: canCustomColors ? accentColor : undefined,
          sidebarBgColor: canCustomColors ? sidebarBgColor : undefined,
          sidebarTextColor: canCustomColors ? sidebarTextColor : undefined,
          footerColor: canCustomColors ? footerColor : undefined,
          dashboardBgColor: canCustomColors ? dashboardBgColor : undefined,
          buttonColor: canCustomColors ? buttonColor : undefined,
          fontFamily: canCustomFont ? fontFamily : undefined,
        },
      });

      // Mettre à jour directement le champ favicon via SQL pour contourner la validation du client en mémoire
      if (favicon !== undefined) {
        await prisma.$executeRawUnsafe(
          `UPDATE "TenantConfig" SET "favicon" = $1 WHERE "userId" = $2;`,
          favicon || null,
          userId
        );
      }
    } else {
      throw err;
    }
  }

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


export async function updateUserGalleryImage(
  imageId: number,
  userId: number,
  formData: FormData
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, subscriptionPlan: true },
  });

  const img = await prisma.galleryImage.findUnique({ where: { id: imageId } });
  if (!img) throw new Error("Image introuvable.");

  if (user?.role !== "SUPER_ADMIN" && img.userId !== userId) {
    throw new Error("Action non autorisée.");
  }

  const imageUrl = formData.get("imageUrl") as string;
  const caption = formData.get("caption") as string;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  await prisma.galleryImage.update({
    where: { id: imageId },
    data: {
      imageUrl: imageUrl || img.imageUrl,
      caption: caption !== undefined ? caption || null : img.caption,
      order: isNaN(order) ? img.order : order,
    },
  });

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



// --- USERNAME / TENANT CHANGE REQUESTS ---

export async function requestUsernameChange(userId: number, newUsername: string) {
  const trimmed = newUsername.trim().toLowerCase().replace(/[^a-z0-9_]/g, "");

  if (!trimmed || trimmed.length < 3) {
    throw new Error("Le nom d'utilisateur doit contenir au moins 3 caractères alphanumériques.");
  }
  if (trimmed.length > 30) {
    throw new Error("Le nom d'utilisateur ne peut pas dépasser 30 caractères.");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, slug: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");

  const currentIdentifier = user.username || user.slug;
  if (trimmed === currentIdentifier) {
    throw new Error("Le nouveau nom d'utilisateur est identique à l'actuel.");
  }

  // Check if username or slug already taken
  const existing = await prisma.user.findFirst({
    where: {
      OR: [{ username: trimmed }, { slug: trimmed }],
      NOT: { id: userId },
    },
  });
  if (existing) {
    throw new Error("Ce nom d'utilisateur est déjà utilisé par un autre compte.");
  }

  // Check existing pending request
  const pending = await (prisma as any).usernameChangeRequest.findFirst({
    where: { userId, status: "PENDING" },
  });
  if (pending) {
    throw new Error("Vous avez déjà une demande de modification en cours de révision.");
  }

  await (prisma as any).usernameChangeRequest.create({
    data: {
      userId,
      oldUsername: currentIdentifier,
      newUsername: trimmed,
      status: "PENDING",
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminApproveUsernameChange(requestId: number) {
  const request = await (prisma as any).usernameChangeRequest.findUnique({
    where: { id: requestId },
    include: { user: true },
  });

  if (!request) throw new Error("Demande introuvable.");
  if (request.status !== "PENDING") throw new Error("Cette demande a déjà été traitée.");

  // Update user username & slug (tenant identifier)
  await prisma.user.update({
    where: { id: request.userId },
    data: {
      username: request.newUsername,
      slug: request.newUsername,
    },
  });

  // Mark request as approved
  await (prisma as any).usernameChangeRequest.update({
    where: { id: requestId },
    data: { status: "APPROVED" },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true };
}


export async function adminRejectUsernameChange(requestId: number, adminNote?: string) {
  const request = await (prisma as any).usernameChangeRequest.findUnique({
    where: { id: requestId },
  });

  if (!request) throw new Error("Demande introuvable.");
  if (request.status !== "PENDING") throw new Error("Cette demande a déjà été traitée.");

  await (prisma as any).usernameChangeRequest.update({
    where: { id: requestId },
    data: {
      status: "REJECTED",
      adminNote: adminNote || "Refusé par l'administrateur",
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updateAdminSuggestionStatus(
  suggestionId: number,
  status: "NEW" | "IN_PROGRESS" | "DONE" | "REJECTED",
  adminReply?: string
) {
  await prisma.adminSuggestion.update({
    where: { id: suggestionId },
    data: {
      status: status as any,
      adminReply: adminReply || undefined,
      isRead: true,
    },
  });
  revalidatePath("/dashboard");
  return { success: true };
}


// ─────────────────────────────────────────────
// THEME PREFERENCE ACTION
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// SUBSCRIPTION ACTIONS (USER-FACING)
// ─────────────────────────────────────────────

/**
 * Utilisateur soumet une demande d'abonnement (Statut: PENDING / En attente)
 */
export async function requestUserSubscription(
  userId: number,
  plan: "STANDARD" | "SMART" | "PREMIUM",
  durationMonths: number = 1,
  notes?: string
) {
  const planEnum = SubscriptionPlan[plan];

  const sub = await prisma.subscription.create({
    data: {
      userId,
      plan: planEnum,
      status: "PENDING",
      durationMonths,
      requestedAt: new Date(),
      startDate: null,
      expiresAt: null,
      adminNotes: notes || null,
    },
  });

  // Mettre à jour l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: "PENDING" as any,
    },
  });

  // Enregistrer dans l'historique
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: sub.id,
      userId,
      plan: planEnum,
      status: "PENDING",
      action: "REQUESTED",
      notes: notes || "Demande d'abonnement soumise par l'utilisateur",
      durationMonths,
      performedBy: userId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, subscription: sub };
}

// ─────────────────────────────────────────────
// SUBSCRIPTION ACTIONS (ADMIN-FACING)
// ─────────────────────────────────────────────

/**
 * Valider une demande d'abonnement en attente
 */
export async function adminValidateSubscription(
  subscriptionId: number,
  adminId: number,
  durationMonths?: number,
  adminNotes?: string
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  const months = durationMonths || sub.durationMonths || 1;
  const startDate = new Date();
  const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "ACTIVE",
      durationMonths: months,
      startDate,
      expiresAt,
      validatedAt: new Date(),
      validatedBy: adminId,
      adminNotes: adminNotes || sub.adminNotes || "Validé par l'administrateur",
    },
  });

  // Activer l'utilisateur
  await prisma.user.update({
    where: { id: sub.userId },
    data: {
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: sub.plan,
    },
  });

  // Historique
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: sub.plan,
      status: "ACTIVE",
      action: "VALIDATED",
      notes: adminNotes || `Validé pour ${months} mois par l'administrateur`,
      performedBy: adminId,
      startDate,
      expiresAt,
      durationMonths: months,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

/**
 * Refuser une demande d'abonnement
 */
export async function adminRefuseSubscription(
  subscriptionId: number,
  adminId: number,
  reason: string
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "REFUSED",
      validatedAt: new Date(),
      validatedBy: adminId,
      adminNotes: reason,
    },
  });

  // Vérifier si l'utilisateur a un autre abonnement actif
  const otherActive = await prisma.subscription.findFirst({
    where: { userId: sub.userId, status: "ACTIVE" },
  });

  if (!otherActive) {
    await prisma.user.update({
      where: { id: sub.userId },
      data: {
        subscriptionStatus: "REFUSED" as any,
      },
    });
  }

  // Historique
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: sub.plan,
      status: "REFUSED",
      action: "REFUSED",
      notes: reason || "Demande refusée par l'administrateur",
      performedBy: adminId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

/**
 * Suspendre un abonnement actif
 */
export async function adminSuspendSubscription(
  subscriptionId: number,
  adminId: number,
  reason?: string
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "SUSPENDED",
      adminNotes: reason || sub.adminNotes,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: {
      subscriptionStatus: "SUSPENDED" as any,
    },
  });

  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: sub.plan,
      status: "SUSPENDED",
      action: "SUSPENDED",
      notes: reason || "Abonnement suspendu par l'administrateur",
      performedBy: adminId,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

/**
 * Réactiver un abonnement suspendu ou expiré
 */
export async function adminReactivateSubscription(
  subscriptionId: number,
  adminId: number
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  // Si expiré, renouveler la date de fin à partir de maintenant
  let expiresAt = sub.expiresAt;
  if (!expiresAt || expiresAt < new Date()) {
    const months = sub.durationMonths || 1;
    expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000);
  }

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "ACTIVE",
      expiresAt,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: {
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: sub.plan,
    },
  });

  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: sub.plan,
      status: "ACTIVE",
      action: "ACTIVATED",
      notes: "Abonnement réactivé par l'administrateur",
      performedBy: adminId,
      expiresAt,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

/**
 * Prolonger un abonnement
 */
export async function adminExtendSubscription(
  subscriptionId: number,
  adminId: number,
  extraMonths: number = 1,
  notes?: string
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  const currentExpires = sub.expiresAt && sub.expiresAt > new Date() ? sub.expiresAt : new Date();
  const newExpires = new Date(currentExpires.getTime() + extraMonths * 30 * 24 * 60 * 60 * 1000);
  const newDuration = (sub.durationMonths || 1) + extraMonths;

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: {
      status: "ACTIVE",
      expiresAt: newExpires,
      durationMonths: newDuration,
    },
  });

  await prisma.user.update({
    where: { id: sub.userId },
    data: {
      subscriptionStatus: "ACTIVE",
      subscriptionPlan: sub.plan,
    },
  });

  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: sub.plan,
      status: "ACTIVE",
      action: "EXTENDED",
      notes: notes || `Prolongé de ${extraMonths} mois par l'administrateur`,
      performedBy: adminId,
      expiresAt: newExpires,
      durationMonths: extraMonths,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

/**
 * Attribuer ou créer directement un abonnement pour un utilisateur (Admin)
 */
export async function adminDirectAssignSubscription(
  adminId: number,
  targetUserId: number,
  plan: "STANDARD" | "SMART" | "PREMIUM",
  durationMonths: number = 1,
  status: "ACTIVE" | "PENDING" = "ACTIVE",
  notes?: string
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const planEnum = SubscriptionPlan[plan];
  const startDate = status === "ACTIVE" ? new Date() : null;
  const expiresAt = status === "ACTIVE" ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000) : null;

  const sub = await prisma.subscription.create({
    data: {
      userId: targetUserId,
      plan: planEnum,
      status,
      durationMonths,
      requestedAt: new Date(),
      startDate,
      expiresAt,
      validatedAt: status === "ACTIVE" ? new Date() : null,
      validatedBy: status === "ACTIVE" ? adminId : null,
      adminNotes: notes || "Attribution directe par l'administrateur",
    },
  });

  await prisma.user.update({
    where: { id: targetUserId },
    data: {
      subscriptionStatus: status as any,
      subscriptionPlan: status === "ACTIVE" ? planEnum : null,
    },
  });

  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId: sub.id,
      userId: targetUserId,
      plan: planEnum,
      status,
      action: status === "ACTIVE" ? "VALIDATED" : "REQUESTED",
      notes: notes || "Attribution directe par l'administrateur",
      performedBy: adminId,
      startDate,
      expiresAt,
      durationMonths,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: sub };
}

/**
 * Modifier un abonnement (Admin)
 */
export async function adminUpdateSubscription(
  subscriptionId: number,
  adminId: number,
  data: {
    plan?: "STANDARD" | "SMART" | "PREMIUM";
    status?: string;
    durationMonths?: number;
    expiresAtStr?: string;
    adminNotes?: string;
  }
) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }

  const sub = await prisma.subscription.findUnique({
    where: { id: subscriptionId },
  });
  if (!sub) throw new Error("Abonnement introuvable.");

  const updateData: any = {};
  if (data.plan) updateData.plan = SubscriptionPlan[data.plan];
  if (data.status) updateData.status = data.status;
  if (data.durationMonths !== undefined) updateData.durationMonths = data.durationMonths;
  if (data.expiresAtStr) updateData.expiresAt = new Date(data.expiresAtStr);
  if (data.adminNotes !== undefined) updateData.adminNotes = data.adminNotes;

  const updatedSub = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: updateData,
  });

  // Mettre à jour le statut utilisateur si le statut ou plan change
  if (data.status || data.plan) {
    await prisma.user.update({
      where: { id: sub.userId },
      data: {
        subscriptionStatus: (data.status || sub.status) as any,
        subscriptionPlan: data.status === "ACTIVE" || (!data.status && sub.status === "ACTIVE")
          ? (data.plan ? SubscriptionPlan[data.plan] : sub.plan)
          : null,
      },
    });
  }

  // Historique
  await prisma.subscriptionHistory.create({
    data: {
      subscriptionId,
      userId: sub.userId,
      plan: data.plan ? SubscriptionPlan[data.plan] : sub.plan,
      status: data.status || sub.status,
      action: "MODIFIED",
      notes: data.adminNotes || "Abonnement modifié manuellement par l'administrateur",
      performedBy: adminId,
      expiresAt: updateData.expiresAt || sub.expiresAt,
      durationMonths: data.durationMonths || sub.durationMonths,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/users");
  return { success: true, subscription: updatedSub };
}

// ─────────────────────────────────────────────
// THEME PREFERENCE ACTION
// ─────────────────────────────────────────────

export async function updateUserTheme(userId: number, theme: "light" | "dark" | "system") {
  if (!["light", "dark", "system"].includes(theme)) {
    throw new Error("Thème invalide.");
  }
  await prisma.user.update({
    where: { id: userId },
    data: { theme },
  });
  revalidatePath("/dashboard");
  return { success: true, theme };
}

