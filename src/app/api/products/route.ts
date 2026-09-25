import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: {
        isVisible: true,
        OR: [
          { userId: null },
          {
            user: {
              OR: [
                { subscriptionStatus: "ACTIVE" },
                { role: "SUPER_ADMIN" },
              ],
            },
          },
        ],
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(products);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
