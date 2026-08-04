/** Cover images for Plug-style category cards */
export const categoryCovers: Record<
  string,
  { image: string; tint: string }
> = {
  stationery: {
    image: "/products/wireless-mouse.png",
    tint: "from-[#1a3344]/75 via-[#1a3344]/35 to-[#f6d400]/25"
  },
  storage: {
    image: "/products/memory-flash.png",
    tint: "from-[#0a2429]/80 via-[#123b43]/40 to-transparent"
  },
  computers: {
    image: "/products/dell-latitude-3400.png",
    tint: "from-[#06181c]/75 via-[#0e2e34]/35 to-transparent"
  },
  chargers: {
    image: "/products/iphone-chargers.png",
    tint: "from-[#1b4e58]/70 via-[#123b43]/30 to-[#f6d400]/20"
  },
  power: {
    image: "/products/amaya-powerbank.png",
    tint: "from-[#06181c]/70 via-transparent to-[#22c98a]/15"
  },
  audio: {
    image: "/products/mango-airpods.png",
    tint: "from-[#0a2429]/75 via-[#123b43]/30 to-transparent"
  },
  "phone-accessories": {
    image: "/products/top-plug-adaptor.png",
    tint: "from-[#1a3344]/70 via-transparent to-[#f6d400]/15"
  },
  watches: {
    image: "/products/samsung-45w-charger.png",
    tint: "from-[#06181c]/75 via-[#0e2e34]/40 to-transparent"
  },
  locks: {
    image: "/products/oraimo-charger.png",
    tint: "from-[#0a2429]/80 via-[#123b43]/35 to-transparent"
  }
};

export function getCategoryCover(slug: string) {
  return (
    categoryCovers[slug] ?? {
      image: "/products/hp-probook.png",
      tint: "from-[#06181c]/75 via-[#123b43]/40 to-transparent"
    }
  );
}
