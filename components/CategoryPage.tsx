import Link from "next/link";
import { notFound } from "next/navigation";
import { activeCategories, categoryLabel } from "@/lib/products";
import { filterProducts } from "@/lib/shop";
import { categorySeo } from "@/lib/seo";
import ProductCard from "./ProductCard";

// One category's own page (e.g. /pokemon): the same product grid the old
// /shop?category=<slug> filter showed, with the intro paragraph from lib/seo.ts
// (categorySeo — edit the text there, not in this component).
export default function CategoryPage({ slug, page }: { slug: string; page: number }) {
  const cat = activeCategories().find((c) => c.slug === slug);
  if (!cat) notFound();

  const { items, total, page: safePage, totalPages } = filterProducts({ category: slug, page: String(page) });
  const seo = categorySeo[slug];
  const hrefFor = (p: number) => (p <= 1 ? `/${slug}` : `/${slug}?page=${p}`);

  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
        <Link href="/" className="hover:underline">Home</Link> /{" "}
        <Link href="/shop" className="hover:underline">Shop</Link> /{" "}
        <span>{categoryLabel(slug)}</span>
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold">{categoryLabel(slug)}</h1>
      <p className="mt-1 text-sm text-ink-soft" aria-live="polite">{total} product{total === 1 ? "" : "s"}</p>
      {seo && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">{seo.intro}</p>}

      <div className="mt-6">
        {items.length === 0 ? (
          <div className="rounded-lg border border-ink/10 bg-white p-10 text-center">
            <p className="font-semibold">{categoryLabel(slug)} products are coming soon.</p>
            <Link href="/shop" className="btn-primary mt-4">Browse all products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
            {items.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3 text-sm">
            {safePage > 1 ? <Link className="btn-ghost" href={hrefFor(safePage - 1)}>← Previous</Link> : <span />}
            <span>Page {safePage} of {totalPages}</span>
            {safePage < totalPages ? <Link className="btn-ghost" href={hrefFor(safePage + 1)}>Next →</Link> : <span />}
          </nav>
        )}
      </div>
    </div>
  );
}
