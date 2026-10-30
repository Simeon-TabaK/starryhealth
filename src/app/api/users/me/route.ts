import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$/;

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
    }

    const userId = parseInt((session.user as any).id, 10);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Session invalide." }, { status: 401 });
    }

    const body = await req.json();
    const { username, slug } = body;

    const cleanedUsername = (username || slug || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");

    if (!cleanedUsername || !SLUG_REGEX.test(cleanedUsername)) {
      return NextResponse.json(
        { error: "Format d'identifiant invalide." },
        { status: 400 }
      );
    }

    // Check uniqueness (exclude current user)
    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ username: cleanedUsername }, { slug: cleanedUsername }],
        NOT: { id: userId },
      },
    });
    if (existing) {
      return NextResponse.json(
        { error: "Cet identifiant est déjà utilisé." },
        { status: 409 }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: { username: cleanedUsername, slug: cleanedUsername },
    });

    return NextResponse.json({
      success: true,
      username: cleanedUsername,
      slug: cleanedUsername,
    });
  } catch (error: any) {
    console.error("[PATCH_ME_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne." }, { status: 500 });
  }
}
