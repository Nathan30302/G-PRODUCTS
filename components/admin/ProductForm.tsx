"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveProduct,
  deleteProduct,
  type ProductFormState
} from "@/app/admin/(dashboard)/products/actions";
import { VariantEditor, type VariantRow } from "@/components/admin/VariantEditor";
import { ImageUploader } from "@/components/admin/ImageUploader";

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
  featured: boolean;
  hotDeal: boolean;
  imageUrls: string[];
  variants: VariantRow[];
};

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";
const label = "text-sm text-white/60";

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-brand px-6 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft disabled:opacity-60"
    >
      {pending ? "Saving…" : isEdit ? "Save changes" : "Create product"}
    </button>
  );
}

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
  const [state, action] = useActionState<ProductFormState | undefined, FormData>(
    saveProduct,
    undefined
  );

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

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          No categories found. Redeploy so the catalog can seed, then try again.
        </p>
      ) : null}

      <form action={action} className="max-w-2xl space-y-5">
        {isEdit && <input type="hidden" name="id" value={product!.id} />}

        <div>
          <label className={label}>Product name</label>
          <input
            name="name"
            defaultValue={product?.name}
            required
            className={field}
            placeholder="e.g. Wireless Mouse"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className={label}>Brand (optional)</label>
            <input
              name="brand"
              defaultValue={product?.brand}
              className={field}
              placeholder="e.g. Oraimo"
            />
          </div>
          <div>
            <label className={label}>Category</label>
            <select
              name="categorySlug"
              defaultValue={product?.categorySlug ?? categories[0]?.slug}
              className={field}
              required
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
              min={1}
              defaultValue={product?.price}
              required
              className={field}
              placeholder="e.g. 75"
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

        <VariantEditor
          initial={
            product?.variants?.length
              ? product.variants
              : [{ name: "Black", colorHex: "#111111", quantity: 5 }]
          }
        />

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
            placeholder={"Wireless\nLong battery\nPlug & play"}
          />
        </div>

        <ImageUploader
          name="imageUrls"
          folder="products"
          multiple
          label="Photos"
          initialUrls={product?.imageUrls ?? []}
        />

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

        {state?.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <div className="flex items-center gap-3 pt-2">
          <SubmitButton isEdit={isEdit} />
          <Link
            href="/admin/products"
            className="rounded-pill border border-ink-700 px-6 py-2.5 text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      {isEdit && canDelete && (
        <form
          action={deleteProduct}
          className="mt-10 max-w-2xl border-t border-ink-800 pt-6"
        >
          <input type="hidden" name="id" value={product!.id} />
          <button
            type="submit"
            className="rounded-pill border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 hover:bg-red-500/20"
          >
            Delete product
          </button>
        </form>
      )}
    </div>
  );
}
