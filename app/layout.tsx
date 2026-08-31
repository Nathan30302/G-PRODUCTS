import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Syne } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/components/Toast";
import { SiteChrome } from "@/components/SiteChrome";
import { AbandonedCartNudge } from "@/components/AbandonedCartNudge";
import { siteConfig } from "@/config/site";
import { siteUrl } from "@/lib/site-url";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  keywords: [
    "G-Products",
    "phone accessories Lusaka",
    "electronics shop Zambia",
    "laptop chargers Lusaka",
    "flash drives Zambia",
    "stationery UNZA",
    "Mobile Money shop Zambia",
    "printing near UNZA",
    "key cutting Lusaka"
  ],
  icons: {
    icon: [{ url: siteConfig.logoMark, type: "image/png" }],
    apple: [{ url: siteConfig.logo, type: "image/png" }]
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: siteUrl(),
    images: [
      {
        url: siteConfig.logo,
        width: 768,
        height: 768,
        alt: siteConfig.legalName
      }
    ]
  },
  alternates: {
    canonical: "/"
  }
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${syne.variable}`}>
      <body className="min-h-dvh bg-gp-bg font-sans text-gp-text antialiased">
        <CartProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
            <AbandonedCartNudge />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
