"use client";

import { useActionState } from "react";
import {
  deleteReview,
  toggleReviewPublished,
  type ReviewActionState
} from "@/app/admin/(dashboard)/reviews/actions";

type ReviewRow = {
  id: string;
  productName: string;
  productSlug: string;
  authorName: string;
  rating: number;
  title: string | null;
  body: string;
  verifiedPurchase: boolean;
  published: boolean;
  createdAt: string;
};

export function ReviewModerationRow({ review }: { review: ReviewRow }) {
  const [toggleState, toggleAction, togglePending] = useActionState<
    ReviewActionState | undefined,
    FormData
  >(toggleReviewPublished, undefined);
  const [deleteState, deleteAction, deletePending] = useActionState<
    ReviewActionState | undefined,
    FormData
  >(deleteReview, undefined);

  return (
    <li className="px-5 py-4 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-white">{review.productName}</p>
            <span className="text-[10px] font-bold uppercase tracking-wide text-brand">
              {review.rating}/5
            </span>
            {review.verifiedPurchase ? (
              <span className="rounded-pill bg-accent/15 px-2 py-0.5 text-[10px] font-bold uppercase text-accent">
                Verified
              </span>
            ) : null}
            <span
              className={`rounded-pill px-2 py-0.5 text-[10px] font-bold uppercase ${
                review.published
                  ? "bg-accent/15 text-accent"
                  : "bg-white/10 text-white/45"
              }`}
            >
              {review.published ? "Live" : "Hidden"}
            </span>
          </div>
          {review.title ? (
            <p className="mt-1 text-sm font-medium text-white/80">
              {review.title}
            </p>
          ) : null}
          <p className="mt-1 text-sm leading-relaxed text-white/55">
            {review.body}
          </p>
          <p className="mt-2 text-xs text-white/35">
            {review.authorName} ·{" "}
            {new Date(review.createdAt).toLocaleDateString("en-ZM", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}{" "}
            · /product/{review.productSlug}
          </p>
          {toggleState?.error || deleteState?.error ? (
            <p className="mt-2 text-xs text-red-300">
              {toggleState?.error ?? deleteState?.error}
            </p>
          ) : null}
          {toggleState?.success || deleteState?.success ? (
            <p className="mt-2 text-xs text-accent">
              {toggleState?.success ?? deleteState?.success}
            </p>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-wrap gap-2">
          <form action={toggleAction}>
            <input type="hidden" name="id" value={review.id} />
            <input
              type="hidden"
              name="published"
              value={review.published ? "0" : "1"}
            />
            <button
              type="submit"
              disabled={togglePending}
              className="rounded-pill border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/70 transition-colors hover:border-brand/40 hover:text-brand disabled:opacity-50"
            >
              {togglePending
                ? "…"
                : review.published
                  ? "Hide"
                  : "Publish"}
            </button>
          </form>
          <form action={deleteAction}>
            <input type="hidden" name="id" value={review.id} />
            <button
              type="submit"
              disabled={deletePending}
              className="rounded-pill px-3 py-1.5 text-xs font-semibold text-red-400/80 transition-colors hover:text-red-300 disabled:opacity-50"
            >
              {deletePending ? "…" : "Delete"}
            </button>
          </form>
        </div>
      </div>
    </li>
  );
}
