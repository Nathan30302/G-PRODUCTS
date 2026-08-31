"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { bundles, bundleLineTotal } from "@/lib/bundles";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

/** G-Products campus packs — student & essentials bundles on the home hero area. */
export function HomeStudentPacks({ products }: { products: Product[] }) {
  const bySlug = new Map(products.map((p) => [p.slug, p]));

  return (
    <section className="container-g pt-4 sm:pt-5">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-gp-border/80 bg-gp-surface shadow-card sm:rounded-[1.75rem]">
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(27,78,88,0.1),transparent_65%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_95%_15%,rgba(246,212,0,0.14),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_35%_at_5%_85%,rgba(34,201,138,0.08),transparent_50%)]" />
        </div>

        <div className="relative px-4 py-6 sm:px-6 sm:py-8">
          <div className="text-center">
            <span className="rounded-pill bg-brand px-3.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] text-ink-900">
              Campus packs
            </span>
            <h2 className="display mt-3 text-[clamp(1.25rem,0.95rem+1.4vw,1.625rem)] font-extrabold text-ink-800">
              Student packages you can grab today
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium text-gp-text-muted">
              Curated bundles for campus — stationery, phone essentials, laptop
              gear and print-ready sets. Add a whole pack in one tap.
            </p>
          </div>

          <div className="no-scrollbar mt-6 flex gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-2">
            {bundles.map((bundle) => (
              <HomePackCard
                key={bundle.slug}
                bundle={bundle}
                productsBySlug={bySlug}
              />
            ))}
          </div>

          <div className="mt-5 flex justify-center">
            <Link
              href="/bundles"
              className="btn-brand inline-flex min-h-11 items-center gap-2 px-6 text-sm"
            >
              View all packs
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function HomePackCard({
  bundle,
  productsBySlug
}: {
  bundle: (typeof bundles)[number];
  productsBySlug: Map<string, Product>;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { total, missing, lines } = bundleLineTotal(bundle, productsBySlug);
  const ready = lines.length > 0 && missing.length === 0;

  function addPack() {
    if (!ready) return;
    setBusy(true);
    for (const line of lines) {
      add(line.product, undefined, line.qty);
    }
    router.push("/cart");
  }

  return (
    <article className="flex w-[16.5rem] shrink-0 flex-col rounded-[1.25rem] border border-gp-border/80 bg-white/90 p-4 shadow-card backdrop-blur-sm sm:w-auto">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {bundle.badge ? (
            <span className="rounded-pill bg-ink-700/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-ink-700">
              {bundle.badge}
            </span>
          ) : null}
          <h3 className="mt-2 font-display text-base font-extrabold leading-snug text-gp-text">
            {bundle.name}
          </h3>
          <p className="mt-1 text-xs font-medium text-gp-text-muted">
            {bundle.tagline}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[9px] font-semibold uppercase tracking-wider text-gp-text-subtle">
            From
          </p>
          <p className="text-lg font-extrabold tabular-nums text-ink-700">
            {ready ? formatPrice(total) : "—"}
          </p>
        </div>
      </div>

      <ul className="mt-3 space-y-1 border-t border-gp-border/70 pt-3">
        {bundle.items.slice(0, 3).map((item) => {
          const p = productsBySlug.get(item.slug);
          return (
            <li key={item.slug} className="text-xs text-gp-text-muted">
              <span className="font-semibold text-gp-text">{item.qty}×</span>{" "}
              {p?.name ?? item.slug}
            </li>
          );
        })}
        {bundle.items.length > 3 ? (
          <li className="text-[11px] font-medium text-ink-600">
            +{bundle.items.length - 3} more item
            {bundle.items.length - 3 === 1 ? "" : "s"}
          </li>
        ) : null}
      </ul>

      <button
        type="button"
        disabled={!ready || busy}
        onClick={addPack}
        className="btn-brand mt-4 w-full justify-center py-2.5 text-xs disabled:opacity-40"
      >
        <Icon name="cart" className="h-3.5 w-3.5" />
        {busy ? "Adding…" : "Add pack to cart"}
      </button>
    </article>
  );
}
