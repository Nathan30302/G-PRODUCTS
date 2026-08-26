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
import { getPublicAuth } from "@/lib/public-auth";

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
    "printing near UNZA",
    "stationery UNZA",
    "phone accessories Lusaka",
    "laptop chargers Lusaka",
    "flash drives Zambia",
    "key cutting Lusaka",
    "Mobile Money shop Zambia"
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
  themeColor: "#06181c",
  width: "device-width",
  initialScale: 1
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  let auth = null;
  try {
    auth = await getPublicAuth();
  } catch (err) {
    console.error("[layout] auth read failed:", err);
  }

  return (
    <html lang="en" className={`${GeistSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-ink-950 font-sans text-white antialiased">
        <CartProvider>
          <ToastProvider>
            <SiteChrome auth={auth}>{children}</SiteChrome>
            <AbandonedCartNudge />
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
