import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{3,28}[a-z0-9]$/;

function generateAlternatives(base: string): string[] {
  const clean = base.replace(/[^a-z0-9]/g, "").slice(0, 20) || "user";
  const alts: string[] = [];
  const suffixes = [
    `-sante`, `-health`, `-${Math.floor(Math.random() * 900) + 100}`,
    `${Math.floor(Math.random() * 90) + 10}`, `-clinic`, `-pharma`,
  ];
  for (const s of suffixes) {
    const candidate = `${clean}${s}`.slice(0, 30);
    if (SLUG_REGEX.test(candidate) && !alts.includes(candidate)) {
      alts.push(candidate);
    }
    if (alts.length >= 3) break;
  }
  return alts;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = (searchParams.get("username") || "").toLowerCase().trim();

  if (!username) {
    return NextResponse.json({ available: false, error: "Paramètre manquant." });
  }

  // Format validation
  if (!SLUG_REGEX.test(username)) {
    return NextResponse.json({
      available: false,
      formatError: true,
      error: getFormatError(username),
    });
  }

  // DB check
  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { slug: username }] },
    select: { id: true },
  });

  if (existing) {
    return NextResponse.json({
      available: false,
      error: "Ce nom d'utilisateur est déjà pris.",
      suggestions: generateAlternatives(username),
    });
  }

  return NextResponse.json({ available: true });
}

function getFormatError(username: string): string {
  if (username.length < 5) return "Minimum 5 caractères requis.";
  if (username.length > 30) return "Maximum 30 caractères autorisés.";
  if (/[A-Z]/.test(username)) return "Uniquement des lettres minuscules, chiffres et tirets.";
  if (/[^a-z0-9-]/.test(username)) return "Caractères spéciaux et espaces non autorisés.";
  if (username.startsWith("-") || username.endsWith("-")) return "Ne peut pas commencer ou se terminer par un tiret.";
  return "Format invalide. Utilisez uniquement des lettres minuscules, chiffres et tirets (-).";
}
