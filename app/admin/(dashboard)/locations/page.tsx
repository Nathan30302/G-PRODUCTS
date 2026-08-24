import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { parsePhotoUrls } from "@/lib/shop-content";
import {
  DeskPageHeader,
  DeskPanel,
  DeskPanelHeader
} from "@/components/admin/desk";
import { LocationPhotosForm } from "@/components/admin/LocationPhotosForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Locations" };

export default async function AdminLocationsPage() {
  await requireUser();

  const media = await prisma.shopLocationMedia.findMany();
  const byId = new Map(
    media.map((m) => [m.locationId, parsePhotoUrls(m.photoUrls)])
  );

  return (
    <div className="space-y-6">
      <DeskPageHeader
        eyebrow="Storefront"
        title="Locations"
        description="Photos for each pickup point. Cover images show on the homepage locations band."
      />

      {siteConfig.locations.map((loc) => {
        const urls = byId.get(loc.id) ?? [];
        return (
          <DeskPanel key={loc.id}>
            <DeskPanelHeader
              title={loc.name}
              subtitle={loc.address}
              action={
                <span className="shrink-0 rounded-pill border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white/45">
                  {urls.length
                    ? `${urls.length} photo${urls.length === 1 ? "" : "s"}`
                    : "No photos"}
                </span>
              }
            />
            <div className="p-5 sm:p-6">
              <LocationPhotosForm
                locationId={loc.id}
                locationName={loc.name}
                initialUrls={urls}
              />
            </div>
          </DeskPanel>
        );
      })}
    </div>
  );
}
