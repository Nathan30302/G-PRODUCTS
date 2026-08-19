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
import { CategoryPicker } from "@/components/admin/CategoryPicker";
import { Icon } from "@/components/Icons";
import { SafeImage } from "@/components/SafeImage";
import { formatPrice } from "@/lib/format";

type Category = {
  slug: string;
  name: string;
  tagline?: string;
  icon?: string;
};

type ProductFormData = {
  id: string;
  slug?: string;
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
  coverUrl?: string;
};

const field =
  "mt-1.5 w-full rounded-xl border border-white/10 bg-ink-950/80 px-4 py-3 text-white outline-none transition-all placeholder:text-white/25 focus:border-brand/50 focus:bg-ink-950 focus:ring-2 focus:ring-brand/15";
const label =
  "text-xs font-semibold uppercase tracking-[0.12em] text-white/45";

const STEPS = [
  { n: 1, label: "Basics" },
  { n: 2, label: "Category" },
  { n: 3, label: "Colours" },
  { n: 4, label: "Details" }
];

function Section({
  step,
  title,
  subtitle,
  children
}: {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.35rem] border border-white/[0.07] bg-gradient-to-b from-ink-900/60 to-ink-950/40 shadow-card">
      <div className="border-b border-white/[0.06] px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-brand/15 text-xs font-black text-brand">
            {step}
          </span>
          <div>
            <h2 className="text-lg font-bold text-white">{title}</h2>
            {subtitle && (
              <p className="mt-0.5 text-sm text-white/45">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function SubmitButton({
  isEdit,
  className = ""
}: {
  isEdit: boolean;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center justify-center gap-2 rounded-pill bg-brand px-8 py-3.5 text-sm font-bold text-ink-950 shadow-brand-glow transition-all duration-200 ease-out-expo hover:bg-brand-soft hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0 ${className}`}
    >
      {pending ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950" />
          Saving…
        </>
      ) : isEdit ? (
        <>
          <Icon name="check" className="h-4 w-4" />
          Save product
        </>
      ) : (
        <>
          <Icon name="plus" className="h-4 w-4" />
          Create product
        </>
      )}
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
  const coverUrl =
    product?.coverUrl ??
    product?.variants?.[0]?.imageUrls?.[0] ??
    product?.sharedImageUrls?.[0];

  const [state, action] = useActionState<ProductFormState | undefined, FormData>(
    saveProduct,
    undefined
  );

  return (
    <div className="space-y-6 pb-24 lg:pb-8">
      <div className="relative overflow-hidden rounded-[1.85rem] border border-white/[0.07] bg-gradient-to-br from-ink-850 via-ink-900 to-ink-950 shadow-card">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-brand/10 blur-[90px]" />
        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
          {isEdit && coverUrl && (
            <div className="relative mx-auto h-24 w-24 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/10 sm:mx-0 sm:h-28 sm:w-28">
              <SafeImage
                src={coverUrl}
                alt={product?.name ?? "Product"}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
          )}
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-brand">
              {isEdit ? "Editing" : "New listing"}
            </p>
            <h1 className="display mt-1 text-2xl sm:text-3xl">
              {isEdit ? product!.name : "Add product"}
            </h1>
            {isEdit && (
              <p className="mt-2 text-lg font-black text-white/90">
                {formatPrice(product!.price)}
              </p>
            )}
            <p className="mt-2 text-sm text-white/50">
              {isEdit
                ? "Update prices, colours, and photos — your changes go live after saving."
                : "A clear flow: basics, category, colours with photos, then details."}
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap justify-center gap-2 sm:flex-col sm:items-end">
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:border-brand/30 hover:text-brand"
            >
              <Icon name="chevron-left" className="h-4 w-4" />
              All products
            </Link>
            {isEdit && product?.slug && (
              <Link
                href={`/product/${product.slug}`}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-pill border border-white/10 bg-white/[0.03] px-4 py-2.5 text-sm font-semibold text-white/70 transition-colors hover:border-accent/30 hover:text-accent"
              >
                <Icon name="external" className="h-4 w-4" />
                View on shop
              </Link>
            )}
          </div>
        </div>

        <div className="border-t border-white/[0.06] px-4 py-3 sm:px-8">
          <div className="flex items-center justify-between gap-2">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="flex flex-1 flex-col items-center gap-1.5"
              >
                <span className="grid h-7 w-7 place-items-center rounded-full bg-brand/15 text-[11px] font-black text-brand ring-1 ring-brand/25">
                  {s.n}
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {categories.length === 0 ? (
        <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          No categories found. Redeploy so the catalog can seed, then try again.
        </p>
      ) : null}

      <form action={action} className="mx-auto max-w-3xl space-y-5">
        {isEdit && <input type="hidden" name="id" value={product!.id} />}

        <Section
          step={1}
          title="Basics"
          subtitle="Name, brand, and pricing"
        >
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

        <Section
          step={2}
          title="Category"
          subtitle="Where customers will find this item"
        >
          <CategoryPicker
            categories={categories}
            defaultSlug={selectedCategory}
          />
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

        <Section step={4} title="Details & visibility">
          <div>
            <label className={label}>Description</label>
            <textarea
              name="description"
              defaultValue={product?.description}
              rows={4}
              className={field}
              placeholder="Short description customers will read on the product page"
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

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition-colors has-[:checked]:border-brand/40 has-[:checked]:bg-brand/[0.08]">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured}
                className="h-4 w-4 accent-[#f6d400]"
              />
              <span>
                <span className="block text-sm font-semibold text-white">
                  Featured
                </span>
                <span className="block text-xs text-white/40">
                  Show on homepage
                </span>
              </span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5 transition-colors has-[:checked]:border-accent/40 has-[:checked]:bg-accent/[0.08]">
              <input
                type="checkbox"
                name="hotDeal"
                defaultChecked={product?.hotDeal}
                className="h-4 w-4 accent-[#22c98a]"
              />
              <span>
                <span className="block text-sm font-semibold text-white">
                  Hot deal
                </span>
                <span className="block text-xs text-white/40">
                  Highlight as a special offer
                </span>
              </span>
            </label>
          </div>
        </Section>

        {state?.error ? (
          <p className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </p>
        ) : null}

        <div className="hidden flex-wrap items-center gap-3 pt-2 lg:flex">
          <SubmitButton isEdit={isEdit} />
          <Link
            href="/admin/products"
            className="rounded-pill border border-white/10 px-6 py-3.5 text-sm font-semibold text-white/70 transition-colors hover:border-white/20 hover:text-white"
          >
            Cancel
          </Link>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/[0.08] bg-ink-950/95 p-4 backdrop-blur-xl lg:hidden">
          <div className="mx-auto flex max-w-3xl gap-2">
            <Link
              href="/admin/products"
              className="rounded-pill border border-white/10 px-4 py-3 text-sm font-semibold text-white/70"
            >
              Cancel
            </Link>
            <div className="min-w-0 flex-1">
              <SubmitButton isEdit={isEdit} className="w-full" />
            </div>
          </div>
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
            className="inline-flex items-center gap-2 rounded-pill border border-red-500/40 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
          >
            <Icon name="trash" className="h-4 w-4" />
            Delete product
          </button>
        </form>
      )}
    </div>
  );
}
