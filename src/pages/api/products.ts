import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  const products = await prisma.product.findMany();
  res.status(200).json(products);
}
