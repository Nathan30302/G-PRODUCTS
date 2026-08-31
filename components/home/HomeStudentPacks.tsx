import Link from "next/link";
import { Icon } from "@/components/Icons";
import { bundles } from "@/lib/bundles";

/** Compact campus packs entry — tap through to choose a package on /bundles. */
export function HomeStudentPacks() {
  const packCount = bundles.length;

  return (
    <section className="container-g pt-4 sm:pt-5">
      <Link
        href="/bundles"
        className="group relative block overflow-hidden rounded-[1.35rem] shadow-card transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99] sm:rounded-[1.5rem]"
      >
        <div className="campus-packs-bg" aria-hidden>
          <div className="smoke-layer campus-smoke-a" />
          <div className="smoke-layer campus-smoke-b" />
          <div className="smoke-layer campus-smoke-c" />
          <div className="smoke-layer campus-smoke-d" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(6,24,28,0.35)_100%)]" />
        </div>

        <div className="relative flex flex-col items-center px-5 py-7 text-center sm:px-8 sm:py-8">
          <span className="rounded-pill bg-brand px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-950 shadow-sm">
            Campus packs
          </span>

          <h2 className="display mt-3 max-w-[18ch] text-[clamp(1.2rem,0.95rem+1.2vw,1.5rem)] font-extrabold leading-snug text-white sm:max-w-none">
            Student packages you can grab today
          </h2>

          <span className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-pill bg-white px-6 py-2.5 text-sm font-bold text-ink-850 shadow-float transition-colors group-hover:bg-brand group-hover:text-ink-950">
            Shop campus packs
            <Icon
              name="arrow-right"
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
            />
          </span>

          <p className="mt-3 text-[11px] font-medium text-white/55">
            {packCount} curated packs · tap to choose yours
          </p>
        </div>
      </Link>
    </section>
  );
}
