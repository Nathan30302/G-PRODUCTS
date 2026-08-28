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

/** Compact homepage strip — services are secondary to the product shop. */
export function StoreServicesStrip() {
  return (
    <section className="container-g mt-14 sm:mt-16">
      <div className="rounded-[1.35rem] border border-white/[0.07] bg-ink-900/45 px-5 py-6 sm:px-7 sm:py-7">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <p className="eyebrow">Also at our stores</p>
            <h2 className="display mt-2 text-xl sm:text-2xl">
              In-store services
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-white/50">
              Shop products online first — visit us for printing, key cutting and
              G-Loans when you need them.
            </p>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-1 rounded-pill border border-white/10 px-4 py-2 text-sm font-semibold text-brand transition-colors hover:border-brand/35 hover:bg-brand/5"
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
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-ink-950/35 px-4 py-3.5 transition-colors hover:border-brand/30 hover:bg-ink-950/55"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/[0.04] text-brand ring-1 ring-white/[0.06] transition-colors group-hover:bg-brand/10 group-hover:ring-brand/20">
                <Icon name={s.icon} className="h-4 w-4" />
              </span>
              <span className="min-w-0 text-left">
                <span className="block text-sm font-semibold text-white">
                  {s.name}
                </span>
                <span className="block text-xs text-white/40">{s.hint}</span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
