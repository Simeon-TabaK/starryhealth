import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/cloudinary/sign
// Returns a signed upload signature for direct browser-to-Cloudinary uploads.
// The client sends { folder, eager?, transformation? } and gets back the params
// needed to POST directly to Cloudinary upload endpoint (no server proxy needed).

export async function POST(request: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const folder: string = body.folder || "starryhealth/uploads";
  const eager: string | undefined = body.eager;

  const timestamp = Math.round(Date.now() / 1000);

  // Build the params string (alphabetical order, no signature/api_key)
  const params: Record<string, string> = {
    folder,
    timestamp: String(timestamp),
  };
  if (eager) params.eager = eager;

  // Cloudinary requires params sorted alphabetically, joined with &, then appended with secret
  const toSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + apiSecret;

  const signature = crypto.createHash("sha256").update(toSign).digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    ...(eager ? { eager } : {}),
  });
}
