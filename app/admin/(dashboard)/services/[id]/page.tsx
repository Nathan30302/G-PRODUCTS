import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { updateServiceStatus } from "@/app/admin/(dashboard)/services/actions";
import { siteConfig } from "@/config/site";

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
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin/services" className="hover:text-white">
          Services
        </Link>
        <span>/</span>
        <span className="font-mono text-white/70">{request.ref}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">
              {typeLabel[request.serviceType] ?? request.serviceType}
            </h2>
            <dl className="mt-4 space-y-2 text-sm">
              {Object.entries(details).map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="capitalize text-white/50">
                    {k.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="text-right text-white/80">
                    {typeof v === "boolean" ? (v ? "Yes" : "No") : String(v)}
                  </dd>
                </div>
              ))}
              {typeof request.amount === "number" && (
                <div className="flex justify-between border-t border-ink-800 pt-3">
                  <dt className="text-white/50">Amount</dt>
                  <dd className="font-bold text-white">
                    {formatPrice(request.amount)}
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {files.length > 0 && (
            <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
              <h2 className="text-lg font-bold text-white">Uploaded files</h2>
              <p className="mt-1 text-xs text-white/40">
                Download these to print. You can also forward them on WhatsApp.
              </p>
              <ul className="mt-4 space-y-2">
                {files.map((url) => (
                  <li key={url}>
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
            </section>
          )}

          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Customer</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/50">Name</dt>
                <dd className="text-white/80">{request.customerName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Phone</dt>
                <dd className="text-white/80">{request.customerPhone}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/50">Delivery</dt>
                <dd className="text-white/80">
                  {request.deliveryMethod === "YANGO"
                    ? `Yango — ${request.address ?? ""}`
                    : `Pickup — ${siteConfig.branch}`}
                </dd>
              </div>
            </dl>
            <a
              href={waLink(request.customerPhone, request.ref)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-pill border border-accent/40 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:bg-accent/20"
            >
              Message on WhatsApp
            </a>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Payment</h2>
            <p className="mt-2 text-sm text-white/60">
              Method:{" "}
              <span className="text-white">
                {request.paymentMethod?.toUpperCase() ?? "—"}
              </span>
            </p>
            <p className="mt-1 text-sm text-white/60">
              Status:{" "}
              <span className="text-white">
                {request.paymentStatus ?? "N/A"}
              </span>
            </p>
          </section>

          <section className="rounded-card border border-ink-800 bg-ink-850 p-6">
            <h2 className="text-lg font-bold text-white">Update status</h2>
            <form action={updateServiceStatus} className="mt-4 space-y-3">
              <input type="hidden" name="id" value={request.id} />
              <select
                name="status"
                defaultValue={request.status}
                className="w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand"
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
          </section>
        </div>
      </div>
    </div>
  );
}
