import { Product } from "@/lib/types";

// G-Products real catalog, sourced from the seller's official price list and
// product flyers (July 2026). Prices are in ZMW. Product data is loaded into
// the database via the seed script and managed from the admin panel after that.

const IMG = {
  dell3400: "/products/dell-latitude-3400.png",
  dell3350: "/products/dell-latitude-3350.png",
  hp: "/products/hp-probook.png",
  adaptor: "/products/top-plug-adaptor.png",
  storage: "/products/memory-flash.png",
  oraimo: "/products/oraimo-charger.png",
  mango: "/products/mango-airpods.png",
  mouse: "/products/wireless-mouse.png",
  samsung: "/products/samsung-45w-charger.png",
  amaya: "/products/amaya-powerbank.png",
  iphone: "/products/iphone-chargers.png",
  watch:
    "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80"
};

export const products: Product[] = [
  // ------------------------- Laptops -------------------------
  {
    id: "p-dell-3400",
    slug: "dell-latitude-3400",
    name: "Dell Latitude 3400",
    brand: "Dell",
    categorySlug: "laptops",
    price: 3200,
    images: [{ url: IMG.dell3400, alt: "Dell Latitude 3400 laptop" }],
    shortSpecs: [
      "8th Gen Intel Core i3 @ 2.30GHz",
      "4GB RAM",
      "500GB HDD",
      "Price on request"
    ],
    description:
      "Dell Latitude 3400 business laptop with an 8th Gen Intel Core i3 processor, 4GB RAM and a 500GB hard drive. Price on request - contact us for the current price and availability.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-dell-3350",
    slug: "dell-latitude-3350",
    name: "Dell Latitude 3350",
    brand: "Dell",
    categorySlug: "laptops",
    price: 3750,
    images: [{ url: IMG.dell3350, alt: "Dell Latitude 3350 laptop" }],
    shortSpecs: ["5th Gen Intel Core i3", "8GB RAM", "500GB HDD"],
    description:
      "Dell Latitude 3350 laptop with a 5th Gen Intel Core i3 processor, 8GB RAM and 500GB storage. Reliable everyday performance for work and study.",
    stock: "in_stock",
    hotDeal: true
  },
  {
    id: "p-hp-probook",
    slug: "hp-probook-i5-10th-gen",
    name: "HP ProBook (Core i5 10th Gen)",
    brand: "HP",
    categorySlug: "laptops",
    price: 5000,
    images: [{ url: IMG.hp, alt: "HP ProBook laptop" }],
    shortSpecs: ["10th Gen Intel Core i5", "8GB RAM", "256GB SSD"],
    description:
      "HP ProBook with a fast 10th Gen Intel Core i5 processor, 8GB RAM and a speedy 256GB SSD. A dependable, portable laptop for professionals and students.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },

  // ------------------------- Chargers & Cables -------------------------
  {
    id: "p-oraimo-charger",
    slug: "oraimo-charger-2a",
    name: "Oraimo Charger (2A Fast Charge)",
    brand: "Oraimo",
    categorySlug: "chargers",
    price: 100,
    images: [{ url: IMG.oraimo, alt: "Oraimo fast charger" }],
    shortSpecs: [
      "2A fast charging",
      "Fire-proof & anti-slip build",
      "AniFast technology",
      "Compact & portable"
    ],
    description:
      "Original Oraimo charger with 2A fast, stable charging, a multi-protection system for safe charging and AniFast technology for the fastest charge. Fire-proof, anti-slip and compact.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-samsung-45w",
    slug: "samsung-45w-type-c-charger",
    name: "Samsung 45W PD Type-C Charger",
    brand: "Samsung",
    categorySlug: "chargers",
    price: 150,
    images: [{ url: IMG.samsung, alt: "Samsung 45W Type-C charger" }],
    shortSpecs: [
      "45W PD super fast charge",
      "3-pin mains wall adapter",
      "USB-C to USB-C cable included",
      "For Galaxy S & Note series"
    ],
    description:
      "Samsung 45W PD super fast charging plug adapter with USB-C to Type-C cable. Compatible with Galaxy A14/A34/A54, S20/S21/S22/S23 Ultra, Note 10, Z Flip and many more.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-iphone-cable",
    slug: "iphone-charger-cable",
    name: "iPhone Charger Cable",
    brand: "Apple",
    categorySlug: "chargers",
    price: 50,
    images: [{ url: IMG.iphone, alt: "iPhone charger cable" }],
    shortSpecs: ["Fast charging speeds", "Durable design", "Type-C to iPhone"],
    description:
      "High-quality iPhone charging cable with fast charging speeds and a durable design.",
    stock: "in_stock"
  },
  {
    id: "p-iphone-head",
    slug: "iphone-charger-head",
    name: "iPhone Charger Head",
    brand: "Apple",
    categorySlug: "chargers",
    price: 100,
    images: [{ url: IMG.iphone, alt: "iPhone charger head" }],
    shortSpecs: ["Fast charging", "High-quality materials", "Type-C output"],
    description: "iPhone charger head (adapter) with fast charging support.",
    stock: "in_stock"
  },
  {
    id: "p-iphone-full",
    slug: "iphone-full-charger",
    name: "iPhone Full Charger (Head + Cable)",
    brand: "Apple",
    categorySlug: "chargers",
    price: 150,
    images: [{ url: IMG.iphone, alt: "iPhone full charger set" }],
    shortSpecs: ["Charger head + cable", "Fast charging speeds", "Durable"],
    description:
      "Complete iPhone charging set - charger head plus cable. Fast charging speeds, durable design and high-quality materials.",
    stock: "in_stock",
    hotDeal: true
  },
  {
    id: "p-typec-charger",
    slug: "type-c-charger-c-to-c",
    name: "Type-C Charger (C-to-C)",
    categorySlug: "chargers",
    price: 150,
    images: [{ url: IMG.samsung, alt: "Type-C to Type-C charger" }],
    shortSpecs: ["Type-C to Type-C", "Fast charging", "Wall adapter + cable"],
    description: "Type-C (C-to-C) charger with fast charging support.",
    stock: "in_stock"
  },
  {
    id: "p-typec-cable",
    slug: "type-c-cable",
    name: "Type-C Cable",
    categorySlug: "chargers",
    price: 30,
    images: [{ url: IMG.samsung, alt: "Type-C cable" }],
    shortSpecs: ["Type-C cable", "K30 standard / K50 premium", "Durable"],
    description:
      "Durable Type-C charging cable. Available as standard (K50) or premium - starting from K30.",
    stock: "in_stock"
  },
  {
    id: "p-travel-adaptor",
    slug: "top-plug-adaptor-alite",
    name: "Top Plug Adaptor (ALITE 3-Way Universal)",
    brand: "ALITE",
    categorySlug: "chargers",
    price: 30,
    images: [{ url: IMG.adaptor, alt: "ALITE universal travel adaptor" }],
    shortSpecs: ["Multi 3-way plug", "Universal travel adapter", "Compact"],
    description:
      "ALITE Multi 3-Way universal travel plug adapter - plug in multiple devices from one wall socket.",
    stock: "in_stock",
    hotDeal: true
  },
  {
    id: "p-ext-3way",
    slug: "extension-board-3-way",
    name: "3-Way Extension Board",
    categorySlug: "chargers",
    price: 50,
    images: [{ url: IMG.adaptor, alt: "3-way extension board" }],
    shortSpecs: ["3 sockets", "3m cable - K50", "5m cable - K55"],
    description:
      "3-way extension board / adapter. Available with a 3-metre cable (K50) or 5-metre cable (K55).",
    stock: "in_stock"
  },
  {
    id: "p-ext-4way",
    slug: "extension-board-4-way",
    name: "4-Way Extension Board",
    categorySlug: "chargers",
    price: 60,
    images: [{ url: IMG.adaptor, alt: "4-way extension board" }],
    shortSpecs: ["4 sockets", "3m cable - K60", "5m cable - K65"],
    description:
      "4-way extension board / adapter. Available with a 3-metre cable (K60) or 5-metre cable (K65).",
    stock: "in_stock"
  },
  {
    id: "p-ext-5way",
    slug: "extension-board-5-way",
    name: "5-Way Extension Board",
    categorySlug: "chargers",
    price: 70,
    images: [{ url: IMG.adaptor, alt: "5-way extension board" }],
    shortSpecs: ["5 sockets", "3m cable - K70", "5m cable - K75"],
    description:
      "5-way extension board / adapter. Available with a 3-metre cable (K70) or 5-metre cable (K75).",
    stock: "in_stock"
  },
  {
    id: "p-ext-6way",
    slug: "extension-board-6-way",
    name: "6-Way Extension Board",
    categorySlug: "chargers",
    price: 80,
    images: [{ url: IMG.adaptor, alt: "6-way extension board" }],
    shortSpecs: ["6 sockets", "3m cable - K80", "5m cable - K85"],
    description:
      "6-way extension board / adapter. Available with a 3-metre cable (K80) or 5-metre cable (K85).",
    stock: "in_stock"
  },

  // ------------------------- Power -------------------------
  {
    id: "p-amaya-powerbank",
    slug: "amaya-power-bank",
    name: "Amaya Power Bank",
    brand: "Amaya",
    categorySlug: "power",
    price: 250,
    images: [{ url: IMG.amaya, alt: "Amaya power bank" }],
    shortSpecs: [
      "High-capacity (10,000mAh)",
      "Dual USB output",
      "Digital charge display",
      "Beat load shedding"
    ],
    description:
      "Stay powered with the Amaya Power Bank. Reliable, long-lasting power wherever you go - perfect for load shedding and staying connected on the move.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-laptop-powerpack",
    slug: "laptop-power-pack-full-set",
    name: "Laptop Charger & Power Pack (Full Set)",
    categorySlug: "power",
    price: 250,
    images: [{ url: IMG.samsung, alt: "Laptop charger power pack" }],
    shortSpecs: [
      "Full set - K250",
      "Power pack alone - K200",
      "Power cable - K50"
    ],
    description:
      "Laptop charger and power pack. Full set for K250, power pack alone for K200, or a replacement power cable for K50.",
    stock: "in_stock"
  },

  // ------------------------- Storage: Flash disks -------------------------
  {
    id: "p-flash-4",
    slug: "flash-disk-4gb",
    name: "Flash Disk 4GB",
    categorySlug: "storage",
    price: 60,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["4GB capacity", "High-speed USB", "Plug & play"],
    description: "4GB USB flash disk - store more, worry less.",
    stock: "in_stock"
  },
  {
    id: "p-flash-8",
    slug: "flash-disk-8gb",
    name: "Flash Disk 8GB",
    categorySlug: "storage",
    price: 75,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["8GB capacity", "High-speed USB", "Plug & play"],
    description: "8GB USB flash disk - store more, worry less.",
    stock: "in_stock"
  },
  {
    id: "p-flash-16",
    slug: "flash-disk-16gb",
    name: "Flash Disk 16GB",
    categorySlug: "storage",
    price: 90,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["16GB capacity", "High-speed USB", "Plug & play"],
    description: "16GB USB flash disk - store more, worry less.",
    stock: "in_stock"
  },
  {
    id: "p-flash-32",
    slug: "flash-disk-32gb",
    name: "Flash Disk 32GB",
    categorySlug: "storage",
    price: 120,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["32GB capacity", "High-speed USB", "Plug & play"],
    description: "32GB USB flash disk - store more, worry less.",
    stock: "in_stock"
  },
  {
    id: "p-flash-64",
    slug: "flash-disk-64gb",
    name: "Flash Disk 64GB",
    categorySlug: "storage",
    price: 150,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["64GB capacity", "High-speed USB", "Plug & play"],
    description: "64GB USB flash disk - store more, worry less.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-flash-128",
    slug: "flash-disk-128gb",
    name: "Flash Disk 128GB",
    categorySlug: "storage",
    price: 210,
    images: [{ url: IMG.storage, alt: "USB flash disk" }],
    shortSpecs: ["128GB capacity", "High-speed USB", "Plug & play"],
    description: "128GB USB flash disk - plenty of space for all your files.",
    stock: "in_stock"
  },

  // ------------------------- Storage: Memory cards -------------------------
  {
    id: "p-sd-2",
    slug: "memory-card-2gb",
    name: "Memory Card 2GB",
    categorySlug: "storage",
    price: 45,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["2GB microSD", "High-speed", "For phones & cameras"],
    description: "2GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-4",
    slug: "memory-card-4gb",
    name: "Memory Card 4GB",
    categorySlug: "storage",
    price: 55,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["4GB microSD", "High-speed", "For phones & cameras"],
    description: "4GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-8",
    slug: "memory-card-8gb",
    name: "Memory Card 8GB",
    categorySlug: "storage",
    price: 70,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["8GB microSD", "High-speed", "For phones & cameras"],
    description: "8GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-16",
    slug: "memory-card-16gb",
    name: "Memory Card 16GB",
    categorySlug: "storage",
    price: 85,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["16GB microSD", "High-speed", "For phones & cameras"],
    description: "16GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-32",
    slug: "memory-card-32gb",
    name: "Memory Card 32GB",
    categorySlug: "storage",
    price: 115,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["32GB microSD", "High-speed", "For phones & cameras"],
    description: "32GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-64",
    slug: "memory-card-64gb",
    name: "Memory Card 64GB",
    categorySlug: "storage",
    price: 140,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["64GB microSD", "High-speed", "For phones & cameras"],
    description: "64GB microSD memory card.",
    stock: "in_stock"
  },
  {
    id: "p-sd-128",
    slug: "memory-card-128gb",
    name: "Memory Card 128GB",
    categorySlug: "storage",
    price: 210,
    images: [{ url: IMG.storage, alt: "microSD memory card" }],
    shortSpecs: ["128GB microSD", "High-speed", "For phones & cameras"],
    description: "128GB microSD memory card - loads of space for media.",
    stock: "in_stock"
  },

  // ------------------------- Storage: Hard drives & casings -------------------------
  {
    id: "p-hdd-250",
    slug: "hard-drive-250gb",
    name: "External Hard Drive 250GB",
    categorySlug: "storage",
    price: 200,
    images: [{ url: IMG.storage, alt: "external hard drive" }],
    shortSpecs: ["250GB", "USB", "Plug & play"],
    description: "250GB external hard drive for backups and file storage.",
    stock: "in_stock"
  },
  {
    id: "p-hdd-320",
    slug: "hard-drive-320gb",
    name: "External Hard Drive 320GB",
    categorySlug: "storage",
    price: 300,
    images: [{ url: IMG.storage, alt: "external hard drive" }],
    shortSpecs: ["320GB", "USB", "Plug & play"],
    description: "320GB external hard drive for backups and file storage.",
    stock: "in_stock"
  },
  {
    id: "p-hdd-500",
    slug: "hard-drive-500gb",
    name: "External Hard Drive 500GB",
    categorySlug: "storage",
    price: 400,
    images: [{ url: IMG.storage, alt: "external hard drive" }],
    shortSpecs: ["500GB", "USB", "Plug & play"],
    description: "500GB external hard drive for backups and file storage.",
    stock: "in_stock"
  },
  {
    id: "p-hdd-1tb",
    slug: "hard-drive-1tb",
    name: "External Hard Drive 1TB",
    categorySlug: "storage",
    price: 600,
    images: [{ url: IMG.storage, alt: "external hard drive" }],
    shortSpecs: ["1TB", "USB", "Plug & play"],
    description: "Spacious 1TB external hard drive for all your files and backups.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-hdd-casing",
    slug: "hard-drive-casing",
    name: "Hard Drive Casing",
    categorySlug: "storage",
    price: 100,
    images: [{ url: IMG.storage, alt: "hard drive casing" }],
    shortSpecs: ["USB 2.0 - K100", "USB 3.0 - K150", "Turn a drive external"],
    description:
      "External hard drive casing. USB 2.0 for K100 or faster USB 3.0 for K150.",
    stock: "in_stock"
  },

  // ------------------------- Audio -------------------------
  {
    id: "p-mango-airpods",
    slug: "mango-airpods",
    name: "Mango AirPods",
    brand: "Mango",
    categorySlug: "audio",
    price: 150,
    images: [{ url: IMG.mango, alt: "Mango AirPods" }],
    shortSpecs: ["Crystal-clear audio", "Comfortable fit", "Long battery life"],
    description:
      "Experience crisp sound with Mango AirPods. Crystal-clear audio, a comfortable fit and long-lasting battery. Stay connected in style.",
    stock: "in_stock",
    featured: true,
    hotDeal: true
  },
  {
    id: "p-airpods-pro3",
    slug: "airpods-pro-3rd-gen",
    name: "AirPods Pro 3 (3rd Gen)",
    brand: "Apple",
    categorySlug: "audio",
    price: 300,
    images: [{ url: IMG.mango, alt: "AirPods Pro 3" }],
    shortSpecs: ["3rd generation", "Active noise cancelling", "Wireless"],
    description: "AirPods Pro 3 (3rd generation) wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-airpods-pro2-c",
    slug: "airpods-pro-2-type-c",
    name: "AirPods Pro 2 Type-C (with cable)",
    brand: "Apple",
    categorySlug: "audio",
    price: 350,
    images: [{ url: IMG.mango, alt: "AirPods Pro 2 Type-C" }],
    shortSpecs: ["Type-C charging", "Cable included", "Active noise cancelling"],
    description: "AirPods Pro 2 with Type-C charging case and cable included.",
    stock: "in_stock"
  },
  {
    id: "p-airpods-pro2",
    slug: "airpods-pro-2-2nd-gen",
    name: "AirPods Pro 2 (2nd Gen)",
    brand: "Apple",
    categorySlug: "audio",
    price: 300,
    images: [{ url: IMG.mango, alt: "AirPods Pro 2" }],
    shortSpecs: ["2nd generation", "Active noise cancelling", "Wireless"],
    description: "AirPods Pro 2 (2nd generation) wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-airpods-pro1",
    slug: "apple-airpods-pro-1st-gen",
    name: "Apple AirPods Pro (1st Gen)",
    brand: "Apple",
    categorySlug: "audio",
    price: 280,
    images: [{ url: IMG.mango, alt: "Apple AirPods Pro 1st Gen" }],
    shortSpecs: ["1st generation", "Noise cancelling", "Wireless"],
    description: "Apple AirPods Pro (1st generation) wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-sivia-i3",
    slug: "sivia-sl-i3-earbuds",
    name: "Sivia SL i3 Earbuds",
    brand: "Sivia",
    categorySlug: "audio",
    price: 150,
    images: [{ url: IMG.mango, alt: "Sivia SL i3 earbuds" }],
    shortSpecs: ["True wireless", "Charging case", "Bluetooth"],
    description: "Sivia SL i3 true wireless earbuds with charging case.",
    stock: "in_stock"
  },
  {
    id: "p-oraimo-f9pro3",
    slug: "oraimo-air-f9-pro-3",
    name: "Oraimo Air F9 Pro 3",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 200,
    images: [{ url: IMG.mango, alt: "Oraimo Air F9 Pro 3" }],
    shortSpecs: ["True wireless", "Long battery life", "Bluetooth"],
    description: "Oraimo Air F9 Pro 3 true wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-tws-f9",
    slug: "tws-f9-earbuds",
    name: "TWS F9 Earbuds",
    categorySlug: "audio",
    price: 200,
    images: [{ url: IMG.mango, alt: "TWS F9 earbuds" }],
    shortSpecs: ["True wireless", "Charging case", "Bluetooth"],
    description: "TWS F9 true wireless earbuds with charging case.",
    stock: "in_stock"
  },
  {
    id: "p-samsung-f9",
    slug: "samsung-f9-pro-plus",
    name: "Samsung F9 Pro+",
    brand: "Samsung",
    categorySlug: "audio",
    price: 200,
    images: [{ url: IMG.mango, alt: "Samsung F9 Pro+" }],
    shortSpecs: ["True wireless", "Charging case", "Bluetooth"],
    description: "Samsung F9 Pro+ true wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-ubl-harman",
    slug: "ubl-harman-earbuds",
    name: "UBL Harman Earbuds",
    categorySlug: "audio",
    price: 200,
    images: [{ url: IMG.mango, alt: "UBL Harman earbuds" }],
    shortSpecs: ["True wireless", "Deep bass", "Bluetooth"],
    description: "UBL Harman true wireless earbuds with deep bass.",
    stock: "in_stock"
  },
  {
    id: "p-i15-pods",
    slug: "i15-pods",
    name: "i15 Pods",
    categorySlug: "audio",
    price: 150,
    images: [{ url: IMG.mango, alt: "i15 pods" }],
    shortSpecs: ["True wireless", "Charging case", "Bluetooth"],
    description: "i15 Pods true wireless earbuds with charging case.",
    stock: "in_stock"
  },
  {
    id: "p-inpods-12",
    slug: "inpods-12",
    name: "InPods 12",
    categorySlug: "audio",
    price: 150,
    images: [{ url: IMG.mango, alt: "InPods 12" }],
    shortSpecs: ["True wireless", "Touch controls", "Bluetooth"],
    description: "InPods 12 true wireless earbuds with touch controls.",
    stock: "in_stock"
  },
  {
    id: "p-realme-buds",
    slug: "realme-earbuds",
    name: "Realme Earbuds",
    brand: "Realme",
    categorySlug: "audio",
    price: 150,
    images: [{ url: IMG.mango, alt: "Realme earbuds" }],
    shortSpecs: ["True wireless", "Charging case", "Bluetooth"],
    description: "Realme true wireless earbuds.",
    stock: "in_stock"
  },
  {
    id: "p-oraimo-headset",
    slug: "oraimo-headset",
    name: "Original Oraimo Headset",
    brand: "Oraimo",
    categorySlug: "audio",
    price: 30,
    images: [{ url: IMG.oraimo, alt: "Oraimo headset" }],
    shortSpecs: ["Original Oraimo", "K30 standard / K60 premium", "Clear sound"],
    description:
      "Original Oraimo wired headset with clear sound. Available from K30 (standard) up to K60 (premium).",
    stock: "in_stock"
  },
  {
    id: "p-typec-headset",
    slug: "type-c-headset",
    name: "Type-C Headset",
    categorySlug: "audio",
    price: 80,
    images: [{ url: IMG.samsung, alt: "Type-C headset" }],
    shortSpecs: ["Type-C connector", "In-line mic", "Clear sound"],
    description: "Type-C wired headset with in-line microphone and clear sound.",
    stock: "in_stock"
  },
  {
    id: "p-podcast-earphones",
    slug: "podcast-earphones",
    name: "Podcast Earphones (Wired)",
    categorySlug: "audio",
    price: 50,
    images: [{ url: IMG.mango, alt: "wired podcast earphones" }],
    shortSpecs: ["Rubbered - K50", "Silicon - K60", "In-line mic"],
    description:
      "Wired podcast earphones with in-line mic. Rubbered finish for K50 or silicon finish for K60.",
    stock: "in_stock"
  },

  // ------------------------- Accessories -------------------------
  {
    id: "p-wireless-mouse",
    slug: "wireless-mouse",
    name: "Wireless Mouse",
    categorySlug: "accessories",
    price: 75,
    images: [{ url: IMG.mouse, alt: "wireless mouse" }],
    shortSpecs: [
      "Ergonomic design",
      "High precision tracking",
      "Long battery life",
      "Plug & play"
    ],
    description:
      "Wireless mouse with an ergonomic grip, high-precision tracking and long battery life. Plug and play, portable and lightweight.",
    stock: "in_stock",
    featured: true
  },
  {
    id: "p-wired-mouse",
    slug: "wired-mouse",
    name: "Wired Mouse",
    categorySlug: "accessories",
    price: 50,
    images: [{ url: IMG.mouse, alt: "wired mouse" }],
    shortSpecs: ["Plug & play", "High precision", "Comfortable grip"],
    description: "Reliable wired mouse - plug and play with high precision.",
    stock: "in_stock"
  },
  {
    id: "p-wireless-keyboard",
    slug: "wireless-keyboard",
    name: "Wireless Keyboard",
    categorySlug: "accessories",
    price: 300,
    images: [{ url: IMG.mouse, alt: "wireless keyboard" }],
    shortSpecs: ["Wireless", "Full-size layout", "Long battery life"],
    description: "External wireless keyboard with a comfortable full-size layout.",
    stock: "in_stock"
  },
  {
    id: "p-wired-keyboard",
    slug: "wired-keyboard",
    name: "Wired Keyboard",
    categorySlug: "accessories",
    price: 250,
    images: [{ url: IMG.mouse, alt: "wired keyboard" }],
    shortSpecs: ["Wired USB", "Full-size layout", "Durable"],
    description: "External wired USB keyboard with a durable full-size layout.",
    stock: "in_stock"
  },
  {
    id: "p-silicone-pouch",
    slug: "silicone-iphone-pouch",
    name: "Silicone iPhone Pouch",
    categorySlug: "accessories",
    price: 80,
    images: [{ url: IMG.iphone, alt: "silicone iPhone pouch" }],
    shortSpecs: [
      "Fits iPhone 6+/7+/11/13/15",
      "Soft silicone",
      "Slim protection"
    ],
    description:
      "Soft silicone iPhone pouch / case for slim, everyday protection. Available for iPhone 6+, 7+, 11, 13 and 15.",
    stock: "in_stock"
  },
  {
    id: "p-watch-t900",
    slug: "t900-ultra-smart-watch",
    name: "T900 Ultra Smart Watch",
    categorySlug: "accessories",
    price: 250,
    images: [{ url: IMG.watch, alt: "T900 Ultra smart watch" }],
    shortSpecs: ["Large display", "Fitness tracking", "Bluetooth calls"],
    description:
      "T900 Ultra smart watch with a large display, fitness tracking and Bluetooth calling.",
    stock: "in_stock"
  },
  {
    id: "p-watch-kt8",
    slug: "kt8-ultra-max-smart-watch",
    name: "KT8 Ultra Max Smart Watch",
    categorySlug: "accessories",
    price: 300,
    images: [{ url: IMG.watch, alt: "KT8 Ultra Max smart watch" }],
    shortSpecs: ["Ultra Max display", "Fitness tracking", "Bluetooth calls"],
    description:
      "KT8 Ultra Max smart watch with a premium display, fitness tracking and Bluetooth calling.",
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
