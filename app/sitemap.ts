import type { MetadataRoute } from "next";
import { products, activeCategories } from "@/lib/products";
import { siteUrl } from "@/lib/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
   const statics = ["", "/shop", "/about", "/contact", "/faq", "/shipping-returns", "/refund-policy", "/payment-methods", "/track-order", "/privacy", "/terms"];
  return [
    ...statics.map((p) => ({ url: base + p, changeFrequency: "weekly" as const, priority: p === "" ? 1 : 0.5 })),
    ...activeCategories().map((c) => ({ url: base + "/shop?category=" + c.slug, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: base + "/products/" + p.slug, changeFrequency: "weekly" as const, priority: 0.7 })),
  ];
}