import prisma from "@/lib/prisma";

// export default async function handler(req, res) {
//   try {
//     const { userId } = req.query;
//     console.log(Object.keys(prisma));


//     let products;

//     if (userId) {
//       // Vérifier si l’utilisateur a un abonnement actif
//       const subscription = await prisma.subscription.findUnique({
//         where: { userId: Number(userId) },
//       });

//       const hasActiveSubscription = subscription?.active;

//       products = await prisma.product.findMany({
//         include: {
//           testimonies: true,
//           userProducts: hasActiveSubscription
//             ? {
//                 where: { userId: Number(userId) },
//                 select: {
//                   price: true, // 🔹 on affiche seulement le prix
//                 },
//               }
//             : false,
//         },
//       });
//     } else {
//       // Cas général : produits sans personnalisation
//       products = await prisma.product.findMany({
//         include: { testimonies: true },
//       });
//     }

//     res.status(200).json(products);
//   } catch (error) {
//     console.error("Erreur Prisma API /products:", error);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// }

export default async function handler(req, res) {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

