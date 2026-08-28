import { Icon } from "@/components/Icons";
import { LeaveReviewForm } from "@/components/LeaveReviewForm";
import {
  averageRating,
  getProductReviews,
  getStoreReviews,
  type Review
} from "@/lib/reviews";
import { whatsappHref } from "@/config/site";

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "h-5 w-5" : "h-3.5 w-3.5";
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          className={`${cls} ${
            i < Math.round(rating) ? "text-brand" : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({
  review,
  featured = false
}: {
  review: Review;
  featured?: boolean;
}) {
  return (
    <article
      className={`relative overflow-hidden rounded-[1.35rem] border bg-ink-900/50 ${
        featured
          ? "border-brand/25 bg-gradient-to-br from-brand/[0.08] via-ink-900/70 to-ink-950/80 p-7 sm:p-8"
          : "border-white/[0.07] p-5"
      }`}
    >
      {featured ? (
        <span
          className="pointer-events-none absolute -right-4 -top-2 select-none font-serif text-7xl leading-none text-brand/15"
          aria-hidden
        >
          “
        </span>
      ) : null}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Stars rating={review.rating} size={featured ? "lg" : "sm"} />
        {review.verifiedPurchase ? (
          <span className="rounded-pill bg-accent/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-accent">
            Verified purchase
          </span>
        ) : null}
      </div>
      {review.title ? (
        <h3
          className={`mt-4 font-bold text-white ${
            featured ? "text-lg sm:text-xl" : "text-sm"
          }`}
        >
          {review.title}
        </h3>
      ) : null}
      <p
        className={`mt-3 leading-relaxed text-white/70 ${
          featured ? "text-base sm:text-lg" : "text-sm"
        }`}
      >
        {review.body}
      </p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 text-xs text-white/40">
        <p>
          <span className="font-semibold text-white/70">{review.author}</span>
          {review.date
            ? ` · ${new Date(review.date).toLocaleDateString("en-ZM", {
                month: "short",
                year: "numeric"
              })}`
            : ""}
        </p>
        {review.productName ? (
          <span className="rounded-pill border border-white/10 px-2.5 py-1 text-[10px] text-white/45">
            {review.productName}
          </span>
        ) : null}
      </div>
    </article>
  );
}

function EmptyReviews({ context }: { context: "store" | "product" }) {
  return (
    <div className="rounded-[1.35rem] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-12 text-center">
      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
        <Icon name="star" className="h-6 w-6" />
      </span>
      <p className="mt-5 text-base font-semibold text-white">
        {context === "store"
          ? "Be the first to leave a review"
          : "No reviews for this product yet"}
      </p>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-white/45">
        We only publish genuine customer feedback — never fake ratings.
      </p>
      <a
        href={whatsappHref(
          "Hi G-Products, I'd like to leave a review after my purchase."
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-6 inline-flex"
      >
        Share feedback on WhatsApp
      </a>
    </div>
  );
}

export async function StoreReviewsSection() {
  const list = await getStoreReviews();
  const avg = averageRating(list);
  const [featured, ...rest] = list;

  return (
    <section id="reviews" className="container-g mt-14 sm:mt-16">
      <div className="overflow-hidden rounded-[1.75rem] border border-white/[0.08] bg-gradient-to-b from-ink-900/80 to-ink-950/40 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="eyebrow">What customers say</p>
            <h2 className="display heading-section mt-2">
              Real reviews from real shoppers
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-white/50 sm:text-base">
              Genuine feedback from people who use G-Products — published exactly
              as they wrote it.
            </p>
          </div>
          {avg != null ? (
            <div className="rounded-2xl border border-brand/20 bg-brand/[0.08] px-5 py-4 text-center sm:text-right">
              <p className="text-3xl font-extrabold tabular-nums text-brand sm:text-4xl">
                {avg}
              </p>
              <div className="mt-1 flex justify-center sm:justify-end">
                <Stars rating={avg} size="lg" />
              </div>
              <p className="mt-2 text-xs font-medium text-white/45">
                {list.length} review{list.length === 1 ? "" : "s"}
              </p>
            </div>
          ) : null}
        </div>

        {list.length === 0 ? (
          <div className="mt-8">
            <EmptyReviews context="store" />
          </div>
        ) : (
          <div className="mt-8 space-y-5">
            {featured ? <ReviewCard review={featured} featured /> : null}
            {rest.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </section>
  );
}

export async function ProductReviewsSection({
  productSlug,
  productName,
  defaultAuthorName = "",
  orderRef = "",
  showLeaveForm = true
}: {
  productSlug: string;
  productName: string;
  defaultAuthorName?: string;
  orderRef?: string;
  showLeaveForm?: boolean;
}) {
  const list = await getProductReviews(productSlug);
  const avg = averageRating(list);

  return (
    <section className="mt-12">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="display text-xl">Customer reviews</h2>
          <p className="mt-1 text-sm text-white/45">
            Ratings for {productName}
          </p>
        </div>
        {avg != null ? (
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tabular-nums text-brand">
              {avg}
            </span>
            <Stars rating={avg} />
            <span className="text-xs text-white/40">({list.length})</span>
          </div>
        ) : null}
      </div>

      {list.length === 0 ? (
        <EmptyReviews context="product" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {list.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}

      {showLeaveForm ? (
        <div className="mt-6 max-w-lg">
          <LeaveReviewForm
            productSlug={productSlug}
            productName={productName}
            defaultName={defaultAuthorName}
            orderRef={orderRef}
          />
        </div>
      ) : null}
    </section>
  );
}
