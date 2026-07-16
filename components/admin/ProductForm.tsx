import Link from "next/link";
import { saveProduct, deleteProduct } from "@/app/admin/(dashboard)/products/actions";

type Category = { slug: string; name: string };

type ProductFormData = {
  id: string;
  name: string;
  brand: string;
  categorySlug: string;
  price: number;
  compareAtPrice: number | null;
  description: string;
  shortSpecs: string[];
  stock: string;
  featured: boolean;
  hotDeal: boolean;
  imageUrls: string[];
};

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";
const label = "text-sm text-white/60";

export function ProductForm({
  categories,
  product,
  canDelete
}: {
  categories: Category[];
  product?: ProductFormData;
  canDelete?: boolean;
}) {
  const isEdit = Boolean(product?.id);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin/products" className="hover:text-white">
          Products
        </Link>
        <span>/</span>
        <span className="text-white/70">
          {isEdit ? "Edit product" : "New product"}
        </span>
      </div>

      <form action={saveProduct} className="max-w-2xl space-y-5">
        {isEdit && <input type="hidden" name="id" value={product!.id} />}

        <div>
          <label className={label}>Product name</label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className={field}
            placeholder="e.g. iPhone 13 128GB"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Brand (optional)</label>
            <input
              name="brand"
              defaultValue={product?.brand}
              className={field}
              placeholder="e.g. Apple"
            />
          </div>
          <div>
            <label className={label}>Category</label>
            <select
              name="categorySlug"
              defaultValue={product?.categorySlug ?? categories[0]?.slug}
              className={field}
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Price (ZMW)</label>
            <input
              name="price"
              type="number"
              min={0}
              defaultValue={product?.price}
              required
              className={field}
              placeholder="e.g. 12500"
            />
          </div>
          <div>
            <label className={label}>Compare-at price (optional)</label>
            <input
              name="compareAtPrice"
              type="number"
              min={0}
              defaultValue={product?.compareAtPrice ?? undefined}
              className={field}
              placeholder="Original price for a deal"
            />
          </div>
        </div>

        <div>
          <label className={label}>Stock status</label>
          <select
            name="stock"
            defaultValue={product?.stock ?? "in_stock"}
            className={field}
          >
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="sold_out">Sold Out</option>
          </select>
        </div>

        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            defaultValue={product?.description}
            rows={3}
            className={field}
            placeholder="Short description of the product"
          />
        </div>

        <div>
          <label className={label}>Key specs (one per line)</label>
          <textarea
            name="shortSpecs"
            defaultValue={product?.shortSpecs.join("\n")}
            rows={3}
            className={field}
            placeholder={"128GB storage\n6.1-inch OLED\nDual camera"}
          />
        </div>

        <div>
          <label className={label}>Image URLs (one per line)</label>
          <textarea
            name="imageUrls"
            defaultValue={product?.imageUrls.join("\n")}
            rows={3}
            className={field}
            placeholder="https://... (paste photo links)"
          />
          <p className="mt-1 text-xs text-white/40">
            Paste image links. Direct file uploads come with cloud image
            hosting.
          </p>
        </div>

        <div className="flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              name="featured"
              defaultChecked={product?.featured}
              className="h-4 w-4 accent-[#f6d400]"
            />
            Featured (Handpicked for you)
          </label>
          <label className="flex items-center gap-2 text-sm text-white/70">
            <input
              type="checkbox"
              name="hotDeal"
              defaultChecked={product?.hotDeal}
              className="h-4 w-4 accent-[#f6d400]"
            />
            Hot Deal
          </label>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            className="rounded-pill bg-brand px-6 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft"
          >
            {isEdit ? "Save changes" : "Create product"}
          </button>
          <Link
            href="/admin/products"
            className="rounded-pill border border-ink-700 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      {isEdit && canDelete && (
        <form action={deleteProduct} className="mt-10 max-w-2xl border-t border-ink-800 pt-6">
          <input type="hidden" name="id" value={product!.id} />
          <button
            type="submit"
            className="rounded-pill border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20"
          >
            Delete product
          </button>
          <p className="mt-2 text-xs text-white/40">
            This permanently removes the product and its images.
          </p>
        </form>
      )}
    </div>
  );
}
