import Link from "next/link";
import { Icon } from "@/components/Icons";

const badges = [
  { icon: "check" as const, label: "Genuine products" },
  { icon: "truck" as const, label: "Fast delivery" },
  { icon: "wallet" as const, label: "Mobile Money checkout" },
  {
    icon: "refresh" as const,
    label: "Returns policy",
    href: "/returns"
  }
];

/** Persistent trust row — visible immediately below the hero. */
export function TrustBadgeStrip() {
  return (
    <section
      aria-label="Why shop with G-Products"
      className="border-b border-gp-border bg-gp-surface"
    >
      <div className="container-g py-4 sm:py-5">
        <ul className="grid grid-cols-2 gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-2">
          {badges.map((b) => {
            const inner = (
              <>
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gp-muted text-ink-700">
                  <Icon name={b.icon} className="h-4 w-4" />
                </span>
                <span className="text-xs font-semibold text-gp-text sm:text-sm">
                  {b.label}
                </span>
              </>
            );
            return (
              <li key={b.label}>
                {"href" in b && b.href ? (
                  <Link
                    href={b.href}
                    className="flex items-center gap-3 transition-colors hover:text-ink-700"
                  >
                    {inner}
                  </Link>
                ) : (
                  <span className="flex items-center gap-2.5">{inner}</span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
