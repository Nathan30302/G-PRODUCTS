import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader,
  DeskEmpty
} from "@/components/admin/desk";
import { ReviewModerationRow } from "@/components/admin/ReviewModerationRow";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reviews" };

export default async function AdminReviewsPage() {
  await requireUser();

  const reviews = await prisma.productReview.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });

  const publishedCount = reviews.filter((r) => r.published).length;

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Storefront"
        title="Reviews"
        description="Moderate customer reviews. Hidden reviews stay in the desk but do not show on the shop or product pages."
      />

      <DeskPanel>
        <DeskPanelHeader
          title="All reviews"
          subtitle={`${reviews.length} total · ${publishedCount} live`}
        />
        {reviews.length === 0 ? (
          <DeskEmpty
            title="No reviews yet"
            description="When customers leave a review on a product page, it will appear here for moderation."
          />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {reviews.map((r) => (
              <ReviewModerationRow
                key={r.id}
                review={{
                  id: r.id,
                  productName: r.productName,
                  productSlug: r.productSlug,
                  authorName: r.authorName,
                  rating: r.rating,
                  title: r.title,
                  body: r.body,
                  verifiedPurchase: r.verifiedPurchase,
                  published: r.published,
                  createdAt: r.createdAt.toISOString()
                }}
              />
            ))}
          </ul>
        )}
      </DeskPanel>
    </div>
  );
}
