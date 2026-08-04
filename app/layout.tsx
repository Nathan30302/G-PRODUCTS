import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { Syne } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/components/Toast";
import { SiteChrome } from "@/components/SiteChrome";
import { siteConfig } from "@/config/site";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
  weight: ["500", "600", "700", "800"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gproducts.zm"),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  icons: {
    icon: [{ url: siteConfig.logoMark, type: "image/png" }],
    apple: [{ url: siteConfig.logo, type: "image/png" }]
  },
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    images: [
      {
        url: siteConfig.logo,
        width: 768,
        height: 768,
        alt: siteConfig.legalName
      }
    ]
  }
};

export const viewport: Viewport = {
  themeColor: "#f7f8f9",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${syne.variable}`}>
      <body className="min-h-screen bg-[#f7f8f9] font-sans text-ink-950 antialiased">
        <CartProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
