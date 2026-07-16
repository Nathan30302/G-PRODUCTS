import { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "phones",
    name: "Phones",
    tagline: "Smartphones & iPhones",
    icon: "phone"
  },
  {
    slug: "power",
    name: "Power Banks",
    tagline: "Solar & fast-charge power",
    icon: "battery"
  },
  {
    slug: "chargers",
    name: "Chargers & Cables",
    tagline: "Type-C, adapters & cables",
    icon: "bolt"
  },
  {
    slug: "audio",
    name: "Audio",
    tagline: "Headphones, buds & speakers",
    icon: "headphones"
  },
  {
    slug: "computing",
    name: "Computing",
    tagline: "Laptops, SSDs, RAM & drives",
    icon: "laptop"
  },
  {
    slug: "gaming",
    name: "Gaming",
    tagline: "Controllers & accessories",
    icon: "gamepad"
  },
  {
    slug: "accessories",
    name: "Accessories",
    tagline: "Mice, neckbands & more",
    icon: "sparkles"
  }
];

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
