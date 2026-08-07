import { NextResponse, type NextRequest } from "next/server";

/**
 * Drop garbage Server Action probes (e.g. next-action: "x" / "y") that scanners
 * send while hunting for known Next.js CVEs. Real action IDs are long hashes.
 * See: https://nextjs.org/docs/messages/failed-to-find-server-action
 */
export function middleware(request: NextRequest) {
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
    /*
     * Run on all paths except static assets / Next internals.
     * Server Actions POST to the page URL, so we must stay on app routes.
     */
    "/((?!_next/static|_next/image|favicon.ico|brand/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"
  ]
};
