import { NextResponse } from "next/server";
import {
  expireAllSessionCookieHeaders,
  requestAbsoluteUrl
} from "@/lib/session-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function logoutRedirect(request: Request): NextResponse {
  const res = NextResponse.redirect(
    requestAbsoluteUrl(request, "/profile"),
    303
  );
  expireAllSessionCookieHeaders(res.headers);
  res.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
  return res;
}

/** Full-page form POST — Set-Cookie is applied on the redirect (Safari-safe). */
export async function POST(request: Request) {
  return logoutRedirect(request);
}
