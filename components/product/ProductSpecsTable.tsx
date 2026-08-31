import { Product } from "@/lib/types";
import { getProductExtras } from "@/lib/product-extras";

function parseSpecLine(line: string): { label: string; value: string } | null {
  const colon = line.indexOf(":");
  if (colon > 0) {
    return {
      label: line.slice(0, colon).trim(),
      value: line.slice(colon + 1).trim()
    };
  }
  const dash = line.indexOf(" — ");
  if (dash > 0) {
    return {
      label: line.slice(0, dash).trim(),
      value: line.slice(dash + 3).trim()
    };
  }
  return null;
}

export function ProductSpecsTable({ product }: { product: Product }) {
  const extras = getProductExtras(product);
  const rows: Array<{ label: string; value: string }> = [];

  if (product.brand) {
    rows.push({ label: "Brand", value: product.brand });
  }
  rows.push({ label: "Product", value: product.name });

  for (const line of extras.features ?? product.shortSpecs) {
    const parsed = parseSpecLine(line);
    if (parsed) rows.push(parsed);
  }

  if (rows.length <= 1) return null;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gp-border">
      <div className="border-b border-gp-border px-4 py-3.5">
        <h2 className="text-base font-bold text-gp-text">Product Specifications</h2>
      </div>
      <dl>
        {rows.map((row, i) => (
          <div
            key={`${row.label}-${i}`}
            className="flex items-start justify-between gap-4 border-b border-gp-border px-4 py-3.5 text-sm last:border-0"
          >
            <dt className="font-bold text-gp-text">{row.label}</dt>
            <dd className="text-right font-bold text-gp-text">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
