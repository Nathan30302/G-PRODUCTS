import { NextResponse } from "next/server";
import {
  expireAllSessionCookieHeaders,
  requestAbsoluteUrl
} from "@/lib/session-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const SAFE_NEXT = new Set(["/guard/customer", "/guard/provider", "/profile"]);

function safeNext(raw: string): string {
  return SAFE_NEXT.has(raw) ? raw : "/guard/customer";
}

async function readNext(request: Request): Promise<string> {
  try {
    const form = await request.formData();
    return safeNext(String(form.get("next") ?? "").trim());
  } catch {
    return "/guard/customer";
  }
}

/**
 * Full-page form POST — Set-Cookie on redirect (Safari-safe).
 * JSON Accept — Set-Cookie on 200, then client hard-navigates (desk logout).
 */
export async function POST(request: Request) {
  const nextPath = await readNext(request);
  const wantsJson =
    request.headers.get("accept")?.includes("application/json") ?? false;

  if (wantsJson) {
    const res = NextResponse.json({ ok: true, next: nextPath });
    expireAllSessionCookieHeaders(res.headers);
    res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return res;
  }

  const res = NextResponse.redirect(
    requestAbsoluteUrl(request, nextPath),
    303
  );
  expireAllSessionCookieHeaders(res.headers);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}
