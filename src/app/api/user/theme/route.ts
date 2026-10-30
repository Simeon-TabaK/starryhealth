import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "ID utilisateur invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { theme } = body;

    if (!["light", "dark", "system"].includes(theme)) {
      return NextResponse.json({ error: "Thème invalide" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { theme },
    });

    return NextResponse.json({ success: true, theme });
  } catch (error) {
    console.error("[API_USER_THEME]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

