import { resolveImageUrl } from "@/lib/resolve-image";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const url = await resolveImageUrl(slug);
  if (!url) return new Response("No image", { status: 404, headers: { "Cache-Control": "public, max-age=300" } });

  try {
    const upstream = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; HarborlineDemo/1.0)", Accept: "image/*" },
      next: { revalidate: 86400 },
    } as RequestInit);
    const type = upstream.headers.get("content-type") || "";
    if (!upstream.ok || !type.startsWith("image/")) {
      return new Response("No image", { status: 404, headers: { "Cache-Control": "public, max-age=300" } });
    }
    return new Response(upstream.body, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400",
      },
    });
  } catch {
    return new Response("No image", { status: 502, headers: { "Cache-Control": "public, max-age=60" } });
  }
}