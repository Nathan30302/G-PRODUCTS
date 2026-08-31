import Link from "next/link";
import type { Product } from "@/lib/types";
import type { Review } from "@/lib/reviews";
import { coverImageForProduct } from "@/lib/product-images";
import { SafeImage } from "@/components/SafeImage";
import { Icon } from "@/components/Icons";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          className={`h-3 w-3 ${
            i < Math.round(rating) ? "text-brand-dark" : "text-gp-border"
          }`}
        />
      ))}
    </div>
  );
}

/** Horizontal review stories — "Trusted by Many, Loved by all." */
export function HomeReviewsRail({
  reviews,
  productsBySlug
}: {
  reviews: Review[];
  productsBySlug: Map<string, Product>;
}) {
  if (reviews.length === 0) return null;

  return (
    <section className="container-g mt-10 sm:mt-12">
      <h2 className="text-center font-display text-[clamp(1.125rem,0.9rem+1vw,1.5rem)] font-extrabold text-gp-text">
        Trusted by Many, Loved by all.
      </h2>

      <div className="no-scrollbar snap-rail relative mt-6 -mx-4 flex gap-3 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:gap-4 sm:px-6">
        {reviews.slice(0, 8).map((review) => (
          <ReviewStoryCard
            key={review.id}
            review={review}
            product={
              review.productSlug
                ? productsBySlug.get(review.productSlug)
                : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}

function ReviewStoryCard({
  review,
  product
}: {
  review: Review;
  product?: Product;
}) {
  const variant =
    product?.variants.find((v) => v.available) ??
    product?.variants[0] ??
    null;
  const heroImage = product
    ? coverImageForProduct(product, variant)
    : null;
  const productHref = product
    ? `/product/${product.slug}`
    : review.productSlug
      ? `/product/${review.productSlug}`
      : "/search";

  return (
    <article className="snap-item flex w-[17rem] shrink-0 flex-col overflow-hidden rounded-[1.25rem] border border-gp-border/70 bg-white shadow-card sm:w-[18.5rem]">
      {heroImage ? (
        <div className="relative aspect-[4/3] bg-gp-muted/60">
          <SafeImage
            src={heroImage}
            alt=""
            fill
            sizes="296px"
            className="object-cover object-center"
          />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-bold text-gp-text">{review.author}</p>
          {review.verifiedPurchase ? (
            <span className="rounded-pill bg-accent/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-accent-dark">
              Verified buyer
            </span>
          ) : null}
        </div>
        <div className="mt-1">
          <Stars rating={review.rating} />
        </div>

        {review.title ? (
          <h3 className="mt-3 text-sm font-extrabold leading-snug text-gp-text">
            {review.title}
          </h3>
        ) : null}
        <p className="mt-2 line-clamp-4 flex-1 text-sm leading-relaxed text-gp-text-muted">
          {review.body}
        </p>

        <div className="mt-4 flex items-center gap-3 border-t border-gp-border/70 pt-3">
          {heroImage ? (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-gp-muted">
              <SafeImage
                src={heroImage}
                alt=""
                fill
                sizes="40px"
                className="object-contain p-1"
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-gp-text">
              {review.productName ?? product?.name ?? "G-Products"}
            </p>
            <Link
              href={productHref}
              className="text-xs font-bold text-ink-700 hover:underline"
            >
              Shop now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
