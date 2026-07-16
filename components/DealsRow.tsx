import { Product } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

export function DealsRow({
  title,
  subtitle,
  products
}: {
  title: string;
  subtitle?: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-g mt-14">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-white sm:text-2xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
        </div>
      </div>
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="w-56 shrink-0 sm:w-auto">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
