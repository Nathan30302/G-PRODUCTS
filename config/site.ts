export type ContactNumber = {
  /** Display label, e.g. Main line */
  label: string;
  /** Human-readable number as shown on the site */
  display: string;
  /** tel: href digits / E.164-ish */
  tel: string;
  /** WhatsApp wa.me number (country code, no +) */
  whatsapp: string;
};

export type StoreLocation = {
  id: string;
  name: string;
  address: string;
  landmark?: string;
  hours: string;
  /** Google Maps search / place URL */
  mapsUrl: string;
  /** Prefer this contact for Call / WhatsApp on the card */
  phone?: ContactNumber;
};

export const siteConfig = {
  name: "G-Products",
  legalName: "G-Products and Services",
  tagline: "Heart Gladdening Products",
  /** Primary subline on the homepage hero (replaces the old splash card copy). */
  splashLine: "Powering your devices and perfecting your prints all in one.",
  headline: "Powering your devices and perfecting your prints all in one.",
  subheading:
    "Shop electronics, accessories and stationery — Mobile Money checkout with campus delivery and pickup across Lusaka.",
  /** Three-step shop flow shown on the homepage */
  shopSteps: [
    { step: "1", title: "Search or browse", hint: "Find chargers, phones, stationery & more" },
    { step: "2", title: "Add to cart", hint: "Pick what you need — adjust quantities anytime" },
    { step: "3", title: "Pay & receive", hint: "Mobile Money, then delivery or pickup in Lusaka" }
  ] as const,
  /** Short chips under the hero headline */
  heroCategories: [
    "Chargers",
    "Phone cases",
    "Stationery",
    "Storage",
    "Audio"
  ] as const,
  promise: [
    "Genuine products",
    "Fair prices",
    "Fast delivery"
  ] as const,
  /** Full lockup asset (OG / apple icon). In-app UI uses logoMark only. */
  logo: "/brand/g-products-logo.png",
  logoSm: "/brand/g-products-logo-sm.png",
  /** Original G mark PNG — nav, hero, auth, desk (do not redraw) */
  logoMark: "/brand/g-products-mark.png",
  description:
    "G-Products — genuine electronics, phone accessories and stationery at fair prices in Lusaka. Shop online with Mobile Money, free campus delivery where applicable, and pickup at UNZA, Kalingalinga and Balastone. Printing, key cutting and G-Loans available in-store.",
  whatsappNumber: "260972500209",
  phoneDisplay: "0972 500 209",
  contacts: [
    {
      label: "Main line",
      display: "0972 500 209",
      tel: "+260972500209",
      whatsapp: "260972500209"
    },
    {
      label: "Line 2",
      display: "0761 671 466",
      tel: "+260761671466",
      whatsapp: "260761671466"
    },
    {
      label: "Line 3",
      display: "0951 418 342",
      tel: "+260951418342",
      whatsapp: "260951418342"
    }
  ] satisfies ContactNumber[],
  /** @deprecated Prefer contacts[].display — kept for older call sites */
  phones: ["0972 500 209", "0761 671 466", "0951 418 342"],
  whatsappCatalogue:
    "https://wa.me/p/25113541318260054/260972500209",
  /** Internal / admin only — do not show on the public storefront */
  owner: "Gift Mbumwae",
  locations: [
    {
      id: "unza-main",
      name: "UNZA – Kafue Small Gate",
      address: "Opposite School of Engineering, University of Zambia",
      landmark: "Kafue Small Gate",
      hours: "Sun–Thu 06:00–24:00 · Fri 06:00–18:00 · Sat 18:00–24:00",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=UNZA+Kafue+Small+Gate+School+of+Engineering+Lusaka"
    },
    {
      id: "unza-ridgeway",
      name: "UNZA Ridgeway",
      address: "A Block, Room 7, Ridgeway Campus",
      landmark: "A Block Room 7",
      hours: "Sun–Thu 06:00–24:00 · Fri 06:00–18:00 · Sat 18:00–24:00",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=UNZA+Ridgeway+Campus+Lusaka"
    },
    {
      id: "kalingalinga",
      name: "Kalingalinga",
      address: "Along Sikwazi Road, Kalingalinga, Lusaka",
      landmark: "Sikwazi Road",
      hours: "Sun–Thu 06:00–24:00 · Fri 06:00–18:00 · Sat 18:00–24:00",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Sikwazi+Road+Kalingalinga+Lusaka"
    },
    {
      id: "balastone",
      name: "Balastone – Eden University",
      address: "Eden University area, Balastone, Lusaka",
      landmark: "Eden University",
      hours: "Sun–Thu 06:00–24:00 · Fri 06:00–18:00 · Sat 18:00–24:00",
      mapsUrl:
        "https://www.google.com/maps/search/?api=1&query=Eden+University+Balastone+Lusaka"
    }
  ] as StoreLocation[],
  /** Short labels for compact UI (footer strip, etc.) */
  locationLabels: [
    "UNZA – Kafue Small Gate",
    "UNZA Ridgeway – A Block Room 7",
    "Kalingalinga – Along Sikwazi Road",
    "Balastone – Eden University"
  ],
  branch: "Kalingalinga – Along Sikwazi Road",
  currency: "ZMW",
  currencySymbol: "K",
  deliveryArea: "Lusaka & nationwide",
  deliveryNote:
    "Free delivery within school / campus where applicable. Pickup at UNZA, Kalingalinga or Balastone — or Yango / Lusaka & nationwide delivery.",
  supportEmail: "hello@gproducts.zm",
  /**
   * Public social profiles — set full profile URLs when official pages go live.
   * Empty string or bare network roots (…facebook.com/) = PLACEHOLDER / unset;
   * the footer only shows links that look like real profiles.
   */
  social: {
    /** PLACEHOLDER — replace with e.g. https://www.facebook.com/YourPage */
    facebook: "",
    /** PLACEHOLDER — replace with e.g. https://www.instagram.com/yourhandle */
    instagram: "",
    /** PLACEHOLDER — replace with e.g. https://www.tiktok.com/@yourhandle */
    tiktok: ""
  },
  /**
   * Hot deals countdown end (ISO). Update this when a promo season ends.
   * Shown on deal cards while compareAt / hotDeal savings apply.
   */
  dealSeasonEndsAt: "2026-09-30T23:59:59+02:00",
  mobileMoney: {
    mtn: { label: "MTN MoMo", number: "0765812843", accountName: "G-Products" },
    airtel: {
      label: "Airtel Money",
      number: "20106681",
      accountName: "G-Products"
    },
    zamtel: {
      label: "Zamtel Money",
      number: "820724",
      accountName: "G-Products"
    }
  },
  hours: [
    { days: "Sunday - Thursday", time: "06:00 - 24:00" },
    { days: "Friday", time: "06:00 - 18:00" },
    { days: "Saturday", time: "18:00 - 24:00" }
  ],
  trust: [
    { title: "Genuine Products", subtitle: "Quality you can trust" },
    { title: "Fair Prices", subtitle: "Value without compromise" },
    { title: "Fast Service", subtitle: "Shop · print · pickup" },
    { title: "Excellent Support", subtitle: "WhatsApp & in-store help" }
  ],
  values: [
    {
      title: "Genuineness",
      body: "We stock real products you can rely on — not mystery knock-offs."
    },
    {
      title: "Fair Pricing",
      body: "Clear prices that respect students, families and everyday shoppers."
    },
    {
      title: "Excellent Customer Service",
      body: "Friendly help in person and on WhatsApp until your order is sorted."
    },
    {
      title: "Fast Service",
      body: "Quick fulfilment for shop orders, printing jobs and key cutting."
    }
  ],
  /**
   * Emails that may create a Provider desk account via public signup.
   * Everyone else who signs up becomes a shop customer.
   * Staff never self-register — the owner adds them in /admin/staff.
   */
  providerSignupEmails: ["gift@gproducts.zm"],
  /** In-app destinations after auth */
  apps: {
    customer: {
      home: "/profile/account"
    },
    provider: {
      home: "/admin"
    }
  }
};

export type SiteConfig = typeof siteConfig;

/** Primary WhatsApp chat link with optional prefilled text */
export function whatsappHref(text?: string): string {
  const base = `https://wa.me/${siteConfig.whatsappNumber}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

const SOCIAL_PLACEHOLDERS = new Set([
  "",
  "https://www.facebook.com/",
  "https://facebook.com/",
  "https://www.instagram.com/",
  "https://instagram.com/",
  "https://www.tiktok.com/",
  "https://tiktok.com/"
]);

/** Links that are ready to show publicly (not empty / bare network roots). */
export function configuredSocialLinks(): {
  label: string;
  href: string;
}[] {
  const entries: { label: string; href: string }[] = [
    { label: "Facebook", href: siteConfig.social.facebook.trim() },
    { label: "Instagram", href: siteConfig.social.instagram.trim() },
    { label: "TikTok", href: siteConfig.social.tiktok.trim() }
  ];
  return entries.filter((e) => {
    if (!e.href) return false;
    const normalized = e.href.replace(/\/$/, "") + "/";
    if (SOCIAL_PLACEHOLDERS.has(e.href) || SOCIAL_PLACEHOLDERS.has(normalized)) {
      return false;
    }
    return /^https?:\/\//i.test(e.href);
  });
}
