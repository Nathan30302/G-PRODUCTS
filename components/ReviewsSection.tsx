import { Icon } from "@/components/Icons";
import { LeaveReviewForm } from "@/components/LeaveReviewForm";
import {
  averageRating,
  getProductReviews,
  getStoreReviews,
  type Review
} from "@/lib/reviews";
import { whatsappHref } from "@/config/site";

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Icon
          key={i}
          name="star"
          className={`h-3.5 w-3.5 ${
            i < Math.round(rating) ? "text-brand" : "text-white/20"
          }`}
        />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="rounded-[1.25rem] border border-white/[0.07] bg-ink-900/50 p-5">
      <div className="flex items-center justify-between gap-3">
        <Stars rating={review.rating} />
        {review.verifiedPurchase ? (
          <span className="text-[10px] font-semibold uppercase tracking-wide text-accent">
            Verified
          </span>
        ) : null}
      </div>
      {review.title ? (
        <h3 className="mt-3 text-sm font-bold text-white">{review.title}</h3>
      ) : null}
      <p className="mt-2 text-sm leading-relaxed text-white/60">{review.body}</p>
      <p className="mt-4 text-xs text-white/35">
        {review.author}
        {review.date
          ? ` · ${new Date(review.date).toLocaleDateString("en-ZM", {
              month: "short",
              year: "numeric"
            })}`
          : ""}
      </p>
    </article>
  );
}

function EmptyReviews({ context }: { context: "store" | "product" }) {
  return (
    <div className="rounded-[1.25rem] border border-dashed border-white/[0.12] bg-white/[0.02] px-6 py-10 text-center">
      <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-brand/10 text-brand ring-1 ring-brand/20">
        <Icon name="star" className="h-5 w-5" />
      </span>
      <p className="mt-4 text-sm font-semibold text-white">
        {context === "store"
          ? "Be the first to leave a review"
          : "No reviews for this product yet"}
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-white/45">
        We only publish genuine customer feedback — never fake ratings.
      </p>
      <a
        href={whatsappHref(
          "Hi G-Products, I'd like to leave a review after my purchase."
        )}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-whatsapp mt-5 inline-flex"
      >
        Share feedback on WhatsApp
      </a>
    </div>
  );
}

export async function StoreReviewsSection() {
  const list = await getStoreReviews();
  const avg = averageRating(list);

  return (
    <section className="container-g mt-16 sm:mt-20">
      <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Reviews</p>
          <h2 className="display mt-2 text-2xl sm:text-3xl">
            Customer reviews
          </h2>
          <p className="mt-2 max-w-md text-sm text-white/50">
            Real feedback from shoppers — never invented testimonials.
          </p>
        </div>
        {avg != null ? (
          <div className="text-right">
            <p className="text-2xl font-extrabold tabular-nums text-brand">
              {avg}
            </p>
            <Stars rating={avg} />
            <p className="mt-1 text-xs text-white/40">{list.length} reviews</p>
          </div>
        ) : null}
      </div>

      {list.length === 0 ? (
        <EmptyReviews context="store" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((r) => (
            <ReviewCard key={r.id} review={r} />
          ))}
        </div>
      )}
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
