"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { BundleDef } from "@/lib/bundles";
import { bundleLineTotal } from "@/lib/bundles";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { Icon } from "@/components/Icons";

export function BundleCard({
  bundle,
  productsBySlug
}: {
  bundle: BundleDef;
  productsBySlug: Map<string, Product>;
}) {
  const { add } = useCart();
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const { total, missing, lines } = bundleLineTotal(bundle, productsBySlug);
  const ready = lines.length > 0 && missing.length === 0;

  function addBundle() {
    if (!ready) return;
    setBusy(true);
    for (const line of lines) {
      add(line.product, undefined, line.qty);
    }
    router.push("/cart");
  }

  return (
    <article className="flex flex-col rounded-[1.35rem] border border-white/[0.08] bg-ink-900/70 p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          {bundle.badge ? (
            <span className="rounded-pill bg-brand/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-brand">
              {bundle.badge}
            </span>
          ) : null}
          <h2 className="mt-2 font-display text-xl font-extrabold text-white">
            {bundle.name}
          </h2>
          <p className="mt-1 text-sm text-white/50">{bundle.tagline}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-white/35">
            Bundle from
          </p>
          <p className="text-xl font-extrabold tabular-nums text-brand">
            {ready ? formatPrice(total) : "—"}
          </p>
        </div>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-white/55">
        {bundle.description}
      </p>

      <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
        {bundle.items.map((item) => {
          const p = productsBySlug.get(item.slug);
          return (
            <li
              key={item.slug}
              className="flex items-start justify-between gap-3 text-sm"
            >
              <span className="text-white/75">
                <span className="font-semibold text-white">{item.qty}×</span>{" "}
                {p ? (
                  <Link
                    href={`/product/${p.slug}`}
                    className="hover:text-brand"
                  >
                    {p.name}
                  </Link>
                ) : (
                  <span className="text-white/40">{item.slug}</span>
                )}
                {item.note ? (
                  <span className="mt-0.5 block text-[11px] text-white/35">
                    {item.note}
                  </span>
                ) : null}
              </span>
              {p ? (
                <span className="shrink-0 tabular-nums text-white/45">
                  {formatPrice(p.price * item.qty)}
                </span>
              ) : null}
            </li>
          );
        })}
      </ul>

      {missing.length > 0 ? (
        <p className="mt-3 text-xs text-amber-300/90">
          Some items are temporarily unavailable in the catalogue.
        </p>
      ) : null}

      <button
        type="button"
        disabled={!ready || busy}
        onClick={addBundle}
        className="btn-primary mt-5 w-full justify-center disabled:opacity-40"
      >
        <Icon name="cart" className="h-4 w-4" />
        {busy ? "Adding…" : "Add pack to cart"}
      </button>
    </article>
  );
}
