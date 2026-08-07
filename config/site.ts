export const siteConfig = {
  name: "G-Products",
  legalName: "G-Products and Services",
  tagline: "Heart Gladdening Products",
  /** Official brand lockup — use everywhere as the logo */
  logo: "/brand/g-products-logo.png",
  logoMark: "/brand/g-products-mark.png",
  description:
    "G-Products and Services — quality printing, electronics, stationery, accessories and essential services at affordable prices. Free delivery within school.",
  whatsappNumber: "260972500209",
  phoneDisplay: "+260 972 500 209",
  phones: ["0972500209", "0761671466", "+260 95 1418342"],
  whatsappCatalogue:
    "https://wa.me/p/25113541318260054/260972500209",
  /** Internal / admin only — do not show on the public storefront */
  owner: "Gift Mbumwae",
  locations: [
    "UNZA – Kafue Small Gate (Opposite School of Engineering)",
    "UNZA Ridgeway – A Block Room 7",
    "Kalingalinga – Along Sikwazi Road",
    "Balastone – Eden University"
  ],
  branch: "Kalingalinga – Along Sikwazi Road",
  currency: "ZMW",
  currencySymbol: "K",
  deliveryArea: "Lusaka & nationwide",
  deliveryNote:
    "Quick & FREE delivery within school. Pickup at UNZA, Kalingalinga or Balastone — or Yango / nationwide delivery.",
  supportEmail: "hello@gproducts.zm",
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
    { title: "Mobile Money", subtitle: "MTN, Airtel & Zamtel" },
    { title: "Free school delivery", subtitle: "Quick within campus" },
    { title: "4 locations", subtitle: "UNZA · Kalingalinga · Balastone" }
  ]
};

export type SiteConfig = typeof siteConfig;
