import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { products, getProduct, categoryLabel } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { siteUrl } from "@/lib/config";
import ProductImage from "@/components/ProductImage";
import AddToCart from "@/components/AddToCart";
import ProductCard from "@/components/ProductCard";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return { title: "Product not found" };
  return {
    title: p.seoTitle,
    description: p.seoDescription,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: {
      type: "website",
      title: p.seoTitle,
      description: p.seoDescription,
      url: `/products/${p.slug}`,
      ...(p.image ? { images: [{ url: p.image, alt: p.name }] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();

  const soldOut = p.stock <= 0 || p.availability !== "in_stock";
  const related = products
    .filter((x) => x.id !== p.id && (x.category === p.category))
    .sort((a, b) => Number(b.set === p.set) - Number(a.set === p.set))
    .slice(0, 4);
  const gallery = p.gallery.length ? p.gallery : [""];

  // Structured data: price/availability mirror the catalog exactly. No ratings or reviews.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    brand: { "@type": "Brand", name: p.brand },
    description: p.description,
    sku: p.id,
    ...(p.image ? { image: [`${siteUrl()}${p.image}`] } : {}),
    offers: {
      "@type": "Offer",
      url: `${siteUrl()}/products/${p.slug}`,
      priceCurrency: p.currency,
      price: p.price.toFixed(2),
      availability: soldOut ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
    },
  };

  return (
    <div className="container-x py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/shop" className="hover:underline">Shop</Link> /{" "}
        <Link href={`/shop?category=${p.category}`} className="hover:underline">{categoryLabel(p.category)}</Link> /{" "}
        <span className="text-ink-soft">{p.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-2">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg border border-ink/10 bg-white">
            <ProductImage product={p} src={p.image || undefined} />
          </div>
          {p.gallery.length > 1 && (
            <ul className="grid grid-cols-4 gap-2">
              {gallery.map((g, i) => (
                <li key={i} className="overflow-hidden rounded border border-ink/10 bg-white"><ProductImage product={p} src={g} /></li>
              ))}
            </ul>
          )}
          {p.imageStatus === "placeholder" ? (
            <p className="text-xs text-ink-faint">Product photo not yet added. The graphic above is a placeholder, not the actual packaging.</p>
          ) : (
            <p className="text-xs text-ink-faint">Photo taken from a retailer listing for this educational demo. Replace with licensed images before going live.</p>
          )}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{p.brand} · {p.set} · {p.year}</p>
          <h1 className="mt-1 font-display text-3xl font-bold leading-tight">{p.name}</h1>
          <p className="mt-4 text-3xl font-bold">{formatPrice(p.price)}</p>
          <p className={`mt-1 text-sm font-semibold ${soldOut ? "text-red-700" : "text-emerald-700"}`}>
            {soldOut ? "Out of stock" : "In stock"}
          </p>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{p.description}</p>

          <div className="mt-6 max-w-sm"><AddToCart product={p} withQuantity /></div>

          <div className="mt-6 rounded-lg border border-ink/10 bg-white p-4 text-sm">
            <p className="font-semibold">Shipping & payment</p>
            <p className="mt-1 text-ink-soft">
              This is an order request. After you submit, the seller emails payment instructions and confirms the shipping cost. Nothing is charged online. See <Link href="/shipping-returns" className="font-semibold text-harbor underline">shipping & returns</Link>.
            </p>
          </div>

          <h2 className="mt-8 font-display text-xl font-bold">Specifications</h2>
          <dl className="mt-2 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white text-sm">
            {Object.entries(p.specifications).map(([k, v]) => (
              <div key={k} className="grid grid-cols-3 gap-3 px-4 py-2"><dt className="font-semibold text-ink-soft">{k}</dt><dd className="col-span-2">{v}</dd></div>
            ))}
          </dl>
          <p className="mt-3 text-[11px] text-ink-faint">Price verified from a public retailer listing on 2026-10-09 and may change. Stock level is a placeholder.</p>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-14" aria-labelledby="rel-h">
          <h2 id="rel-h" className="font-display text-2xl font-bold">Related products</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} product={r} />)}
          </div>
        </section>
      )}
    </div>
  );
}
