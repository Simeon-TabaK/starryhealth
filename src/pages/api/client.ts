// src/pages/api/client.ts
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { code, subdomain } = req.query;

    if (!code && !subdomain) {
      return res.status(400).json({ error: "Code ou sous-domaine requis" });
    }

    const clientAccess = await prisma.clientAccess.findUnique({
      where: code ? { code: String(code) } : { subdomain: String(subdomain) },
      include: {
        user: {
          include: {
            profile: {
              include: {
                products: { include: { product: true } },
                carousel: { include: { default: true } },
                testimonies: true,
              },
            },
            subscription: { include: { plan: true } },
          },
        },
      },
    });

    if (!clientAccess) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    return res.status(200).json(clientAccess.user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur" });
  }
}
