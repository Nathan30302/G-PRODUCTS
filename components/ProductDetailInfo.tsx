"use client";

import { Product } from "@/lib/types";
import { ProductActions } from "@/components/ProductActions";
import { useProductVariant } from "@/components/ProductVariantContext";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import { getProductExtras } from "@/lib/product-extras";
import { StockBadge } from "@/components/StockBadge";

export function ProductDetailInfo({ product }: { product: Product }) {
  const { selected } = useProductVariant();
  const extras = getProductExtras(product);

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

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <StockBadge status={product.stock} />
        {selected && product.variants.length > 1 ? (
          <p className="text-sm text-white/45">
            Selected: <span className="text-white/75">{selected.name}</span>
          </p>
        ) : null}
      </div>

      {extras.summary ? (
        <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-[15px]">
          {extras.summary}
        </p>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] border border-white/[0.07] bg-white/[0.02] p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
          Description
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/70 sm:text-[15px]">
          {product.description}
        </p>
      </div>

      {(extras.features?.length ?? 0) > 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
            Specs &amp; features
          </p>
          <ul className="mt-3 space-y-2">
            {extras.features!.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2.5 text-sm text-white/70"
              >
                <Icon
                  name="check"
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent"
                />
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : product.shortSpecs.length > 0 ? (
        <div className="mt-5">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
            Highlights
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.shortSpecs.slice(0, 8).map((s) => (
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

      {extras.boxContents && extras.boxContents.length > 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
            What&apos;s in the box
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-white/65">
            {extras.boxContents.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] border border-white/[0.07] bg-ink-900/40 p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-white/35">
          Delivery &amp; pickup
        </p>
        <p className="mt-2 text-sm leading-relaxed text-white/65">
          {extras.deliveryNote ?? siteConfig.deliveryNote}
        </p>
        {extras.warranty ? (
          <p className="mt-3 border-t border-white/[0.06] pt-3 text-sm text-white/55">
            <span className="font-semibold text-white/75">Warranty: </span>
            {extras.warranty}
          </p>
        ) : null}
      </div>

      <div className="mt-8 max-w-md">
        <ProductActions product={product} />
      </div>

      <ul className="mt-8 space-y-2.5 text-sm text-white/55">
        <li className="flex items-start gap-2.5">
          <Icon name="wallet" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>Pay with MTN, Airtel or Zamtel Mobile Money at checkout.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>
            Pickup at UNZA, Kalingalinga or Balastone — or message us anytime.
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
          <span>
            Genuine products · Fair prices · Fast service · Excellent customer
            service.
          </span>
        </li>
      </ul>
    </div>
  );
}
