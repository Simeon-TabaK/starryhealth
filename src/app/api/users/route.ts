import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users — Admin only: list all users
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        slug: true,
        role: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        avatar: true,
        createdAt: true,
      },
      orderBy: { id: "asc" },
    });
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users — Register new user with default products
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, username } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email et mot de passe requis." },
        { status: 400 }
      );
    }

    // Check existing user
    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (existing) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà." },
        { status: 409 }
      );
    }

    // Generate unique slug
    const baseSlug = (username || name || email.split("@")[0])
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "_")
      .slice(0, 30);

    let uniqueSlug = baseSlug || "user";
    let count = 1;
    while (await prisma.user.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${baseSlug}_${count++}`;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        slug: uniqueSlug,
        username: username?.toLowerCase() || uniqueSlug,
        role: "USER",
        subscriptionStatus: "ACTIVE",
        subscriptionPlan: "STANDARD",
        primaryColor: "#0f766e",
      },
    });

    // Copy 5 default global products to this user
    const globalProducts = await prisma.product.findMany({
      where: { userId: null, isVisible: true },
      orderBy: { createdAt: "asc" },
      take: 5,
    });

    if (globalProducts.length > 0) {
      await Promise.all(
        globalProducts.map((p) =>
          prisma.product.create({
            data: {
              userId: user.id,
              name: p.name,
              description: p.description,
              defaultPrice: p.defaultPrice,
              originalPrice: p.originalPrice,
              images: p.images,
              category: p.category,
              isVisible: true,
            },
          })
        )
      );
    }

    return NextResponse.json(
      { message: "Compte créé avec succès", user: { id: user.id, email: user.email, slug: user.slug } },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Erreur interne du serveur." }, { status: 500 });
  }
}
