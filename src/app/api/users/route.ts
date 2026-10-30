import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// GET /api/users — Admin only: liste des utilisateurs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Administrateur requis." }, { status: 401 });
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

// POST /api/users — Création de compte (Register) avec tenant et 5 produits par défaut
export async function POST(req: Request) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Corps de requête invalide ou manquant." },
        { status: 400 }
      );
    }
    const { name, email, password, username } = body;

    // ─── Validations ────────────────────────────────────────────────────────
    if (!name || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Le nom complet doit contenir au moins 2 caractères." },
        { status: 400 }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json(
        { error: "Veuillez fournir une adresse email valide." },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // ─── Vérification de l'unicité de l'email ──────────────────────────────
    const existingEmail = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: "Un compte avec cette adresse email existe déjà." },
        { status: 409 }
      );
    }

    // ─── Gestion et vérification du tenant (username) ──────────────────────
    let finalUsername = username ? username.toLowerCase().trim().replace(/[^a-z0-9_]/g, "") : "";
    if (finalUsername) {
      if (finalUsername.length < 3) {
        return NextResponse.json(
          { error: "Le nom d'utilisateur (tenant) doit comporter au moins 3 caractères alphanumériques." },
          { status: 400 }
        );
      }
      const existingUser = await prisma.user.findUnique({
        where: { username: finalUsername },
      });
      const existingSlug = await prisma.user.findUnique({
        where: { slug: finalUsername },
      });
      if (existingUser || existingSlug) {
        return NextResponse.json(
          { error: "Ce nom d'utilisateur (identifiant tenant) est déjà réservé." },
          { status: 409 }
        );
      }
    } else {
      // Génération automatique d'un slug/username unique à partir du nom ou email
      const baseSlug = (name || normalizedEmail.split("@")[0])
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .slice(0, 30);

      let uniqueSlug = baseSlug || "user";
      let count = 1;
      while (
        (await prisma.user.findUnique({ where: { slug: uniqueSlug } })) ||
        (await prisma.user.findUnique({ where: { username: uniqueSlug } }))
      ) {
        uniqueSlug = `${baseSlug}_${count++}`;
      }
      finalUsername = uniqueSlug;
    }

    // ─── Hashage sécurisé du mot de passe ──────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ─── Création de l'utilisateur (Par défaut: FREE, sans abonnement actif) ───
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        slug: finalUsername,
        username: finalUsername,
        role: "USER",
        subscriptionStatus: "FREE",
        subscriptionPlan: null,
        primaryColor: "#0f766e",
      },
    });

    return NextResponse.json(
      {
        message: "Compte créé avec succès.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
          slug: user.slug,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json({ error: "Une erreur interne est survenue." }, { status: 500 });
  }
}
