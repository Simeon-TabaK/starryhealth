"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

// --- MEDIA, GALLERY, TESTIMONIALS & PARTNERS ACTIONS ---
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

