import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  DESK_COOKIE,
  sessionCookieOptions
} from "@/lib/session-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true, redirectTo: "/profile" });
  const clear = { ...sessionCookieOptions(0), maxAge: 0 };
  res.cookies.set(DESK_COOKIE, "", clear);
  res.cookies.set(CUSTOMER_COOKIE, "", clear);
  return res;
}
