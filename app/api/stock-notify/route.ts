import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  let body: { productId?: string; variantId?: string; contact?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const productId = String(body.productId ?? "").trim();
  const variantId = String(body.variantId ?? "").trim() || null;
  const contact = String(body.contact ?? "").trim();

  if (!productId || !contact) {
    return NextResponse.json(
      { error: "Product and contact are required." },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await prisma.stockNotify.create({
    data: { productId, variantId, contact }
  });

  return NextResponse.json({ ok: true });
}
