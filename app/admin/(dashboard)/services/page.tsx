import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import {
  DeskPageHeader,
  DeskStat,
  DeskStatGrid,
  DeskPanel,
  DeskEmpty,
  DeskFilterBar,
  StatusPill
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service requests" };

const typeLabel: Record<string, string> = {
  KEY_CUTTING: "Key Cutting",
  G_LOANS: "G-Loans",
  PRINTING: "Printing"
};

const FILTERS = [
  "ALL",
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

export default async function AdminServicesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status: rawStatus } = await searchParams;
  const status =
    rawStatus && FILTERS.includes(rawStatus as (typeof FILTERS)[number])
      ? rawStatus
      : null;

  const requests = await prisma.serviceRequest.findMany({
    orderBy: { createdAt: "desc" }
  });

  const counts = FILTERS.reduce(
    (acc, key) => {
      if (key === "ALL") acc.ALL = requests.length;
      else acc[key] = requests.filter((r) => r.status === key).length;
      return acc;
    },
    {} as Record<string, number>
  );

  const filtered =
    status && status !== "ALL"
      ? requests.filter((r) => r.status === status)
      : requests;

  const queue = (counts.NEW ?? 0) + (counts.CONFIRMED ?? 0);

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Services desk"
        title="Service requests"
        description={
          <>
            {requests.length} request{requests.length === 1 ? "" : "s"} — key
            cutting, loans & printing
          </>
        }
      />

      <DeskStatGrid>
        <DeskStat label="In queue" value={queue} tone="warn" />
        <DeskStat
          label="In progress"
          value={counts.IN_PROGRESS ?? 0}
          href="/admin/services?status=IN_PROGRESS"
        />
        <DeskStat
          label="Ready"
          value={counts.READY ?? 0}
          href="/admin/services?status=READY"
          tone="good"
        />
        <DeskStat label="All" value={counts.ALL ?? 0} href="/admin/services" />
      </DeskStatGrid>

      <DeskFilterBar
        basePath="/admin/services"
        active={status}
        options={FILTERS.map((value) => ({
          value,
          label: value === "ALL" ? "All" : value.replace("_", " "),
          count: counts[value] ?? 0
        }))}
      />

      <DeskPanel>
        {filtered.length === 0 ? (
          <DeskEmpty
            title={
              status
                ? `No ${status.toLowerCase().replace("_", " ")} requests`
                : "No service requests yet"
            }
            action={
              status ? (
                <Link
                  href="/admin/services"
                  className="rounded-pill bg-brand px-4 py-2 text-sm font-bold text-ink-950"
                >
                  Show all
                </Link>
              ) : undefined
            }
          />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Ref</th>
                    <th className="px-5 py-3.5 font-semibold">Service</th>
                    <th className="px-5 py-3.5 font-semibold">Customer</th>
                    <th className="px-5 py-3.5 font-semibold">Delivery</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-white/[0.05] transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-3.5 font-mono text-white/80">
                        {r.ref}
                      </td>
                      <td className="px-5 py-3.5 text-white/80">
                        {typeLabel[r.serviceType] ?? r.serviceType}
                        <span className="block text-xs text-white/40">
                          {formatDateTime(r.createdAt)}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/80">
                        {r.customerName}
                        <span className="block text-xs text-white/40">
                          {r.customerPhone}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/60">
                        {r.deliveryMethod === "YANGO" ? "Yango" : "Pickup"}
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-white">
                        {typeof r.amount === "number"
                          ? formatPrice(r.amount)
                          : "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusPill status={r.status} kind="service" />
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Link
                          href={`/admin/services/${r.id}`}
                          className="text-sm font-semibold text-brand hover:underline"
                        >
                          Open
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((r) => (
                <Link
                  key={r.id}
                  href={`/admin/services/${r.id}`}
                  className="block rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:border-brand/35"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono text-sm font-semibold text-white/90">
                        {r.ref}
                      </p>
                      <p className="mt-1 text-sm text-white/75">
                        {typeLabel[r.serviceType] ?? r.serviceType}
                      </p>
                    </div>
                    <StatusPill status={r.status} kind="service" />
                  </div>
                  <div className="mt-3 flex items-end justify-between border-t border-white/[0.05] pt-3">
                    <div>
                      <p className="text-sm text-white/80">{r.customerName}</p>
                      <p className="text-xs text-white/40">
                        {r.deliveryMethod === "YANGO" ? "Yango" : "Pickup"}
                      </p>
                    </div>
                    <p className="font-black tabular-nums text-white">
                      {typeof r.amount === "number"
                        ? formatPrice(r.amount)
                        : "—"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </DeskPanel>
    </div>
  );
}
