import sources from "../scripts/image-sources.json";

const IMAGE_URL = /\.(jpe?g|png|webp|avif)(\?|$)/i;

export function extractOgImage(html: string, base: string): string | null {
  const m =
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i) ||
    html.match(/"image"\s*:\s*\[?\s*"([^"]+)"/i);
  if (!m) return null;
  try {
    return new URL(m[1].replace(/&amp;/g, "&"), base).href;
  } catch {
    return null;
  }
}

const UA = "Mozilla/5.0 (compatible; HarborlineDemo/1.0)";

export async function resolveImageUrl(slug: string): Promise<string | null> {
  const source = (sources as { slug: string; source: string }[]).find((s) => s.slug === slug)?.source;
  if (!source || !source.startsWith("https://")) return null;
  if (IMAGE_URL.test(source) || source.includes("/_next/image")) return source;
  try {
    const res = await fetch(source, { headers: { "User-Agent": UA }, next: { revalidate: 86400 } } as RequestInit);
    if (!res.ok) return null;
    const url = extractOgImage(await res.text(), source);
    return url && url.startsWith("https://") ? url : null;
  } catch {
    return null;
  }
}