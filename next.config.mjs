// Categories with their own real page (app/<slug>/page.tsx). Keep in sync with
// categoryPages in lib/products.ts.
const CATEGORY_PAGES = ["pokemon", "one-piece", "baseball", "football", "basketball"];

// Query params that mean "a filtered shop view" — those stay on /shop. Only a plain
// /shop?category=<slug> (plus optional ?page=) moves to the real category page.
const FILTER_PARAMS = ["q", "brand", "set", "boxType", "year", "min", "max", "inStock", "sort"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Product images are plain <img> tags pointing at /public files or verified direct URLs,
  // so no remotePatterns are required. If you switch ProductImage to next/image with remote
  // hosts, add them here:
  // images: { remotePatterns: [{ protocol: "https", hostname: "example-cdn.com" }] },

  async headers() {
    return [
      {
        // Product photos in /public/products, matched by file extension only — a path
        // prefix would also catch the /products/<slug> product pages, which must NOT
        // be cached this way. NOTE: photo filenames are product slugs, not content
        // hashes, so if you replace a photo, rename the file — an unchanged filename
        // keeps serving the old photo for up to a year.
        source: "/products/:path*\\.(jpg|jpeg|png|webp|avif)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },

  async redirects() {
    return CATEGORY_PAGES.map((slug) => ({
      source: "/shop",
      has: [{ type: "query", key: "category", value: `^${slug}$` }],
      missing: FILTER_PARAMS.map((key) => ({ type: "query", key })),
      destination: `/${slug}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
