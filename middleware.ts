import { NextResponse, type NextRequest } from "next/server";

const CANONICAL_HOST = "www.g-products.store";

/**
 * Drop garbage Server Action probes (e.g. next-action: "x" / "y") that scanners
 * send while hunting for known Next.js CVEs. Real action IDs are long hashes.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const proto = request.headers.get("x-forwarded-proto") ?? "https";

  // One hostname for cookies — apex forwards here so login sticks on mobile.
  if (
    host === "g-products.store" &&
    process.env.NODE_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.protocol = proto.endsWith(":") ? proto : `${proto}:`;
    url.host = CANONICAL_HOST;
    return NextResponse.redirect(url, 308);
  }

  if (request.method === "POST") {
    const actionId = request.headers.get("next-action");
    if (actionId !== null && actionId.length < 16) {
      return new NextResponse(null, { status: 400 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
