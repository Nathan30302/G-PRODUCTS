"use client";

import { Product } from "@/lib/types";
import { ProductActions } from "@/components/ProductActions";
import { useProductVariant } from "@/components/ProductVariantContext";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";

export function ProductDetailInfo({ product }: { product: Product }) {
  const { selected } = useProductVariant();

  return (
    <div className="lg:py-1">
      {product.brand ? (
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand/80">
          {product.brand}
        </p>
      ) : null}

      <h1 className="display mt-2 text-3xl leading-tight sm:text-4xl">
        {product.name}
      </h1>

      {selected && product.variants.length > 1 ? (
        <p className="mt-2 text-sm text-white/45 lg:hidden">
          Selected: <span className="text-white/75">{selected.name}</span>
        </p>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
          About this item
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
          {product.description}
        </p>
      </div>

      {product.shortSpecs.length > 0 ? (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
            Highlights
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.shortSpecs.slice(0, 6).map((s) => (
              <li
                key={s}
                className="rounded-pill border border-white/10 bg-ink-900/60 px-3 py-1.5 text-xs font-medium text-white/70"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-8 max-w-md">
        <ProductActions product={product} />
      </div>

      <ul className="mt-8 space-y-2.5 text-sm text-white/55">
        <li className="flex items-start gap-2.5">
          <Icon name="truck" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>{siteConfig.deliveryNote}</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="wallet" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>Pay with MTN, Airtel or Zamtel Mobile Money at checkout.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>
            Pickup at UNZA, Kalingalinga or Balastone — or message us on
            WhatsApp anytime.
          </span>
        </li>
      </ul>
    </div>
  );
}
