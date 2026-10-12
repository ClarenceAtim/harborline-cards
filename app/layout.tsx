import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { siteUrl, store } from "@/lib/config";
import { siteDescription, siteKeywords, siteTitle } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: { default: siteTitle, template: "%s | " + store.name },
  description: siteDescription,
  keywords: siteKeywords,
  applicationName: store.name,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  openGraph: { type: "website", siteName: store.name, title: siteTitle, description: siteDescription, locale: "en_US" },
  twitter: { card: "summary_large_image", title: siteTitle, description: siteDescription },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Store",
      "@id": siteUrl() + "/#store",
      name: store.name,
      url: siteUrl(),
      description: siteDescription,
      telephone: store.phone,
      ...(store.publicContactEmail ? { email: store.publicContactEmail } : {}),
    },
    {
      "@type": "WebSite",
      "@id": siteUrl() + "/#website",
      url: siteUrl(),
      name: store.name,
      potentialAction: {
        "@type": "SearchAction",
        target: siteUrl() + "/shop?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:rounded focus:bg-white focus:p-2">Skip to content</a>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}