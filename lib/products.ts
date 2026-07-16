import { Product } from "@/lib/types";

// Seed catalog for G-Products. Prices are placeholders in ZMW - the client
// updates real prices and photos in the admin panel (Phase 1 backend).
export const products: Product[] = [
  {
    id: "p-iphone-13-128",
    slug: "iphone-13-128gb",
    name: "iPhone 13 128GB",
    brand: "Apple",
    categorySlug: "phones",
    price: 12500,
    compareAtPrice: 14500,
    images: [
      {
        url: "https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&w=900&q=80",
        alt: "iPhone 13"
      }
    ],
    shortSpecs: ["128GB storage", "6.1-inch OLED", "Dual camera"],
    description:
      "Apple iPhone 13 with the powerful A15 Bionic chip, brilliant Super Retina XDR display and all-day battery life.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-samsung-a15",
    slug: "samsung-galaxy-a15",
    name: "Samsung Galaxy A15",
    brand: "Samsung",
    categorySlug: "phones",
    price: 4200,
    images: [
      {
        url: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=900&q=80",
        alt: "Samsung Galaxy"
      }
    ],
    shortSpecs: ["128GB storage", "5000mAh battery", "50MP camera"],
    description:
      "A dependable everyday smartphone with a big battery, sharp display and a capable camera.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-solar-powerbank-20k",
    slug: "solar-power-bank-20000mah",
    name: "Solar Power Bank 20,000mAh",
    categorySlug: "power",
    price: 650,
    compareAtPrice: 850,
    images: [
      {
        url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?auto=format&fit=crop&w=900&q=80",
        alt: "Power bank"
      }
    ],
    shortSpecs: ["20,000mAh", "Solar + USB charge", "Dual USB output"],
    description:
      "High-capacity solar power bank that keeps your devices charged on the go - perfect for load shedding.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-powerbank-10k",
    slug: "fast-charge-power-bank-10000mah",
    name: "Fast Charge Power Bank 10,000mAh",
    categorySlug: "power",
    price: 380,
    images: [
      {
        url: "https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&w=900&q=80",
        alt: "Compact power bank"
      }
    ],
    shortSpecs: ["10,000mAh", "22.5W fast charge", "USB-C in/out"],
    description: "Slim, pocket-friendly power bank with fast charging support.",
    stock: "low_stock"
  },
  {
    id: "p-auraimo-typec",
    slug: "auraimo-type-c-cable",
    name: "Auraimo Type-C Charger & Cable",
    brand: "Auraimo",
    categorySlug: "chargers",
    price: 220,
    compareAtPrice: 300,
    images: [
      {
        url: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=900&q=80",
        alt: "Type-C charger"
      }
    ],
    shortSpecs: ["Fast charge adapter", "Durable braided cable", "Type-C"],
    description:
      "Auraimo fast-charge wall adapter bundled with a durable braided Type-C cable.",
    stock: "in_stock",
    hotDeal: true
  },
  {
    id: "p-extension-cable",
    slug: "surge-extension-cable",
    name: "Surge-Protected Extension Cable",
    categorySlug: "chargers",
    price: 180,
    images: [
      {
        url: "https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=900&q=80",
        alt: "Extension cable"
      }
    ],
    shortSpecs: ["4 sockets", "USB ports", "Surge protection"],
    description: "Multi-socket extension with USB ports and surge protection.",
    stock: "in_stock"
  },
  {
    id: "p-headset-wireless",
    slug: "wireless-over-ear-headphones",
    name: "Wireless Over-Ear Headphones",
    categorySlug: "audio",
    price: 750,
    compareAtPrice: 950,
    images: [
      {
        url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
        alt: "Headphones"
      }
    ],
    shortSpecs: ["Bluetooth 5.3", "40h battery", "Deep bass"],
    description:
      "Comfortable over-ear wireless headphones with rich bass and long battery life.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-earbuds",
    slug: "true-wireless-earbuds",
    name: "True Wireless Earbuds",
    categorySlug: "audio",
    price: 320,
    images: [
      {
        url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=900&q=80",
        alt: "Earbuds"
      }
    ],
    shortSpecs: ["Bluetooth 5.3", "Touch controls", "Charging case"],
    description: "Compact true wireless earbuds with clear sound and a charging case.",
    stock: "in_stock"
  },
  {
    id: "p-bluetooth-speaker",
    slug: "portable-bluetooth-speaker",
    name: "Portable Bluetooth Speaker",
    categorySlug: "audio",
    price: 540,
    images: [
      {
        url: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=80",
        alt: "Bluetooth speaker"
      }
    ],
    shortSpecs: ["Waterproof", "12h playtime", "Deep bass"],
    description: "Loud, waterproof portable speaker for indoors and outdoors.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-neckband",
    slug: "bluetooth-neckband",
    name: "Bluetooth Neckband",
    categorySlug: "audio",
    price: 240,
    images: [
      {
        url: "https://images.unsplash.com/photo-1524678714210-9917a6c619c2?auto=format&fit=crop&w=900&q=80",
        alt: "Neckband earphones"
      }
    ],
    shortSpecs: ["Magnetic buds", "18h playtime", "Sweatproof"],
    description: "Comfortable neckband earphones ideal for calls and workouts.",
    stock: "in_stock"
  },
  {
    id: "p-ssd-500",
    slug: "portable-ssd-500gb",
    name: "Portable SSD 500GB",
    categorySlug: "computing",
    price: 1450,
    compareAtPrice: 1700,
    images: [
      {
        url: "https://images.unsplash.com/photo-1531492746076-161ca9bcad58?auto=format&fit=crop&w=900&q=80",
        alt: "Portable SSD"
      }
    ],
    shortSpecs: ["500GB", "USB-C", "Up to 1050MB/s"],
    description: "Fast, pocket-sized SSD for backups and transferring large files.",
    stock: "in_stock",
    hotDeal: true
  },
  {
    id: "p-ram-8gb",
    slug: "ddr4-ram-8gb",
    name: "DDR4 Laptop RAM 8GB",
    categorySlug: "computing",
    price: 620,
    images: [
      {
        url: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=900&q=80",
        alt: "RAM module"
      }
    ],
    shortSpecs: ["8GB", "DDR4 3200MHz", "Laptop SO-DIMM"],
    description: "Upgrade your laptop's speed with reliable DDR4 memory.",
    stock: "low_stock"
  },
  {
    id: "p-flash-64",
    slug: "usb-flash-drive-64gb",
    name: "USB Flash Drive 64GB",
    categorySlug: "computing",
    price: 150,
    images: [
      {
        url: "https://images.unsplash.com/photo-1618410320928-25228d811631?auto=format&fit=crop&w=900&q=80",
        alt: "Flash drive"
      }
    ],
    shortSpecs: ["64GB", "USB 3.0", "Metal body"],
    description: "Reliable 64GB flash drive with fast USB 3.0 transfer.",
    stock: "in_stock"
  },
  {
    id: "p-laptop-hdd",
    slug: "external-hard-drive-1tb",
    name: "External Hard Drive 1TB",
    categorySlug: "computing",
    price: 1250,
    images: [
      {
        url: "https://images.unsplash.com/photo-1531493731235-b6c3f6c8f2c9?auto=format&fit=crop&w=900&q=80",
        alt: "External hard drive"
      }
    ],
    shortSpecs: ["1TB", "USB 3.0", "Plug & play"],
    description: "Spacious external hard drive for all your files and backups.",
    stock: "in_stock"
  },
  {
    id: "p-controller",
    slug: "wireless-game-controller",
    name: "Wireless Game Controller",
    categorySlug: "gaming",
    price: 680,
    compareAtPrice: 820,
    images: [
      {
        url: "https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=900&q=80",
        alt: "Game controller"
      }
    ],
    shortSpecs: ["Wireless", "Rechargeable", "PC & console"],
    description: "Responsive wireless controller compatible with PC and consoles.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-mouse",
    slug: "wireless-mouse",
    name: "Wireless Mouse",
    categorySlug: "accessories",
    price: 190,
    images: [
      {
        url: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=900&q=80",
        alt: "Wireless mouse"
      }
    ],
    shortSpecs: ["2.4GHz wireless", "Silent click", "Ergonomic"],
    description: "Smooth, silent wireless mouse for work and study.",
    stock: "in_stock"
  },
  {
    id: "p-mosquito",
    slug: "electric-mosquito-repellent",
    name: "Electric Mosquito Repellent",
    categorySlug: "accessories",
    price: 210,
    images: [
      {
        url: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=900&q=80",
        alt: "Mosquito repellent"
      }
    ],
    shortSpecs: ["USB powered", "Safe & quiet", "Room coverage"],
    description: "Keep mosquitoes away with this quiet, USB-powered repellent.",
    stock: "in_stock"
  }
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeatured(): Product[] {
  return products.filter((p) => p.featured);
}

export function getHotDeals(): Product[] {
  return products.filter((p) => p.hotDeal);
}
