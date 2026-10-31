"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

// --- SUGGESTIONS & TENANT CHANGE REQUESTS ACTIONS ---
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
