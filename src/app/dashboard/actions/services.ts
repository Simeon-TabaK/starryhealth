"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

// --- SERVICES & FAQ ACTIONS ---
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


export async function updateUserService(serviceId: number, userId: number, formData: FormData) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionPlan: true, role: true },
  });

  if (user?.role !== "SUPER_ADMIN" && user?.subscriptionPlan === "STANDARD") {
    throw new Error("La modification d'offres et services est réservée aux forfaits SMART et PREMIUM.");
  }

  const service = await prisma.service.findUnique({ where: { id: serviceId } });
  if (!service || service.userId !== userId) throw new Error("Action non autorisée.");

  const name = (formData.get("name") as string) || "";
  const url = (formData.get("url") as string) || "";
  const order = parseInt((formData.get("order") as string) || "0", 10);

  const updated = await prisma.service.update({
    where: { id: serviceId },
    data: {
      name: name.trim(),
      url: url.trim() ? url.trim() : null,
      order,
    },
  });

  revalidatePath("/");
  revalidatePath("/dashboard");
  return { success: true, service: updated };
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

