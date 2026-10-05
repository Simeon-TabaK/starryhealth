/**
 * Starry Vitrine – Health Check endpoint
 * GET /api/health
 *
 * Utilisé par Coolify pour vérifier que le conteneur est opérationnel.
 * Retourne toujours HTTP 200 pour que Coolify ne tue pas le container.
 * Le statut de la DB est visible dans le body JSON.
 */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  const start = Date.now();

  // ─── Check DB ────────────────────────────────────────────────
  let dbStatus: "ok" | "error" = "ok";
  let dbMessage = "Connected";

  try {
    await prisma.$queryRaw`SELECT 1`;
  } catch (err) {
    dbStatus = "error";
    dbMessage = err instanceof Error ? err.message : "Unknown DB error";
  }

  const latencyMs = Date.now() - start;

  return NextResponse.json(
    {
      status: dbStatus === "ok" ? "ok" : "degraded",
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      latency_ms: latencyMs,
      version: process.env.npm_package_version ?? "0.1.0",
      checks: {
        app: { status: "ok", message: "Next.js running" },
        database: { status: dbStatus, message: dbMessage },
      },
    },
    // Toujours 200 → Coolify ne tue pas le container si la DB est momentanément down
    { status: 200 }
  );
}
