import { prisma } from "@/lib/db";
import { siteConfig } from "@/config/site";

export function parsePhotoUrls(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((u): u is string => typeof u === "string" && u.trim().length > 0);
  } catch {
    return [];
  }
}

export function serializePhotoUrls(urls: string[]): string {
  return JSON.stringify(urls.filter(Boolean));
}

export type LocationWithPhotos = (typeof siteConfig.locations)[number] & {
  photoUrls: string[];
};

export async function getLocationsWithPhotos(): Promise<LocationWithPhotos[]> {
  const media = await prisma.shopLocationMedia.findMany();
  const byId = new Map(
    media.map((m) => [m.locationId, parsePhotoUrls(m.photoUrls)])
  );
  return siteConfig.locations.map((loc) => ({
    ...loc,
    photoUrls: byId.get(loc.id) ?? []
  }));
}

export async function getPublishedTeamMembers() {
  return prisma.shopTeamMember.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }]
  });
}
