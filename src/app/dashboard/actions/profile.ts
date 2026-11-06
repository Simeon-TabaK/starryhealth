"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { SubscriptionPlan, SubscriptionStatus, Role } from "@/generated/prisma";

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
  const isActive = user?.subscriptionStatus === "ACTIVE" || isSuperAdmin;

  // Toutes les personnalisations (couleurs, police, branding) sont accessibles à tous les abonnés actifs.
  // Seules des fonctionnalités avancées supplémentaires pourraient être réservées aux plans supérieurs à l'avenir.
  const canCustomColors = isActive; // Accessible à tous les abonnés actifs
  const canCustomFont = isActive;   // Accessible à tous les abonnés actifs

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
  if (primaryColor) dataToUpdate.primaryColor = primaryColor;

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
        secondaryColor: canCustomColors ? (secondaryColor || undefined) : undefined,
        headerColor: canCustomColors ? (headerColor || undefined) : undefined,
        accentColor: canCustomColors ? (accentColor || undefined) : undefined,
        sidebarBgColor: canCustomColors ? (sidebarBgColor || undefined) : undefined,
        sidebarTextColor: canCustomColors ? (sidebarTextColor || undefined) : undefined,
        footerColor: canCustomColors ? (footerColor || undefined) : undefined,
        dashboardBgColor: canCustomColors ? (dashboardBgColor || undefined) : undefined,
        buttonColor: canCustomColors ? (buttonColor || undefined) : undefined,
        fontFamily: canCustomFont ? (fontFamily || undefined) : undefined,
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
          secondaryColor: canCustomColors ? (secondaryColor || undefined) : undefined,
          headerColor: canCustomColors ? (headerColor || undefined) : undefined,
          accentColor: canCustomColors ? (accentColor || undefined) : undefined,
          sidebarBgColor: canCustomColors ? (sidebarBgColor || undefined) : undefined,
          sidebarTextColor: canCustomColors ? (sidebarTextColor || undefined) : undefined,
          footerColor: canCustomColors ? (footerColor || undefined) : undefined,
          dashboardBgColor: canCustomColors ? (dashboardBgColor || undefined) : undefined,
          buttonColor: canCustomColors ? (buttonColor || undefined) : undefined,
          fontFamily: canCustomFont ? (fontFamily || undefined) : undefined,
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

  revalidatePath("/", "layout");
  revalidatePath("/dashboard");
  return { success: true };
}


// --- CUSTOM DOMAIN MANAGEMENT ---

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

// --- USER THEME PREFERENCE ---

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
