import { NextRequest, NextResponse } from "next/server";
import { recordTenantDeviceVisit } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { tenantSlug, deviceId, deviceType, os, browser, path } = body;

    if (!tenantSlug) {
      return NextResponse.json({ error: "Missing tenantSlug" }, { status: 400 });
    }

    await recordTenantDeviceVisit({
      tenantSlug,
      deviceId,
      deviceType,
      os,
      browser,
      path,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

