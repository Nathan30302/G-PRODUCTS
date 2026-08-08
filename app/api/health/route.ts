import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MIN_PRODUCTS } from "@/lib/ensure-catalog";

export const dynamic = "force-dynamic";

/** Lightweight public probe — no secrets. Useful to confirm catalog seed on Railway. */
export async function GET() {
  try {
    const [products, categories, services, users] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.serviceOffer.count(),
      prisma.user.count()
    ]);

    const ok = products >= MIN_PRODUCTS && categories > 0;

    return NextResponse.json(
      {
        ok,
        products,
        categories,
        services,
        users,
        minProducts: MIN_PRODUCTS
      },
      { status: ok ? 200 : 503 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "db error";
    return NextResponse.json(
      { ok: false, error: message },
      { status: 503 }
    );
  }
}
