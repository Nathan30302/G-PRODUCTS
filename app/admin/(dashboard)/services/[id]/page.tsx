import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { updateServiceStatus } from "@/app/admin/(dashboard)/services/actions";
import { siteConfig } from "@/config/site";
import {
  DeskHero,
  DeskPanel,
  DeskPanelHeader,
  StatusPill
} from "@/components/admin/desk";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service request" };

const STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED"
];

const typeLabel: Record<string, string> = {
  KEY_CUTTING: "Key Cutting",
  G_LOANS: "G-Loans",
  PRINTING: "Printing"
};

function waLink(phone: string, ref: string) {
  let p = phone.replace(/[^0-9]/g, "");
  if (p.startsWith("0")) p = "26" + p;
  else if (p.startsWith("9") || p.startsWith("7")) p = "260" + p;
  const text = encodeURIComponent(
    `Hello, regarding your G-Products service ${ref}:`
  );
  return `https://wa.me/${p}?text=${text}`;
}

export default async function ServiceDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await prisma.serviceRequest.findUnique({ where: { id } });
  if (!request) notFound();

  let details: Record<string, unknown> = {};
  try {
    details = JSON.parse(request.details);
  } catch {
    details = {};
  }

  let files: string[] = [];
  try {
    files = request.fileUrls ? JSON.parse(request.fileUrls) : [];
    if (!Array.isArray(files)) files = [];
  } catch {
    files = [];
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-white/40">
        <Link href="/admin/services" className="hover:text-white">
          Services
        </Link>
        <span>/</span>
        <span className="font-mono text-white/70">{request.ref}</span>
      </div>

      <DeskHero>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
              Service request
            </p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">
              {typeLabel[request.serviceType] ?? request.serviceType}
            </h1>
            <p className="mt-2 font-mono text-sm text-white/55">
              {request.ref} · {formatDateTime(request.createdAt)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill status={request.status} kind="service" />
              {request.paymentStatus ? (
                <StatusPill status={request.paymentStatus} kind="payment" />
              ) : null}
            </div>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/40">
              Amount
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-white">
              {typeof request.amount === "number"
                ? formatPrice(request.amount)
                : "—"}
            </p>
            <a
              href={waLink(request.customerPhone, request.ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-2.5 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              WhatsApp customer
            </a>
          </div>
        </div>
      </DeskHero>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <DeskPanel>
            <DeskPanelHeader title="Request details" />
            <dl className="space-y-3 px-5 py-4 text-sm">
              {Object.entries(details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="capitalize text-white/45">
                    {k.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="text-right text-white/85">
                    {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
                  </dd>
                </div>
              ))}
              {typeof request.amount === "number" && (
                <div className="flex justify-between border-t border-white/[0.06] pt-3">
                  <dt className="text-white/45">Amount</dt>
                  <dd className="font-bold tabular-nums text-white">
                    {formatPrice(request.amount)}
                  </dd>
                </div>
              )}
            </dl>
          </DeskPanel>

          {files.length > 0 ? (
            <DeskPanel>
              <DeskPanelHeader
                title="Uploaded files"
                subtitle="Download to print or forward on WhatsApp"
              />
              <ul className="divide-y divide-white/[0.05]">
                {files.map((url) => (
                  <li key={url} className="px-5 py-3">
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      {url.split("/").pop()}
                    </a>
                  </li>
                ))}
              </ul>
            </DeskPanel>
          ) : null}

          <DeskPanel>
            <DeskPanelHeader title="Customer" />
            <dl className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/45">Name</dt>
                <dd className="font-semibold text-white/85">
                  {request.customerName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/45">Phone</dt>
                <dd className="text-white/85">{request.customerPhone}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Delivery</dt>
                <dd className="max-w-[60%] text-right text-white/85">
                  {request.deliveryMethod === "YANGO"
                    ? `Yango — ${request.address ?? ""}`
                    : `Pickup — ${siteConfig.branch}`}
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
                <span className="text-white/45">Method</span>
                <span className="font-semibold text-white">
                  {request.paymentMethod?.toUpperCase() ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/45">Status</span>
                {request.paymentStatus ? (
                  <StatusPill status={request.paymentStatus} kind="payment" />
                ) : (
                  <span className="text-white/50">N/A</span>
                )}
              </div>
            </div>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader title="Update status" />
            <form action={updateServiceStatus} className="space-y-3 px-5 py-4">
              <input type="hidden" name="id" value={request.id} />
              <select
                name="status"
                defaultValue={request.status}
                className="w-full rounded-xl border border-white/10 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="w-full rounded-pill bg-brand px-4 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft"
              >
                Save status
              </button>
            </form>
          </DeskPanel>
        </div>
      </div>
    </div>
  );
}
