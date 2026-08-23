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
        description="Add photos for each pickup point. They appear on the homepage locations band when set."
      />

      {siteConfig.locations.map((loc) => (
        <DeskPanel key={loc.id}>
          <DeskPanelHeader title={loc.name} subtitle={loc.address} />
          <div className="p-5 sm:p-6">
            <LocationPhotosForm
              locationId={loc.id}
              initialUrls={byId.get(loc.id) ?? []}
            />
          </div>
        </DeskPanel>
      ))}
    </div>
  );
}
