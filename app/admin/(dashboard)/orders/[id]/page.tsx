import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { OrderStatusForm } from "@/components/admin/OrderStatusForm";
import {
  DeskHero,
  DeskPanel,
  DeskPanelHeader,
  StatusPill
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Order" };

const FLOW = ["PENDING", "PAID", "PREPARING", "READY", "DELIVERED"] as const;

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

  const flowIndex = FLOW.indexOf(order.status as (typeof FLOW)[number]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gp-text-subtle">
        <Link href="/admin/orders" className="hover:text-gp-text">
          Orders
        </Link>
        <span>/</span>
        <span className="font-mono text-gp-text-muted">{order.ref}</span>
      </div>

      <DeskHero>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-ink">
              Order
            </p>
            <h1 className="display mt-2 font-mono text-3xl sm:text-4xl">
              {order.ref}
            </h1>
            <p className="mt-2 text-sm text-gp-text-muted">
              Placed {formatDateTime(order.createdAt)} ·{" "}
              {order.customerName}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <StatusPill status={order.status} />
              <StatusPill status={order.paymentStatus} kind="payment" />
              <span className="rounded-pill border border-gp-border bg-gp-muted/50 px-2.5 py-1 text-xs font-semibold text-gp-text-muted">
                {order.paymentMethod.toUpperCase()}
              </span>
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
              Total
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-gp-text">
              {formatPrice(order.total)}
            </p>
            <a
              href={waLink(order.customerPhone, order.ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              WhatsApp customer
            </a>
          </div>
        </div>

        {order.status !== "CANCELLED" ? (
          <div className="mt-8 flex flex-wrap gap-2">
            {FLOW.map((step, i) => {
              const done = flowIndex >= 0 && i <= flowIndex;
              const current = order.status === step;
              return (
                <div
                  key={step}
                  className={`rounded-pill border px-3 py-1.5 text-[11px] font-bold tracking-wide ${
                    current
                      ? "border-brand/50 bg-brand/15 text-accent-ink"
                      : done
                        ? "border-accent/30 bg-accent/10 text-accent"
                        : "border-gp-border text-gp-text-subtle"
                  }`}
                >
                  {step}
                </div>
              );
            })}
          </div>
        ) : null}
      </DeskHero>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DeskPanel>
            <DeskPanelHeader title="Items" />
            <div className="divide-y divide-gp-border/60">
              {order.items.map((i) => (
                <div
                  key={i.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5 text-sm"
                >
                  <span className="text-gp-text">
                    {i.name}{" "}
                    <span className="text-gp-text-subtle">×{i.qty}</span>
                  </span>
                  <span className="font-semibold tabular-nums text-gp-text">
                    {formatPrice(i.price * i.qty)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between border-t border-gp-border/70 px-5 py-4 text-lg font-black text-gp-text">
              <span>Total</span>
              <span className="tabular-nums">{formatPrice(order.total)}</span>
            </div>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader title="Customer" />
            <dl className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-gp-text-subtle">Name</dt>
                <dd className="text-right font-semibold text-gp-text">
                  {order.customerName}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gp-text-subtle">Phone</dt>
                <dd className="text-right text-gp-text">{order.customerPhone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gp-text-subtle">Address</dt>
                <dd className="max-w-[60%] text-right text-gp-text">
                  {order.address || "—"}
                </dd>
              </div>
            </dl>
          </DeskPanel>
        </div>

        <div className="space-y-6">
          <DeskPanel>
            <DeskPanelHeader title="Payment" />
            <div className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gp-text-subtle">Method</span>
                <span className="font-semibold text-gp-text">
                  {order.paymentMethod.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gp-text-subtle">Status</span>
                <StatusPill status={order.paymentStatus} kind="payment" />
              </div>
              {order.paymentRef ? (
                <p className="break-all text-xs text-gp-text-subtle">
                  Ref: {order.paymentRef}
                </p>
              ) : null}
            </div>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader title="Update status" />
            <div className="px-5 py-4">
              <OrderStatusForm
                orderId={order.id}
                currentStatus={order.status}
              />
            </div>
          </DeskPanel>
        </div>
      </div>
    </div>
  );
}
