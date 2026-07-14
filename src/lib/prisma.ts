import { PrismaClient } from "@prisma/client";

// 1. Sécurité : Empêcher absolument d'importer ce fichier côté client (navigateur)
if (typeof window !== 'undefined') {
  throw new Error("N'importez pas prisma.ts dans un composant client (use client) !");
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(); // ✅ on instancie bien le client

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
