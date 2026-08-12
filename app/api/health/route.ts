import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { MIN_PRODUCTS } from "@/lib/ensure-catalog";

export const dynamic = "force-dynamic";

/** Lightweight public probe — no secrets. Useful to confirm catalog seed on Railway. */
export async function GET() {
  try {
    const [products, categories, services, users, customers] =
      await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.serviceOffer.count(),
      prisma.user.count(),
      prisma.customer.count()
    ]);

    const ok = products >= MIN_PRODUCTS && categories > 0;
    const dbPath = process.env.DATABASE_URL?.startsWith("file:")
      ? process.env.DATABASE_URL.slice("file:".length).split("?")[0]
      : null;

    return NextResponse.json(
      {
        ok,
        products,
        categories,
        services,
        users,
        customers,
        dbPath,
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
