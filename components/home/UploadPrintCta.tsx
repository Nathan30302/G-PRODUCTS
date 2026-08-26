import Link from "next/link";
import { Icon } from "@/components/Icons";

const flow = [
  { step: "1", title: "Upload", body: "Send original-quality files securely." },
  { step: "2", title: "Options", body: "Choose print type, pages & copies." },
  { step: "3", title: "Pay", body: "MTN, Airtel or Zamtel Mobile Money." },
  { step: "4", title: "Print", body: "We print your job in queue." },
  { step: "5", title: "Collect", body: "Pickup or Yango delivery." }
];

export function UploadPrintCta() {
  return (
    <section className="container-g mt-16 sm:mt-20">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-brand/30 bg-gradient-to-br from-brand/[0.14] via-ink-900/80 to-ink-950 px-5 py-8 sm:rounded-[1.75rem] sm:px-10 sm:py-12">
        <div className="pointer-events-none absolute -right-10 top-0 h-56 w-56 rounded-full bg-brand/20 blur-[90px]" />
        <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              Upload &amp; Print
            </p>
            <h2 className="display heading-section mt-2">
              Print from anywhere. Collect nearby.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Upload original-quality files securely to our printing team —
              choose options, pay with Mobile Money, we print, then you pick up
              or request delivery.
            </p>
            <ol className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {flow.map((f) => (
                <li
                  key={f.step}
                  className="rounded-xl border border-white/[0.08] bg-ink-950/40 px-3 py-3"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-brand">
                    {f.step} · {f.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-snug text-white/45">
                    {f.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <Link
            href="/services/printing"
            className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-2xl bg-brand px-8 py-4 text-sm font-extrabold uppercase tracking-[0.12em] text-ink-950 shadow-brand-glow transition-all hover:-translate-y-0.5 hover:brightness-105 sm:w-auto sm:text-base"
          >
            <Icon name="printer" className="h-5 w-5" />
            Upload &amp; Print Now
          </Link>
        </div>
      </div>
    </section>
  );
}
