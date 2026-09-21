import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader,
  DeskEmpty
} from "@/components/admin/desk";
import { BrowseTileForm } from "@/components/admin/BrowseTileForm";
import { BrowseTileDeleteButton } from "@/components/admin/BrowseTileDeleteButton";
import { SafeImage } from "@/components/SafeImage";

export const dynamic = "force-dynamic";
export const metadata = { title: "Browse tiles" };

export default async function AdminBrowseTilesPage() {
  await requireUser();

  const tiles = await prisma.shopBrowseTile.findMany({
    orderBy: { sortOrder: "asc" }
  });

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Storefront"
        title="Browse tiles"
        description="These are the category and promo tiles customers see on the shop. Each card is a preview of the photo, label, and link."
      />

      <DeskPanel>
        <DeskPanelHeader
          title="Live tiles"
          subtitle={`${tiles.filter((t) => t.enabled).length} visible · ${tiles.length} total`}
        />
        {tiles.length === 0 ? (
          <DeskEmpty
            title="No browse tiles yet"
            description="Add tiles below — they appear as a vertical stack under search on Shop."
          />
        ) : (
          <ul className="divide-y divide-gp-border/60">
            {tiles.map((t) => (
              <li key={t.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-gp-surface lg:h-28 lg:w-48">
                    {t.imageUrl ? (
                      <SafeImage
                        src={t.imageUrl}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-xs text-gp-text-subtle">
                        No photo
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-gp-text">
                        {t.label}
                        {t.isPromo ? (
                          <span className="ml-2 rounded-pill bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase text-accent-ink">
                            Promo
                          </span>
                        ) : null}
                        {!t.enabled ? (
                          <span className="ml-2 text-xs text-gp-text-subtle">(hidden)</span>
                        ) : null}
                      </p>
                      <BrowseTileDeleteButton id={t.id} />
                    </div>
                    <BrowseTileForm
                      tile={{
                        id: t.id,
                        label: t.label,
                        href: t.href,
                        imageUrl: t.imageUrl,
                        isPromo: t.isPromo,
                        sortOrder: t.sortOrder,
                        enabled: t.enabled
                      }}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </DeskPanel>

      <DeskPanel className="max-w-2xl p-6 sm:p-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent-ink/80">
          Add
        </p>
        <h2 className="mt-1 text-xl font-black text-gp-text">New browse tile</h2>
        <p className="mt-1.5 text-sm text-gp-text-subtle">
          Example promo: &ldquo;Hot Deals&rdquo; → /search?deals=1
        </p>
        <div className="mt-5">
          <BrowseTileForm />
        </div>
      </DeskPanel>
    </div>
  );
}
