import { prisma } from "@/lib/db";
import {
  services as fallback,
  parseSettings,
  type ServiceDef,
  type ServiceSlug
} from "@/lib/services";
import {
  coverFromImages,
  resolveServiceImages
} from "@/lib/service-media";

function toDef(row: {
  id: string;
  slug: string;
  serviceType: "KEY_CUTTING" | "G_LOANS" | "PRINTING";
  name: string;
  tagline: string;
  description: string;
  icon: string;
  imageUrl: string;
  priceLabel: string | null;
  payable: boolean;
  settings: string;
}): ServiceDef {
  const images = resolveServiceImages(row.slug, row.imageUrl);
  return {
    id: row.id,
    slug: row.slug as ServiceSlug,
    type: row.serviceType,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    icon: row.icon,
    image: coverFromImages(images) || row.imageUrl,
    images,
    priceLabel: row.priceLabel ?? undefined,
    payable: row.payable,
    settings: parseSettings(row.settings)
  };
}

export async function getAllServiceOffers(): Promise<ServiceDef[]> {
  try {
    const rows = await prisma.serviceOffer.findMany({
      where: { enabled: true },
      orderBy: { sortOrder: "asc" }
    });
    if (rows.length === 0) return fallback;
    return rows.map(toDef);
  } catch {
    return fallback;
  }
}

export async function getServiceOffer(
  slug: string
): Promise<ServiceDef | null> {
  try {
    const row = await prisma.serviceOffer.findUnique({ where: { slug } });
    if (!row || !row.enabled) {
      return fallback.find((s) => s.slug === slug) ?? null;
    }
    return toDef(row);
  } catch {
    return fallback.find((s) => s.slug === slug) ?? null;
  }
}

export async function getAllServiceOffersAdmin() {
  return prisma.serviceOffer.findMany({ orderBy: { sortOrder: "asc" } });
}
