import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order" };

function waLink(phone: string, ref: string) {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "26" + p;
  else if (p.startsWith("9") || p.startsWith("7")) p = "260" + p;
  const text = encodeURIComponent(
    `Hello, regarding your G-Products order ${ref}:`
  );
  return `https://wa.me/${p}?text=${text}`;
}

export default async function OrderDetail({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: true }
  });
  if (!order) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin/orders" className="hover:text-white">
          Orders
        </Link>
        <span>/</span>
        <span className="font-mono text-white/70">{order.ref}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Items</h2>
            <div className="mt-4 space-y-2">
              {order.items.map((i) => (
                <div
                  key={i.id}
                  className="flex justify-between text-sm text-white/70"
                >
                  <span>
                    {i.name} x{i.qty}
                  </span>
                  <span>{formatPrice(i.price * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between border-t border-ink-800 pt-4 text-lg font-black text-white">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </section>

          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Customer</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/50">Name</dt>
                <dd className="text-white/80">{order.customerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Phone</dt>
                <dd className="text-white/80">{order.customerPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Address</dt>
                <dd className="text-white/80">{order.address || "-"}</dd>
              </div>
            </dl>
            <a
              href={waLink(order.customerPhone, order.ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              Message customer on WhatsApp
            </a>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Payment</h2>
            <p className="mt-2 text-sm text-white/60">
              Method:{" "}
              <span className="text-white">
                {order.paymentMethod.toUpperCase()}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              Status:{" "}
              <span className="text-white">{order.paymentStatus}</span>
            </p>
            {order.paymentRef && (
              <p className="mt-1 break-all text-xs text-white/40">
                Ref: {order.paymentRef}
              </p>
            )}
          </section>

          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Update status</h2>
            <OrderStatusForm orderId={order.id} currentStatus={order.status} />
          </section>
        </div>
      </div>
    </div>
  );
}
