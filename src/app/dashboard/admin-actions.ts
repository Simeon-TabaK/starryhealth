"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

async function assertSuperAdmin(adminId: number) {
  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { role: true },
  });
  if (admin?.role !== "SUPER_ADMIN") {
    throw new Error("Action réservée aux administrateurs.");
  }
}

// ─────────────────────────────────────────────
// PLAN CONFIG CRUD
// ─────────────────────────────────────────────

export async function adminCreatePlanConfig(
  adminId: number,
  data: {
    name: string;
    displayName: string;
    description?: string;
    monthlyPrice: number;
    quarterlyPrice?: number;
    semiAnnualPrice?: number;
    annualPrice?: number;
    features: string[];
    limits: Record<string, unknown>;
    badge?: string;
    color?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  await assertSuperAdmin(adminId);

  const plan = await prisma.subscriptionPlanConfig.create({
    data: {
      name: data.name.toUpperCase(),
      displayName: data.displayName,
      description: data.description,
      monthlyPrice: data.monthlyPrice,
      quarterlyPrice: data.quarterlyPrice,
      semiAnnualPrice: data.semiAnnualPrice,
      annualPrice: data.annualPrice,
      features: data.features as any,
      limits: data.limits as any,
      badge: data.badge,
      color: data.color,
      icon: data.icon,
      sortOrder: data.sortOrder ?? 0,
      isActive: data.isActive ?? true,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, plan };
}

export async function adminUpdatePlanConfig(
  adminId: number,
  planId: number,
  data: {
    displayName?: string;
    description?: string;
    monthlyPrice?: number;
    quarterlyPrice?: number;
    semiAnnualPrice?: number;
    annualPrice?: number;
    features?: string[];
    limits?: Record<string, unknown>;
    badge?: string;
    color?: string;
    icon?: string;
    sortOrder?: number;
    isActive?: boolean;
  }
) {
  await assertSuperAdmin(adminId);

  const updateData: any = {};
  if (data.displayName !== undefined) updateData.displayName = data.displayName;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.monthlyPrice !== undefined) updateData.monthlyPrice = data.monthlyPrice;
  if (data.quarterlyPrice !== undefined) updateData.quarterlyPrice = data.quarterlyPrice;
  if (data.semiAnnualPrice !== undefined) updateData.semiAnnualPrice = data.semiAnnualPrice;
  if (data.annualPrice !== undefined) updateData.annualPrice = data.annualPrice;
  if (data.features !== undefined) updateData.features = data.features as any;
  if (data.limits !== undefined) updateData.limits = data.limits as any;
  if (data.badge !== undefined) updateData.badge = data.badge;
  if (data.color !== undefined) updateData.color = data.color;
  if (data.icon !== undefined) updateData.icon = data.icon;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const plan = await prisma.subscriptionPlanConfig.update({
    where: { id: planId },
    data: updateData,
  });

  revalidatePath("/dashboard");
  return { success: true, plan };
}

export async function adminDeletePlanConfig(adminId: number, planId: number) {
  await assertSuperAdmin(adminId);
  await prisma.subscriptionPlanConfig.delete({ where: { id: planId } });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminTogglePlanActive(
  adminId: number,
  planId: number,
  isActive: boolean
) {
  await assertSuperAdmin(adminId);
  await prisma.subscriptionPlanConfig.update({
    where: { id: planId },
    data: { isActive },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

// ─────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────

export async function adminSuspendUser(adminId: number, userId: number, reason?: string) {
  await assertSuperAdmin(adminId);
  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionStatus: "SUSPENDED" as any },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminActivateUser(adminId: number, userId: number) {
  await assertSuperAdmin(adminId);
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("Utilisateur introuvable.");

  // Restore to ACTIVE if they have a plan, otherwise FREE
  const newStatus = user.subscriptionPlan ? "ACTIVE" : "FREE";
  await prisma.user.update({
    where: { id: userId },
    data: { subscriptionStatus: newStatus as any },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminDeleteUser(adminId: number, userId: number) {
  await assertSuperAdmin(adminId);
  if (adminId === userId) throw new Error("Vous ne pouvez pas supprimer votre propre compte.");
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/dashboard");
  return { success: true };
}

// ─────────────────────────────────────────────
// TENANT MANAGEMENT
// ─────────────────────────────────────────────

export async function adminValidateTenant(adminId: number, userId: number) {
  await assertSuperAdmin(adminId);
  await prisma.tenantConfig.update({
    where: { userId },
    data: {
      status: "ACTIVE",
      validatedAt: new Date(),
      validatedBy: adminId,
      rejectionReason: null,
    },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminSuspendTenant(
  adminId: number,
  userId: number,
  reason?: string
) {
  await assertSuperAdmin(adminId);
  await prisma.tenantConfig.update({
    where: { userId },
    data: { status: "SUSPENDED" },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminReactivateTenant(adminId: number, userId: number) {
  await assertSuperAdmin(adminId);
  await prisma.tenantConfig.update({
    where: { userId },
    data: { status: "ACTIVE", validatedAt: new Date(), validatedBy: adminId },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function adminRejectTenant(
  adminId: number,
  userId: number,
  reason: string
) {
  await assertSuperAdmin(adminId);
  await prisma.tenantConfig.update({
    where: { userId },
    data: { status: "REJECTED", rejectionReason: reason },
  });
  revalidatePath("/dashboard");
  return { success: true };
}

// ─────────────────────────────────────────────
// PRODUCT CATEGORIES (PREMIUM)
// ─────────────────────────────────────────────

export async function createProductCategory(
  userId: number,
  data: { name: string; slug: string; description?: string; parentId?: number; sortOrder?: number }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, subscriptionPlan: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");
  if (user.role !== "SUPER_ADMIN" && user.subscriptionPlan !== "PREMIUM") {
    throw new Error("La gestion des catégories est réservée aux abonnés Premium.");
  }

  const cat = await prisma.productCategory.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      parentId: data.parentId ?? null,
      sortOrder: data.sortOrder ?? 0,
      userId: user.role === "SUPER_ADMIN" ? null : userId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, category: cat };
}

export async function updateProductCategory(
  userId: number,
  catId: number,
  data: { name?: string; description?: string; parentId?: number; sortOrder?: number }
) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");

  const cat = await prisma.productCategory.findUnique({ where: { id: catId } });
  if (!cat) throw new Error("Catégorie introuvable.");
  if (user.role !== "SUPER_ADMIN" && cat.userId !== userId) {
    throw new Error("Non autorisé.");
  }

  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.parentId !== undefined) updateData.parentId = data.parentId;
  if (data.sortOrder !== undefined) updateData.sortOrder = data.sortOrder;

  await prisma.productCategory.update({ where: { id: catId }, data: updateData });
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteProductCategory(userId: number, catId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user) throw new Error("Utilisateur introuvable.");

  const cat = await prisma.productCategory.findUnique({ where: { id: catId } });
  if (!cat) throw new Error("Catégorie introuvable.");
  if (user.role !== "SUPER_ADMIN" && cat.userId !== userId) {
    throw new Error("Non autorisé.");
  }

  await prisma.productCategory.delete({ where: { id: catId } });
  revalidatePath("/dashboard");
  return { success: true };
}

