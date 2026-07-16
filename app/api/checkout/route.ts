import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { initiatePayment, type PaymentProvider } from "@/lib/payments";

type IncomingItem = {
  productId?: string;
  name: string;
  price: number;
  qty: number;
};

function newRef(): string {
  return "GP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

const PROVIDERS: PaymentProvider[] = ["mtn", "airtel", "zamtel"];

export async function POST(req: Request) {
  let body: {
    items?: IncomingItem[];
    customer?: { name?: string; phone?: string; address?: string };
    method?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const items = body.items ?? [];
  const name = body.customer?.name?.trim() ?? "";
  const phone = body.customer?.phone?.trim() ?? "";
  const address = body.customer?.address?.trim() || null;
  const method = (body.method ?? "mtn") as PaymentProvider;

  if (items.length === 0) {
    return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
  }
  if (!name || !phone) {
    return NextResponse.json(
      { error: "Name and phone are required." },
      { status: 400 }
    );
  }
  if (!PROVIDERS.includes(method)) {
    return NextResponse.json({ error: "Invalid payment method." }, { status: 400 });
  }

  // Recompute prices from the database where we can, to avoid tampering.
  const ids = items.map((i) => i.productId).filter(Boolean) as string[];
  const dbProducts = ids.length
    ? await prisma.product.findMany({ where: { id: { in: ids } } })
    : [];
  const priceById = new Map(dbProducts.map((p) => [p.id, p.price]));

  const lineItems = items.map((i) => {
    const price =
      i.productId && priceById.has(i.productId)
        ? (priceById.get(i.productId) as number)
        : Math.max(0, Math.round(i.price));
    const qty = Math.max(1, Math.round(i.qty));
    return { productId: i.productId ?? null, name: i.name, price, qty };
  });

  const total = lineItems.reduce((sum, i) => sum + i.price * i.qty, 0);

  const ref = newRef();
  const order = await prisma.order.create({
    data: {
      ref,
      customerName: name,
      customerPhone: phone,
      address,
      total,
      status: "PENDING",
      paymentMethod: method,
      paymentStatus: "PENDING",
      items: { create: lineItems }
    }
  });

  const payment = await initiatePayment({
    provider: method,
    amount: total,
    phone,
    orderRef: ref,
    description: `G-Products order ${ref}`
  });

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentRef: payment.reference ?? null,
      paymentStatus: payment.status,
      note: payment.message ?? null
    }
  });

  return NextResponse.json({
    ref,
    mode: payment.mode,
    paymentStatus: payment.status,
    message: payment.message,
    total
  });
}
