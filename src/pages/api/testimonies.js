import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  try {
    const { userId, productId } = req.query;

    let testimonies;

    if (productId) {
      // 🔹 Cas produit : uniquement les témoignages liés à ce produit
      // + si userId est fourni, inclure aussi ceux de cet utilisateur sur ce produit
      testimonies = await prisma.testimony.findMany({
        where: {
          AND: [
            { productId: Number(productId) },
            userId
              ? { OR: [{ profile: { userId: Number(userId) } }, { public: true, validated: true }] }
              : { public: true, validated: true },
          ],
        },
        include: {
          profile: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              city: true,
              country: true,
              image: true,
            },
          },
          product: {
            select: {
              id: true,
              name: true,
              description: true,
            },
          },
        },
      });
    } else {
      // 🔹 Cas public + utilisateur
      testimonies = await prisma.testimony.findMany({
        where: {
          OR: [
            { public: true, validated: true },
            userId ? { profile: { userId: Number(userId) } } : {},
          ],
        },
        include: {
          profile: {
            select: {
              firstName: true,
              middleName: true,
              lastName: true,
              city: true,
              country: true,
              image: true,
            },
          },
        },
      });
    }

    // 🔹 Log côté serveur
    console.log("Résultat testimonies API:", testimonies);

    res.status(200).json(testimonies);
  } catch (error) {
    console.error("Erreur testimonies API:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}
