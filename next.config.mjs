/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Product images are plain <img> tags pointing at /public files or verified direct URLs,
  // so no remotePatterns are required. If you switch ProductImage to next/image with remote
  // hosts, add them here:
  // images: { remotePatterns: [{ protocol: "https", hostname: "example-cdn.com" }] },
};

export default nextConfig;
