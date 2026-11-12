import type { MetadataRoute } from "next";
import { products, activeCategories, categoryHref, byCategory, type CategorySlug } from "@/lib/products";
import { livePosts } from "@/lib/blog-live";
import { siteUrl } from "@/lib/config";

// Last-edited dates of the static pages, from git history (git log -1 --format=%cs -- <page file>).
// Update the date here when you change the page.
const staticLastmod: Record<string, string> = {
  "": "2026-10-12",
  "/shop": "2026-10-12",
  "/blog": "2026-10-15",
  "/about": "2026-10-12",
  "/contact": "2026-10-12",
  "/faq": "2026-10-12",
  "/shipping-returns": "2026-10-12",
  "/refund-policy": "2026-10-12",
  "/payment-methods": "2026-10-12",
  "/track-order": "2026-10-12",
  "/privacy": "2026-10-12",
  "/terms": "2026-10-12",
};

// A category page changes when its products change, so its lastmod is the newest
// product edit inside that category.
const categoryLastmod = (slug: CategorySlug) => {
  const dates = byCategory(slug).map((p) => p.updated).sort();
  return new Date(dates[dates.length - 1] ?? "2026-10-12");
};

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return [
    ...Object.entries(staticLastmod).map(([p, d]) => ({
      url: base + p,
      lastModified: new Date(d),
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.5,
    })),
    ...activeCategories().map((c) => ({
      url: base + categoryHref(c.slug),
      lastModified: categoryLastmod(c.slug),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...products.map((p) => ({
      url: base + "/products/" + p.slug,
      lastModified: new Date(p.updated),
      changeFrequency: "weekly" as const,
      priority: 0.7,
      ...(p.image ? { images: [base + p.image] } : {}),
    })),
    ...livePosts.map((p) => ({ url: base + "/blog/" + p.slug, lastModified: new Date(p.date), changeFrequency: "monthly" as const, priority: 0.6 })),
  ];
}
