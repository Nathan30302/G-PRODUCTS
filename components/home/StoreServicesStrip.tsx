import Link from "next/link";
import { Icon } from "@/components/Icons";

const services = [
  {
    href: "/services/printing",
    name: "Upload & Print",
    icon: "printer" as const,
    hint: "Documents & photos"
  },
  {
    href: "/services/key-cutting",
    name: "Key cutting",
    icon: "key" as const,
    hint: "In-store service"
  },
  {
    href: "/services/g-loans",
    name: "G-Loans",
    icon: "wallet" as const,
    hint: "Apply in store"
  }
];

/** Compact homepage strip for in-store services. */
export function StoreServicesStrip() {
  return (
    <section className="container-g mt-10 pb-4 sm:mt-12 sm:pb-6">
      <div className="rounded-[1.35rem] border border-gp-border/80 bg-white p-5 shadow-card sm:p-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gp-text-subtle">
              More than products
            </p>
            <h2 className="display mt-2 text-xl font-extrabold text-gp-text sm:text-2xl">
              Services
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
              Shop products online first — visit us for printing, key cutting and
              G-Loans when you need them.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 rounded-pill border border-gp-border px-4 py-2 text-sm font-semibold text-ink-700 transition-colors hover:border-ink-700/30 hover:bg-gp-muted"
          >
            All services
            <Icon name="arrow-right" className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          {services.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="group flex items-center gap-3 rounded-2xl border border-gp-border/70 bg-gp-muted/50 px-4 py-3.5 transition-all hover:border-ink-700/20 hover:bg-white hover:shadow-card"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-ink-700/10 text-ink-700 transition-colors group-hover:bg-ink-700 group-hover:text-white">
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-semibold text-gp-text">
                  {s.name}
                </span>
                <span className="block text-xs text-gp-text-muted">{s.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
