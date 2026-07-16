import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { ToastProvider } from "@/components/Toast";
import { SiteChrome } from "@/components/SiteChrome";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://gproducts.zm"),
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`
  },
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website"
  }
};

export const viewport: Viewport = {
  themeColor: "#06181c",
  width: "device-width",
  initialScale: 1
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen bg-ink-950 text-white antialiased">
        <CartProvider>
          <ToastProvider>
            <SiteChrome>{children}</SiteChrome>
          </ToastProvider>
        </CartProvider>
      </body>
    </html>
  );
}
