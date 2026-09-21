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
import { ServiceFilesPanel } from "@/components/admin/ServiceFilesPanel";
import { describeServiceFiles } from "@/lib/service-files";
import { Icon } from "@/components/Icons";
import { labelForServiceStatus } from "@/lib/commerce-hooks";
import { customerWhatsAppLink } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";
export const metadata = { title: "Service request" };

const STATUSES = [
  "NEW",
  "CONFIRMED",
  "IN_PROGRESS",
  "READY",
  "DELIVERED",
  "CANCELLED"
] as const;

const typeLabel: Record<string, string> = {
  KEY_CUTTING: "Key Cutting",
  G_LOANS: "G-Loans",
  PRINTING: "Printing"
};

const DETAIL_LABELS: Record<string, string> = {
  jobId: "Job code",
  jobName: "Job",
  unitPrice: "Unit price",
  pages: "Pages / qty",
  copies: "Copies",
  notes: "Notes",
  keyType: "Key type",
  qty: "Quantity",
  flow: "Flow",
  cutFee: "Cut fee",
  yangoToStore: "Yango to store",
  yangoReturn: "Yango return",
  amount: "Amount",
  weeks: "Weeks",
  rate: "Rate %",
  collateral: "Collateral",
  hasNrc: "Has NRC"
};

function serviceMessage(ref: string, status: string) {
  const seen = labelForServiceStatus(status);
  return `Hello, this is G-Products about service ${ref}. Status: ${seen.label}.${seen.hint ? ` ${seen.hint}.` : ""}`;
}

function formatDetailValue(key: string, v: unknown): string {
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (
    typeof v === "number" &&
    (key === "unitPrice" ||
      key === "cutFee" ||
      key === "yangoToStore" ||
      key === "yangoReturn" ||
      key === "amount")
  ) {
    return formatPrice(v);
  }
  if (key === "flow") {
    const s = String(v);
    if (s === "IN_STORE") return "In-store";
    if (s === "YANGO_ROUNDTRIP") return "Yango round-trip";
  }
  return String(v);
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

  const files = describeServiceFiles(request.fileUrls);
  const isPrinting = request.serviceType === "PRINTING";
  const showFiles =
    isPrinting || request.serviceType === "G_LOANS" || files.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2 text-sm text-gp-text-subtle">
        <Link href="/admin/services" className="hover:text-gp-text">
          Services
        </Link>
        <span>/</span>
        <span className="font-mono text-gp-text-muted">{request.ref}</span>
      </div>

      <DeskHero>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-accent-ink">
              Service request
            </p>
            <h1 className="display mt-2 text-3xl sm:text-4xl">
              {typeLabel[request.serviceType] ?? request.serviceType}
            </h1>
            <p className="mt-2 font-mono text-sm text-gp-text-muted">
              {request.ref} · {formatDateTime(request.createdAt)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill status={request.status} kind="service" />
              {request.paymentStatus ? (
                <StatusPill status={request.paymentStatus} kind="payment" />
              ) : null}
              {files.length > 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-pill border border-brand/30 bg-brand/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-accent-ink">
                  <Icon name="file" className="h-3 w-3" />
                  {files.length} file{files.length === 1 ? "" : "s"}
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-gp-text-subtle">
              {labelForServiceStatus(request.status).hint} The customer sees “
              {labelForServiceStatus(request.status).label}” on their track page.
            </p>
          </div>
          <div className="text-left lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-subtle">
              Amount
            </p>
            <p className="mt-1 text-3xl font-black tabular-nums text-gp-text">
              {typeof request.amount === "number"
                ? formatPrice(request.amount)
                : "—"}
            </p>
            <a
              href={customerWhatsAppLink(
                request.customerPhone,
                serviceMessage(request.ref, request.status)
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-pill bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1ebe5d]"
            >
              <Icon name="whatsapp" className="h-4 w-4" />
              Message customer on WhatsApp
            </a>
          </div>
        </div>
      </DeskHero>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {showFiles ? (
            <ServiceFilesPanel
              files={files}
              emptyHint={
                isPrinting
                  ? "No print files on this job. Customer may need to re-upload from Services → Printing."
                  : undefined
              }
            />
          ) : null}

          <DeskPanel>
            <DeskPanelHeader title="Request details" />
            <dl className="space-y-3 px-5 py-4 text-sm">
              {Object.entries(details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-gp-text-subtle">
                    {DETAIL_LABELS[k] ?? k.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="max-w-[65%] text-right text-gp-text">
                    {formatDetailValue(k, v)}
                  </dd>
                </div>
              ))}
              {typeof request.amount === "number" && (
                <div className="flex justify-between border-t border-gp-border/70 pt-3">
                  <dt className="text-gp-text-subtle">Amount</dt>
                  <dd className="font-bold tabular-nums text-gp-text">
                    {formatPrice(request.amount)}
                  </dd>
                </div>
              )}
            </dl>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader title="Customer" />
            <dl className="space-y-3 px-5 py-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-gp-text-subtle">Name</dt>
                <dd className="font-semibold text-gp-text">
                  {request.customerName}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-gp-text-subtle">Phone</dt>
                <dd className="text-right">
                  <a
                    href={`tel:${request.customerPhone}`}
                    className="font-semibold text-ink-850 underline-offset-2 hover:underline"
                  >
                    {request.customerPhone}
                  </a>
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-gp-text-subtle">Delivery</dt>
                <dd className="max-w-[60%] text-right text-gp-text">
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
                <span className="text-gp-text-subtle">Method</span>
                <span className="font-semibold text-gp-text">
                  {request.paymentMethod?.toUpperCase() ?? "—"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gp-text-subtle">Status</span>
                {request.paymentStatus ? (
                  <StatusPill status={request.paymentStatus} kind="payment" />
                ) : (
                  <span className="text-gp-text-muted">N/A</span>
                )}
              </div>
            </div>
          </DeskPanel>

          <DeskPanel>
            <DeskPanelHeader
              title="Update status"
              subtitle="The customer sees these same words on their track page"
            />
            <form action={updateServiceStatus} className="space-y-3 px-5 py-4">
              <input type="hidden" name="id" value={request.id} />
              <p className="text-xs leading-relaxed text-gp-text-muted">
                Customer sees{" "}
                <span className="font-semibold text-gp-text">
                  {labelForServiceStatus(request.status).label}
                </span>
                {labelForServiceStatus(request.status).hint
                  ? ` — ${labelForServiceStatus(request.status).hint}`
                  : ""}
                .
              </p>
              <select
                name="status"
                defaultValue={request.status}
                className="w-full rounded-xl border border-gp-border bg-gp-surface px-4 py-3 text-sm text-gp-text outline-none focus:border-brand/70 focus:shadow-[0_0_0_4px_rgba(229,243,79,0.28)]"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {labelForServiceStatus(s).label}
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
