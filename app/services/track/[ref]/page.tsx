import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { formatPrice, formatDateTime } from "@/lib/format";
import { describeServiceFiles } from "@/lib/service-files";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import { ShopStatusPill } from "@/components/shop/ui";
import { getCustomerSession } from "@/lib/customer-auth";
import { canViewService } from "@/lib/track-access";
import { ServiceTrackVerify } from "@/components/services/ServiceTrackVerify";

export const dynamic = "force-dynamic";

const typeLabel: Record<string, string> = {
  KEY_CUTTING: "Key Cutting",
  G_LOANS: "G-Loans",
  PRINTING: "Printing"
};

const FLOW: { key: string; label: string }[] = [
  { key: "NEW", label: "Received" },
  { key: "CONFIRMED", label: "Confirmed" },
  { key: "IN_PROGRESS", label: "In progress" },
  { key: "READY", label: "Ready" },
  { key: "DELIVERED", label: "Done" }
];

export async function generateMetadata({
  params
}: {
  params: Promise<{ ref: string }>;
}): Promise<Metadata> {
  const { ref } = await params;
  return { title: `Track ${ref}` };
}

function statusIndex(status: string): number {
  if (status === "CANCELLED") return -1;
  const i = FLOW.findIndex((f) => f.key === status);
  return i >= 0 ? i : 0;
}

export default async function ServiceTrackPage({
  params,
  searchParams
}: {
  params: Promise<{ ref: string }>;
  searchParams: Promise<{ phoneLast4?: string }>;
}) {
  const { ref } = await params;
  const { phoneLast4 = "" } = await searchParams;
  const request = await prisma.serviceRequest.findUnique({ where: { ref } });
  if (!request) notFound();

  const customer = await getCustomerSession();
  if (!canViewService(request, { phoneLast4, customer })) {
    return <ServiceTrackVerify ref={ref} />;
  }

  let details: Record<string, unknown> = {};
  try {
    details = JSON.parse(request.details);
  } catch {
    details = {};
  }

  const accessQuery = phoneLast4
    ? `?ref=${encodeURIComponent(ref)}&phoneLast4=${encodeURIComponent(phoneLast4)}`
    : "";
  const files = describeServiceFiles(request.fileUrls).map((f) => ({
    ...f,
    url: `${f.url}${accessQuery}`,
    downloadUrl: `${f.downloadUrl}${f.downloadUrl.includes("?") ? "&" : "?"}ref=${encodeURIComponent(ref)}&phoneLast4=${encodeURIComponent(phoneLast4)}`
  }));
  const idx = statusIndex(request.status);
  const jobName =
    typeof details.jobName === "string"
      ? details.jobName
      : typeLabel[request.serviceType] ?? request.serviceType;

  return (
    <div className="container-g py-10">
      <nav className="text-sm text-white/40">
        <Link href="/" className="hover:text-white">
          Home
        </Link>{" "}
        /{" "}
        <Link href="/services" className="hover:text-white">
          Services
        </Link>{" "}
        / <span className="text-white/70">Track</span>
      </nav>

      <header className="relative mt-5 overflow-hidden rounded-[1.5rem] border border-white/[0.08] bg-gradient-to-br from-ink-900 via-ink-900/80 to-ink-950 p-6 sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand/10 blur-3xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
              Service status
            </p>
            <h1 className="display mt-1.5 text-3xl sm:text-4xl">{jobName}</h1>
            <p className="mt-2 font-mono text-sm text-white/50">{request.ref}</p>
            <p className="mt-1 text-xs text-white/35">
              {formatDateTime(request.createdAt)}
            </p>
          </div>
          <ShopStatusPill status={request.status} />
        </div>
      </header>

      {request.status !== "CANCELLED" ? (
        <ol className="mt-8 grid gap-2 sm:grid-cols-5">
          {FLOW.map((step, i) => {
            const done = idx > i;
            const active = idx === i;
            return (
              <li
                key={step.key}
                className={`rounded-xl border px-3 py-3 text-center ${
                  active
                    ? "border-brand/40 bg-brand/15"
                    : done
                      ? "border-accent/25 bg-accent/10"
                      : "border-white/[0.06] bg-white/[0.02]"
                }`}
              >
                <p
                  className={`text-[10px] font-bold uppercase tracking-wider ${
                    active
                      ? "text-brand"
                      : done
                        ? "text-accent"
                        : "text-white/30"
                  }`}
                >
                  Step {i + 1}
                </p>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    active || done ? "text-white" : "text-white/35"
                  }`}
                >
                  {step.label}
                </p>
              </li>
            );
          })}
        </ol>
      ) : (
        <p className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          This request was cancelled. Message us on WhatsApp if you need help.
        </p>
      )}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[1.35rem] border border-white/[0.08] bg-ink-900/50 p-5 sm:p-6">
          <h2 className="display text-xl">Details</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-white/45">Service</dt>
              <dd className="text-white/85">
                {typeLabel[request.serviceType] ?? request.serviceType}
              </dd>
            </div>
            {typeof request.amount === "number" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Amount</dt>
                <dd className="font-bold tabular-nums text-brand">
                  {formatPrice(request.amount)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="text-white/45">Delivery</dt>
              <dd className="max-w-[60%] text-right text-white/85">
                {request.deliveryMethod === "YANGO"
                  ? `Yango — ${request.address ?? ""}`
                  : `Pickup — ${siteConfig.branch}`}
              </dd>
            </div>
            {request.paymentStatus ? (
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Payment</dt>
                <dd className="text-white/85">{request.paymentStatus}</dd>
              </div>
            ) : null}
            {typeof details.pages === "number" ? (
              <div className="flex justify-between gap-4">
                <dt className="text-white/45">Pages × copies</dt>
                <dd className="text-white/85">
                  {String(details.pages)} × {String(details.copies ?? 1)}
                </dd>
              </div>
            ) : null}
            {typeof details.notes === "string" && details.notes ? (
              <div className="border-t border-white/[0.06] pt-3">
                <dt className="text-white/45">Notes</dt>
                <dd className="mt-1 text-white/75">{details.notes}</dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-[1.35rem] border border-white/[0.08] bg-ink-900/50 p-5 sm:p-6">
          <h2 className="display text-xl">Your uploads</h2>
          <p className="mt-1 text-sm text-white/45">
            Only you and the owner can open these files.
          </p>
          {files.length === 0 ? (
            <p className="mt-6 text-sm text-white/40">
              No files on this request.
            </p>
          ) : (
            <ul className="mt-4 space-y-3">
              {files.map((file) => (
                <li
                  key={file.url}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-ink-950/60 p-2.5"
                >
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-ink-850">
                    {file.kind === "image" ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={file.url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-brand">
                        <Icon name="file" className="h-6 w-6" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-white/90">
                      {file.filename}
                    </p>
                    <a
                      href={file.downloadUrl}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
                    >
                      <Icon name="download" className="h-3 w-3" />
                      Download original
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/services"
          className="rounded-pill bg-brand px-5 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft"
        >
          Back to services
        </Link>
        <Link
          href="/profile/account"
          className="rounded-pill border border-white/15 px-5 py-2.5 text-sm font-semibold text-white/70 hover:border-white/30 hover:text-white"
        >
          My account
        </Link>
      </div>
    </div>
  );
}
