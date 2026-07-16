export const siteConfig = {
  name: "G-Products",
  legalName: "G-Products and Services",
  tagline: "Heart Gladdening Products",
  description:
    "G-Products and Services - powering your devices and perfecting your prints, all in one place. Shop chargers, power banks, headphones, phones, laptops and more. Pay with Mobile Money, delivered in Zambia.",
  whatsappNumber: "260972500209", // international format, no + or spaces
  phoneDisplay: "+260 972 500 209",
  owner: "Gift Mbumwae",
  branch: "Kalingalinga, Lusaka",
  currency: "ZMW",
  currencySymbol: "K",
  deliveryArea: "Lusaka & nationwide",
  supportEmail: "hello@gproducts.zm",
  // Mobile Money accounts (Kalingalinga branch - deposits & withdrawals)
  mobileMoney: {
    mtn: { label: "MTN MoMo", number: "0765812843", accountName: "Gift Mbumwae" },
    airtel: { label: "Airtel Money", number: "20106681", accountName: "Gift Mbumwae" },
    zamtel: { label: "Zamtel Money", number: "820724", accountName: "Gift Mbumwae" }
  },
  hours: [
    { days: "Sunday - Thursday", time: "06:00 - 24:00" },
    { days: "Friday", time: "06:00 - 18:00" },
    { days: "Saturday", time: "18:00 - 24:00" }
  ],
  trust: [
    { title: "Genuine Products", subtitle: "Quality you can trust" },
    { title: "Mobile Money", subtitle: "MTN, Airtel & Zamtel" },
    { title: "Fast Delivery", subtitle: "Lusaka & nationwide" },
    { title: "Easy Returns", subtitle: "Hassle-free support" }
  ]
};

export type SiteConfig = typeof siteConfig;
