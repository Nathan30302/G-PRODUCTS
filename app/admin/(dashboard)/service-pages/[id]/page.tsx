import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { parseSettings } from "@/lib/services";
import { adminInitialServiceImages } from "@/lib/service-media";
import { saveServiceOffer } from "@/app/admin/(dashboard)/service-pages/actions";
import { ImageUploader } from "@/components/admin/ImageUploader";

export const dynamic = "force-dynamic";
export const metadata = { title: "Edit service" };

const field =
  "mt-1 w-full rounded-xl border border-ink-700 bg-ink-900 px-4 py-2.5 text-white outline-none focus:border-brand";
const label = "text-sm text-white/60";

export default async function EditServicePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await prisma.serviceOffer.findUnique({ where: { id } });
  if (!offer) notFound();
  const settings = parseSettings(offer.settings);
  const initialPhotos = adminInitialServiceImages(offer.slug, offer.imageUrl);

  return (
    <div>
      <div className="mb-6 flex items-center gap-2 text-sm text-white/40">
        <Link href="/admin/service-pages" className="hover:text-white">
          Service pages
        </Link>
        <span>/</span>
        <span className="text-white/70">{offer.name}</span>
      </div>

      <h1 className="text-2xl font-black text-white">Edit {offer.name}</h1>
      <p className="mt-1 text-sm text-white/50">
        Changes appear on the public services pages immediately.
      </p>

      <form action={saveServiceOffer} className="mt-8 max-w-2xl space-y-5">
        <input type="hidden" name="id" value={offer.id} />

        <div>
          <label className={label}>Name</label>
          <input name="name" defaultValue={offer.name} required className={field} />
        </div>
        <div>
          <label className={label}>Tagline</label>
          <input
            name="tagline"
            defaultValue={offer.tagline}
            required
            className={field}
          />
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea
            name="description"
            defaultValue={offer.description}
            rows={4}
            required
            className={field}
          />
        </div>
        <div>
          <ImageUploader
            name="imageUrl"
            folder="service-pages"
            multiple
            label="Service photos"
            downloadPrefix={offer.slug}
            initialUrls={initialPhotos}
          />
          <p className="mt-2 text-xs text-white/40">
            One cover photo is enough by default. Upload more if you want a
            swipe gallery. First photo is the cover — use{" "}
            <span className="text-brand">Make cover</span> to change it.
          </p>
        </div>
        <div>
          <label className={label}>Price label (shown on card)</label>
          <input
            name="priceLabel"
            defaultValue={offer.priceLabel ?? ""}
            className={field}
            placeholder="e.g. From K 50"
          />
        </div>

        {offer.serviceType === "KEY_CUTTING" && (
          <div className="grid gap-4 rounded-card border border-ink-800 bg-ink-900 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-sm font-semibold text-white">
              Key cutting prices (ZMW)
            </p>
            <label className="block">
              <span className={label}>Price per key</span>
              <input
                name="keyCuttingPrice"
                type="number"
                min={0}
                defaultValue={settings.keyCuttingPrice}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Yango one-way fee</span>
              <input
                name="yangoLegFee"
                type="number"
                min={0}
                defaultValue={settings.yangoLegFee}
                className={field}
              />
            </label>
            <p className="sm:col-span-2 text-xs text-white/40">
              Round-trip online orders charge this fee twice (to store + return).
            </p>
          </div>
        )}

        {offer.serviceType === "PRINTING" && (
          <div className="grid gap-4 rounded-card border border-ink-800 bg-ink-900 p-4 sm:grid-cols-2">
            <p className="sm:col-span-2 text-sm font-semibold text-white">
              Printing prices (ZMW per page)
            </p>
            <label className="block">
              <span className={label}>Black & white</span>
              <input
                name="printBw"
                type="number"
                min={0}
                defaultValue={settings.printBw}
                className={field}
              />
            </label>
            <label className="block">
              <span className={label}>Colour</span>
              <input
                name="printColor"
                type="number"
                min={0}
                defaultValue={settings.printColor}
                className={field}
              />
            </label>
          </div>
        )}

        {offer.serviceType === "G_LOANS" && (
          <div className="rounded-card border border-ink-800 bg-ink-900 p-4">
            <label className="block">
              <span className={label}>Minimum loan (ZMW)</span>
              <input
                name="loanMin"
                type="number"
                min={0}
                defaultValue={settings.loanMin}
                className={field}
              />
            </label>
          </div>
        )}

        {offer.serviceType !== "KEY_CUTTING" && (
          <>
            <input
              type="hidden"
              name="keyCuttingPrice"
              value={settings.keyCuttingPrice}
            />
            <input type="hidden" name="yangoLegFee" value={settings.yangoLegFee} />
          </>
        )}
        {offer.serviceType !== "PRINTING" && (
          <>
            <input type="hidden" name="printBw" value={settings.printBw} />
            <input type="hidden" name="printColor" value={settings.printColor} />
          </>
        )}
        {offer.serviceType !== "G_LOANS" && (
          <input type="hidden" name="loanMin" value={settings.loanMin} />
        )}

        <label className="flex items-center gap-2 text-sm text-white/70">
          <input
            type="checkbox"
            name="enabled"
            defaultChecked={offer.enabled}
            className="h-4 w-4 accent-[#f6d400]"
          />
          Show this service on the website
        </label>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="rounded-pill bg-brand px-6 py-2.5 text-sm font-bold text-ink-950 hover:bg-brand-soft"
          >
            Save changes
          </button>
          <Link
            href="/admin/service-pages"
            className="rounded-pill border border-ink-700 px-6 py-2.5 text-sm font-semibold text-white/70"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
