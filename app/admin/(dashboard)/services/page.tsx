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
import { parseServiceFileUrls } from "@/lib/service-files";
import { Icon } from "@/components/Icons";

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

function fileCount(raw: string | null): number {
  return parseServiceFileUrls(raw).length;
}

export default async function AdminServicesPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const { status: rawStatus, type: rawType } = await searchParams;
  const status =
    rawStatus && FILTERS.includes(rawStatus as (typeof FILTERS)[number])
      ? rawStatus
      : null;
  const typeFilter =
    rawType === "PRINTING" ||
    rawType === "KEY_CUTTING" ||
    rawType === "G_LOANS"
      ? rawType
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

  const printingWithFiles = requests.filter(
    (r) => r.serviceType === "PRINTING" && fileCount(r.fileUrls) > 0
  ).length;

  let filtered =
    status && status !== "ALL"
      ? requests.filter((r) => r.status === status)
      : requests;
  if (typeFilter) {
    filtered = filtered.filter((r) => r.serviceType === typeFilter);
  }

  const queue = (counts.NEW ?? 0) + (counts.CONFIRMED ?? 0);

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Services desk"
        title="Service requests"
        description={
          <>
            Inbox for key cutting, loans & printing. Open a job to preview
            uploads and download full-quality files for printing.
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
        <DeskStat
          label="Print files"
          value={printingWithFiles}
          href="/admin/services?type=PRINTING"
          tone="brand"
          hint="Jobs with uploads"
        />
      </DeskStatGrid>

      <div className="flex flex-wrap gap-2">
        {(
          [
            { value: null, label: "All services" },
            { value: "PRINTING", label: "Printing" },
            { value: "KEY_CUTTING", label: "Key cutting" },
            { value: "G_LOANS", label: "G-Loans" }
          ] as const
        ).map((opt) => {
          const active = typeFilter === opt.value;
          const href = (() => {
            const q = new URLSearchParams();
            if (status && status !== "ALL") q.set("status", status);
            if (opt.value) q.set("type", opt.value);
            const s = q.toString();
            return s ? `/admin/services?${s}` : "/admin/services";
          })();
          return (
            <Link
              key={opt.label}
              href={href}
              className={`rounded-pill border px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                active
                  ? "border-brand/40 bg-brand/15 text-brand"
                  : "border-white/10 text-white/50 hover:border-white/25 hover:text-white/80"
              }`}
            >
              {opt.label}
            </Link>
          );
        })}
      </div>

      <DeskFilterBar
        basePath={
          typeFilter
            ? `/admin/services?type=${typeFilter}`
            : "/admin/services"
        }
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
              status || typeFilter ? (
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
              <table className="w-full min-w-[800px] text-left text-sm">
                <thead className="bg-white/[0.02] text-[11px] uppercase tracking-[0.14em] text-white/40">
                  <tr>
                    <th className="px-5 py-3.5 font-semibold">Ref</th>
                    <th className="px-5 py-3.5 font-semibold">Service</th>
                    <th className="px-5 py-3.5 font-semibold">Customer</th>
                    <th className="px-5 py-3.5 font-semibold">Files</th>
                    <th className="px-5 py-3.5 font-semibold">Delivery</th>
                    <th className="px-5 py-3.5 font-semibold">Amount</th>
                    <th className="px-5 py-3.5 font-semibold">Status</th>
                    <th className="px-5 py-3.5 font-semibold" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => {
                    const n = fileCount(r.fileUrls);
                    return (
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
                        <td className="px-5 py-3.5">
                          {n > 0 ? (
                            <span className="inline-flex items-center gap-1 rounded-pill border border-brand/30 bg-brand/10 px-2 py-0.5 text-xs font-bold text-brand">
                              <Icon name="file" className="h-3 w-3" />
                              {n}
                            </span>
                          ) : r.serviceType === "PRINTING" ? (
                            <span className="text-xs text-white/30">None</span>
                          ) : (
                            <span className="text-xs text-white/25">—</span>
                          )}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="grid gap-3 p-4 md:hidden">
              {filtered.map((r) => {
                const n = fileCount(r.fileUrls);
                return (
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
                        <p className="mt-0.5 flex items-center gap-2 text-xs text-white/40">
                          {r.deliveryMethod === "YANGO" ? "Yango" : "Pickup"}
                          {n > 0 ? (
                            <span className="inline-flex items-center gap-1 text-brand">
                              <Icon name="file" className="h-3 w-3" />
                              {n} file{n === 1 ? "" : "s"}
                            </span>
                          ) : null}
                        </p>
                      </div>
                      <p className="font-black tabular-nums text-white">
                        {typeof r.amount === "number"
                          ? formatPrice(r.amount)
                          : "—"}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </DeskPanel>
    </div>
  );
}
