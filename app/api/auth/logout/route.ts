import { NextResponse } from "next/server";
import {
  CUSTOMER_COOKIE,
  DESK_COOKIE,
  clearSessionCookie
} from "@/lib/session-cookies";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const res = NextResponse.json({ ok: true, redirectTo: "/profile" });
  clearSessionCookie(res.cookies, DESK_COOKIE);
  clearSessionCookie(res.cookies, CUSTOMER_COOKIE);
  return res;
}
