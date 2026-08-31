"use client";

import { Product } from "@/lib/types";
import { ProductActions } from "@/components/ProductActions";
import { useProductVariant } from "@/components/ProductVariantContext";
import { Icon } from "@/components/Icons";
import { siteConfig } from "@/config/site";
import { getProductExtras } from "@/lib/product-extras";

export function ProductDetailInfo({ product }: { product: Product }) {
  const { selected } = useProductVariant();
  const extras = getProductExtras(product);

  return (
    <div className="mt-8 border-t border-gp-border/80 pt-8 lg:mt-10">
      {selected && product.variants.length > 1 ? (
        <p className="mb-4 text-sm text-gp-text-muted">
          Selected:{" "}
          <span className="font-semibold text-gp-text">{selected.name}</span>
        </p>
      ) : null}

      {extras.summary ? (
        <p className="text-sm leading-relaxed text-gp-text-muted sm:text-[15px]">
          {extras.summary}
        </p>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] border border-gp-border/80 bg-gp-muted/40 p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-muted">
          Description
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gp-text sm:text-[15px]">
          {product.description}
        </p>
      </div>

      {(extras.features?.length ?? 0) > 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-muted">
            Specs &amp; features
          </p>
          <ul className="mt-3 space-y-2">
            {extras.features!.map((s) => (
              <li
                key={s}
                className="flex items-start gap-2.5 text-sm text-gp-text"
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
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-muted">
            Highlights
          </p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {product.shortSpecs.slice(0, 8).map((s) => (
              <li
                key={s}
                className="rounded-pill border border-gp-border bg-white px-3 py-1.5 text-xs font-medium text-gp-text"
              >
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {extras.boxContents && extras.boxContents.length > 0 ? (
        <div className="mt-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-muted">
            What&apos;s in the box
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-gp-text-muted">
            {extras.boxContents.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-6 rounded-[1.25rem] border border-gp-border/80 bg-white p-4 sm:p-5">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gp-text-muted">
          Delivery &amp; pickup
        </p>
        <p className="mt-2 text-sm leading-relaxed text-gp-text-muted">
          {extras.deliveryNote ?? siteConfig.deliveryNote}
        </p>
        {extras.warranty ? (
          <p className="mt-3 border-t border-gp-border/70 pt-3 text-sm text-gp-text-muted">
            <span className="font-semibold text-gp-text">Warranty: </span>
            {extras.warranty}
          </p>
        ) : null}
      </div>

      <div className="mt-8 max-w-md">
        <ProductActions product={product} />
      </div>

      <ul className="mt-8 space-y-2.5 text-sm text-gp-text-muted">
        <li className="flex items-start gap-2.5">
          <Icon name="wallet" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>Pay with MTN, Airtel or Zamtel Mobile Money at checkout.</span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="map-pin" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            Pickup at UNZA, Kalingalinga or Balastone — or message us anytime.
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <Icon name="shield" className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <span>
            Genuine products · Fair prices · Fast service · Excellent customer
            service.
          </span>
        </li>
      </ul>
    </div>
  );
}
