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
        description="Category tiles on the shop page and homepage — upload background photos, set labels and links. Promo tiles appear taller."
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
          <ul className="divide-y divide-white/[0.05]">
            {tiles.map((t) => (
              <li key={t.id} className="p-5 sm:p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
                  <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-xl bg-ink-900 lg:h-28 lg:w-48">
                    {t.imageUrl ? (
                      <SafeImage
                        src={t.imageUrl}
                        alt=""
                        fill
                        sizes="200px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="absolute inset-0 grid place-items-center text-xs text-white/40">
                        No photo
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-white">
                        {t.label}
                        {t.isPromo ? (
                          <span className="ml-2 rounded-pill bg-brand/20 px-2 py-0.5 text-[10px] font-bold uppercase text-brand">
                            Promo
                          </span>
                        ) : null}
                        {!t.enabled ? (
                          <span className="ml-2 text-xs text-white/40">(hidden)</span>
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
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand/80">
          Add
        </p>
        <h2 className="mt-1 text-xl font-black text-white">New browse tile</h2>
        <p className="mt-1.5 text-sm text-white/45">
          Example promo: &ldquo;Back to School 🔥&rdquo; → /search?q=book
        </p>
        <div className="mt-5">
          <BrowseTileForm />
        </div>
      </DeskPanel>
    </div>
  );
}
