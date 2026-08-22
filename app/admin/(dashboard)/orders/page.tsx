import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  DeskPageHeader,
  DeskStat,
  DeskStatGrid,
  DeskPanel,
  DeskEmpty,
  DeskFilterBar,
  DeskOrderList
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Orders" };

const FILTERS = [
  "ALL",
  "PENDING",
  "PAID",
  "PREPARING",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

export default async function AdminOrders({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status =
    rawStatus && FILTERS.includes(rawStatus as (typeof FILTERS)[number])
      ? rawStatus
      : null;

  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });

  const counts = FILTERS.reduce(
    (acc, key) => {
      if (key === "ALL") acc.ALL = orders.length;
      else acc[key] = orders.filter((o) => o.status === key).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const filtered =
    status && status !== "ALL"
      ? orders.filter((o) => o.status === status)
      : orders;

  const summaries = filtered.map((o) => ({
    id: o.id,
    ref: o.ref,
    customerName: o.customerName,
    customerPhone: o.customerPhone,
    createdAt: o.createdAt,
    total: o.total,
    status: o.status,
    paymentMethod: o.paymentMethod,
    paymentStatus: o.paymentStatus,
    itemCount: o.items.reduce((n, i) => n + i.qty, 0)
  }));

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Sales desk"
        title="Orders"
        description={
          <>
            {orders.length} order{orders.length === 1 ? "" : "s"} · update status
            as you prepare and deliver
          </>
        }
      />

      <DeskStatGrid>
        <DeskStat
          label="Pending"
          value={counts.PENDING ?? 0}
          href="/admin/orders?status=PENDING"
          tone="warn"
        />
        <DeskStat
          label="Preparing"
          value={counts.PREPARING ?? 0}
          href="/admin/orders?status=PREPARING"
        />
        <DeskStat
          label="Ready"
          value={counts.READY ?? 0}
          href="/admin/orders?status=READY"
          tone="brand"
        />
        <DeskStat
          label="Delivered"
          value={counts.DELIVERED ?? 0}
          href="/admin/orders?status=DELIVERED"
          tone="good"
        />
      </DeskStatGrid>

      <DeskFilterBar
        basePath="/admin/orders"
        active={status}
        options={FILTERS.map((value) => ({
          value,
          label: value === "ALL" ? "All" : value,
          count: counts[value] ?? 0
        }))}
      />

      <DeskPanel>
        {summaries.length === 0 ? (
          <DeskEmpty
            title={status ? `No ${status.toLowerCase()} orders` : "No orders yet"}
            description="They'll appear here the moment a customer checks out."
            action={
              status ? (
                <Link
                  href="/admin/orders"
                  className="rounded-pill bg-brand px-4 py-2 text-sm font-bold text-ink-950"
                >
                  Show all
                </Link>
              ) : undefined
            }
          />
        ) : (
          <DeskOrderList orders={summaries} />
        )}
      </DeskPanel>
    </div>
  );
}
