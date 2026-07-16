import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "laptops",
    name: "Laptops",
    tagline: "Laptops & computers",
    icon: "laptop"
  },
  {
    slug: "chargers",
    name: "Chargers & Cables",
    tagline: "Chargers, adapters & cables",
    icon: "bolt"
  },
  {
    slug: "power",
    name: "Power",
    tagline: "Power banks & power packs",
    icon: "battery"
  },
  {
    slug: "storage",
    name: "Storage",
    tagline: "Flash disks, memory cards & drives",
    icon: "storage"
  },
  {
    slug: "audio",
    name: "Audio",
    tagline: "AirPods, earphones & headsets",
    icon: "headphones"
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Mouse, keyboards, watches & more",
    icon: "sparkles"
  }
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
