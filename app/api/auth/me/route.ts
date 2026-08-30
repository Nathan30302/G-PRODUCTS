import { NextResponse } from "next/server";
import { getPublicAuth } from "@/lib/public-auth";

export const dynamic = "force-dynamic";

/** Lightweight session probe for client chrome — keeps the root layout cacheable. */
export async function GET() {
  const auth = await getPublicAuth();
  return NextResponse.json(auth);
}
