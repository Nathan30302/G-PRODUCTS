import { NextResponse } from "next/server";
import {
  expireAllSessionCookieHeaders,
  requestAbsoluteUrl
} from "@/lib/session-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logoutRedirect(request: Request, nextPath: string): NextResponse {
  const safe =
    nextPath === "/admin/login" || nextPath === "/profile"
      ? nextPath
      : "/profile";
  const res = NextResponse.redirect(
    requestAbsoluteUrl(request, safe),
    303
  );
  expireAllSessionCookieHeaders(res.headers);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

/** Full-page form POST — Set-Cookie is applied on the redirect (Safari-safe). */
export async function POST(request: Request) {
  let nextPath = "/profile";
  try {
    const form = await request.formData();
    const next = String(form.get("next") ?? "").trim();
    if (next === "/admin/login" || next === "/profile") nextPath = next;
  } catch {
    /* no body */
  }
  return logoutRedirect(request, nextPath);
}
