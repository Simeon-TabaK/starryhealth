"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

// --- SUBSCRIPTION MANAGEMENT ACTIONS ---
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

