import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

// POST /api/cloudinary/sign
// Returns a signed upload signature for direct browser-to-Cloudinary uploads.
// Cloudinary expects SHA-1 by default for signed uploads:
// String to sign = sorted key=value pairs joined with '&' + api_secret (no '&' before secret).

export async function POST(request: NextRequest) {
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const cloudName =
    process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME;

  if (!apiSecret || !apiKey || !cloudName) {
    return NextResponse.json(
      { error: "Configuration Cloudinary incomplète (API Secret, Key ou Cloud Name manquant)." },
      { status: 500 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const folder: string = body.folder || "starryhealth/uploads";
  const eager: string | undefined = body.eager;

  const timestamp = Math.round(Date.now() / 1000);

  // Build the params object to sign (alphabetical order, no signature/api_key)
  const params: Record<string, string> = {
    folder,
    timestamp: String(timestamp),
  };
  if (eager) params.eager = eager;

  // Cloudinary requires params sorted alphabetically, joined with &, then appended with secret (no separator)
  const toSign =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + apiSecret;

  // Cloudinary standard signature algorithm is SHA-1
  const signature = crypto.createHash("sha1").update(toSign).digest("hex");

  return NextResponse.json({
    signature,
    timestamp,
    apiKey,
    cloudName,
    folder,
    ...(eager ? { eager } : {}),
  });
}
