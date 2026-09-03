import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { authorName, email, message, tenantUserId } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Le message est obligatoire." },
        { status: 400 }
      );
    }

    const suggestion = await prisma.suggestion.create({
      data: {
        authorName: authorName ? String(authorName).trim() : null,
        email: email ? String(email).trim() : null,
        message: String(message).trim(),
        userId: tenantUserId ? Number(tenantUserId) : null,
      },
    });

    return NextResponse.json({ success: true, suggestion });
  } catch (error) {
    console.error("Error creating suggestion:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur." },
      { status: 500 }
    );
  }
}
