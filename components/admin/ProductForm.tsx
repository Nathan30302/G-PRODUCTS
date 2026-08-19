"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  saveProduct,
  deleteProduct,
  type ProductFormState
} from "@/app/admin/(dashboard)/products/actions";
import { VariantEditor, type VariantRow } from "@/components/admin/VariantEditor";
import { Icon } from "@/components/Icons";

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
  sharedImageUrls: string[];
  variants: VariantRow[];
};

const field =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950 px-4 py-2.5 text-white outline-none transition-colors focus:border-brand/50";
const label = "text-xs font-semibold uppercase tracking-[0.12em] text-white/45";

function Section({
  eyebrow,
  title,
  children
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[1.35rem] border border-white/[0.07] bg-ink-900/50 p-5 shadow-card sm:p-6">
      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand/80">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-lg font-bold text-white">{title}</h2>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-pill bg-brand px-7 py-3 text-sm font-bold text-ink-950 shadow-brand-glow transition-all hover:bg-brand-soft disabled:opacity-60"
    >
      {pending ? "Saving…" : isEdit ? "Save product" : "Create product"}
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
  const selectedCategory = product?.categorySlug ?? categories[0]?.slug;
  const [state, action] = useActionState<ProductFormState | undefined, FormData>(
    saveProduct,
    undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
            Catalogue
          </p>
          <h1 className="mt-1 text-3xl font-black tracking-tight text-white">
            {isEdit ? "Edit product" : "Add product"}
          </h1>
          <p className="mt-2 text-sm text-white/50">
            Pick a category, then add each colour with its own photos.
          </p>
        </div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
        >
          <Icon name="chevron-left" className="h-4 w-4" />
          Back to products
        </Link>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          No categories found. Redeploy so the catalog can seed, then try again.
        </p>
      ) : null}

      <form action={action} className="mx-auto max-w-3xl space-y-5">
        {isEdit && <input type="hidden" name="id" value={product!.id} />}

        <Section eyebrow="Step 1" title="Basics">
          <div>
            <label className={label}>Product name</label>
            <input
              name="name"
              defaultValue={product?.name}
              required
              className={field}
              placeholder="e.g. Samsung Galaxy Buds"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className={label}>Brand (optional)</label>
              <input
                name="brand"
                defaultValue={product?.brand}
                className={field}
                placeholder="e.g. Samsung"
              />
            </div>
            <div>
              <label className={label}>Price (ZMW)</label>
              <input
                name="price"
                type="number"
                min={1}
                defaultValue={product?.price}
                required
                className={field}
              />
            </div>
          </div>

          <div>
            <label className={label}>Compare-at price (optional)</label>
            <input
              name="compareAtPrice"
              type="number"
              min={0}
              defaultValue={product?.compareAtPrice ?? undefined}
              className={field}
              placeholder="Show a deal when higher than price"
            />
          </div>
        </Section>

        <Section eyebrow="Step 2" title="Category">
          <p className="-mt-2 text-sm text-white/45">
            Group this item so customers and staff find it in the right section
            — Audio, Power, Storage, Computers, and so on.
          </p>
          <div className="grid gap-2 sm:grid-cols-2">
            {categories.map((c) => (
              <label
                key={c.slug}
                className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
                  c.slug === selectedCategory
                    ? "border-brand/50 bg-brand/10"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                }`}
              >
                <input
                  type="radio"
                  name="categorySlug"
                  value={c.slug}
                  defaultChecked={c.slug === selectedCategory}
                  className="h-4 w-4 accent-[#f6d400]"
                  required
                />
                <span className="text-sm font-semibold text-white">{c.name}</span>
              </label>
            ))}
          </div>
        </Section>

        <VariantEditor
          initial={
            product?.variants?.length
              ? product.variants
              : [
                  {
                    name: "Black",
                    colorHex: "#111111",
                    quantity: 5,
                    imageUrls: []
                  }
                ]
          }
        />

        <Section eyebrow="Step 4" title="Details & visibility">
          <div>
            <label className={label}>Description</label>
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={3}
              className={field}
              placeholder="Short description customers will read"
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

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="h-4 w-4 accent-[#f6d400]"
              />
              Featured on homepage
            </label>
            <label className="flex items-center gap-2 text-sm text-white/70">
              <input
                type="checkbox"
                name="hotDeal"
                defaultChecked={product?.hotDeal}
                className="h-4 w-4 accent-[#f6d400]"
              />
              Hot deal
            </label>
          </div>
        </Section>

        {state?.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <SubmitButton isEdit={isEdit} />
          <Link
            href="/admin/products"
            className="rounded-pill border border-white/10 px-6 py-3 text-sm font-semibold text-white/70 hover:text-white"
          >
            Cancel
          </Link>
        </div>
      </form>

      {isEdit && canDelete && (
        <form
          action={deleteProduct}
          className="mx-auto max-w-3xl border-t border-white/[0.06] pt-6"
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
