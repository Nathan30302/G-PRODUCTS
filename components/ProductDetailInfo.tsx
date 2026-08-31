"use client";

import { Product } from "@/lib/types";
import { useProductVariant } from "@/components/ProductVariantContext";
import { getProductExtras } from "@/lib/product-extras";
import { ProductAccordion } from "@/components/product/ProductAccordion";

export function ProductDetailInfo({ product }: { product: Product }) {
  const { selected } = useProductVariant();
  const extras = getProductExtras(product);
  const techLines = extras.features?.length
    ? extras.features
    : product.shortSpecs;

  return (
    <div className="mt-2 px-4 sm:px-0">
      <ProductAccordion title="Description" defaultOpen={false}>
        {extras.summary ? (
          <p className="mb-3 text-gp-text">{extras.summary}</p>
        ) : null}
        <p className="whitespace-pre-line text-gp-text">{product.description}</p>
        {extras.boxContents && extras.boxContents.length > 0 ? (
          <div className="mt-4">
            <p className="font-bold text-gp-text">What&apos;s in the box</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {extras.boxContents.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </ProductAccordion>

      {techLines.length > 0 ? (
        <ProductAccordion title="Tech Specification" defaultOpen={false}>
          <ul className="space-y-3">
            {techLines.map((line) => (
              <li key={line} className="text-gp-text">
                {line}
              </li>
            ))}
          </ul>
        </ProductAccordion>
      ) : null}

      {selected && product.variants.length > 1 ? (
        <p className="mt-4 text-sm text-gp-text-muted">
          Selected:{" "}
          <span className="font-semibold text-gp-text">{selected.name}</span>
        </p>
      ) : null}

      {extras.warranty ? (
        <p className="mt-4 text-sm text-gp-text-muted">
          <span className="font-semibold text-gp-text">Warranty: </span>
          {extras.warranty}
        </p>
      ) : null}
    </div>
  );
}
