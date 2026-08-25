import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCustomerSession } from "@/lib/customer-auth";
import { orderBelongsToCustomer } from "@/lib/track-access";

export async function POST(req: Request) {
  let body: {
    productSlug?: string;
    rating?: number;
    title?: string;
    body?: string;
    authorName?: string;
    orderRef?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const productSlug = body.productSlug?.trim();
  const reviewBody = body.body?.trim() ?? "";
  const rating = Math.round(Number(body.rating));
  const title = body.title?.trim() || null;
  const orderRef = body.orderRef?.trim().toUpperCase() || null;

  if (!productSlug) {
    return NextResponse.json({ error: "Pick a product." }, { status: 400 });
  }
  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1–5 stars." }, { status: 400 });
  }
  if (reviewBody.length < 8) {
    return NextResponse.json(
      { error: "Write a short review (at least a sentence)." },
      { status: 400 }
    );
  }

  const product = await prisma.product.findUnique({
    where: { slug: productSlug },
    select: { id: true, name: true, slug: true }
  });
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  const session = await getCustomerSession();
  if (!session) {
    return NextResponse.json(
      { error: "Sign in to leave a review on your account." },
      { status: 401 }
    );
  }

  const authorName = body.authorName?.trim() || session.name.trim();
  if (!authorName) {
    return NextResponse.json(
      { error: "Please enter your name." },
      { status: 400 }
    );
  }

  let verifiedPurchase = false;
  const customerId = session.id;

  if (orderRef) {
    const order = await prisma.order.findUnique({
      where: { ref: orderRef },
      include: { items: true }
    });
    if (
      order &&
      orderBelongsToCustomer(order, session) &&
      (order.paymentStatus === "SUCCESS" ||
        order.status === "PAID" ||
        order.status === "PREPARING" ||
        order.status === "READY" ||
        order.status === "DELIVERED")
    ) {
      const bought = order.items.some(
        (i) =>
          i.productId === product.id ||
          i.name.toLowerCase().includes(product.name.toLowerCase().slice(0, 12))
      );
      if (bought) verifiedPurchase = true;
    }
  } else {
    const bought = await prisma.orderItem.findFirst({
      where: {
        productId: product.id,
        order: {
          customerId,
          OR: [
            { paymentStatus: "SUCCESS" },
            { status: { in: ["PAID", "PREPARING", "READY", "DELIVERED"] } }
          ]
        }
      }
    });
    verifiedPurchase = Boolean(bought);
  }

  const review = await prisma.productReview.create({
    data: {
      productId: product.id,
      productSlug: product.slug,
      productName: product.name,
      customerId,
      authorName,
      rating,
      title,
      body: reviewBody.slice(0, 2000),
      verifiedPurchase,
      orderRef,
      published: true
    }
  });

  return NextResponse.json({ ok: true, id: review.id });
}
