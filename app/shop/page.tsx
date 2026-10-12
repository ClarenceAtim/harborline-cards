import Link from "next/link";
import type { Metadata } from "next";
import { activeCategories, facets, categoryLabel } from "@/lib/products";
import { filterProducts, type ShopParams } from "@/lib/shop";
import ProductCard from "@/components/ProductCard";
import { categorySeo } from "@/lib/seo";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }): Promise<Metadata> {
  const sp = await searchParams;
  const cat = typeof sp.category === "string" ? sp.category : "";
  const seo = categorySeo[cat];
  // Any filter other than category (search, price, sort, page...) is kept out of search results.
  const filtered = Object.keys(sp).some((k) => k !== "category" && sp[k]);
  const base: Metadata = seo
    ? { title: seo.title, description: seo.description, alternates: { canonical: "/shop?category=" + cat } }
    : {
        title: "Shop Sealed Sports Cards & Trading Card Game Boxes",
        description: "Browse hobby boxes, blasters, Pokémon booster boxes, elite trainer boxes, tins and Magic: The Gathering, One Piece, Yu-Gi-Oh! and Dragon Ball products.",
        alternates: { canonical: "/shop" },
      };
  return filtered ? { ...base, robots: { index: false, follow: true } } : base;
}

type SP = Promise<Record<string, string | string[] | undefined>>;

export default async function ShopPage({ searchParams }: { searchParams: SP }) {
  const raw = await searchParams;
  const sp: Record<string, string> = {};
  for (const [k, v] of Object.entries(raw)) sp[k] = Array.isArray(v) ? v[0] ?? "" : v ?? "";

  const { items, total, page, totalPages } = filterProducts(sp as ShopParams);
  const f = facets();
  const active = Object.entries(sp).filter(([k, v]) => v && !["page", "sort"].includes(k)).length;

  const hrefFor = (overrides: Record<string, string | undefined>) => {
    const u = new URLSearchParams();
    for (const [k, v] of Object.entries({ ...sp, ...overrides })) if (v) u.set(k, v);
    const s = u.toString();
    return s ? `/shop?${s}` : "/shop";
  };

  const title = sp.category ? categoryLabel(sp.category) : sp.q ? `Results for “${sp.q}”` : "All products";

  return (
    <div className="container-x py-8">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
        <Link href="/" className="hover:underline">Home</Link> / <span>Shop</span>{sp.category && <> / <span>{categoryLabel(sp.category)}</span></>}
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold">{title}</h1>
      <p className="mt-1 text-sm text-ink-soft" aria-live="polite">{total} product{total === 1 ? "" : "s"}</p>
      {sp.category && categorySeo[sp.category] && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">{categorySeo[sp.category].intro}</p>}

      <div className="mt-6 grid gap-8 lg:grid-cols-[260px_1fr]">
        {/* Filters: a plain GET form, so every filter is shareable via URL and needs no JS. */}
        <form method="get" action="/shop" className="space-y-4 rounded-lg border border-ink/10 bg-white p-4 lg:self-start" aria-label="Product filters">
          <div>
            <label className="label" htmlFor="q">Search</label>
            <input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Name, brand or set" className="field" />
          </div>
          <Select id="category" label="Category" value={sp.category} options={activeCategories().map((c) => [c.slug, c.label])} />
          <Select id="brand" label="Brand" value={sp.brand} options={f.brands.map((b) => [b, b])} />
          <Select id="year" label="Year" value={sp.year} options={f.years.map((y) => [String(y), String(y)])} />
          <Select id="set" label="Set" value={sp.set} options={f.sets.map((s) => [s, s])} />
          <Select id="boxType" label="Box type" value={sp.boxType} options={f.boxTypes.map((b) => [b, b])} />
          <div>
            <span className="label">Price range (USD)</span>
            <div className="flex gap-2">
              <input name="min" inputMode="decimal" defaultValue={sp.min ?? ""} placeholder="Min" aria-label="Minimum price" className="field" />
              <input name="max" inputMode="decimal" defaultValue={sp.max ?? ""} placeholder="Max" aria-label="Maximum price" className="field" />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="inStock" value="1" defaultChecked={sp.inStock === "1"} /> In stock only
          </label>
          <div>
            <label className="label" htmlFor="sort">Sort by</label>
            <select id="sort" name="sort" defaultValue={sp.sort ?? "featured"} className="field">
              <option value="featured">Featured</option>
              <option value="newest">Newest</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary flex-1">Apply filters</button>
            {active > 0 && <Link href="/shop" className="btn-ghost">Clear all</Link>}
          </div>
        </form>

        <div>
          {items.length === 0 ? (
            <div className="rounded-lg border border-ink/10 bg-white p-10 text-center">
              <p className="font-semibold">{sp.category && !activeCategories().some((c) => c.slug === sp.category) ? `${categoryLabel(sp.category)} products are coming soon.` : "No products match these filters."}</p>
              <Link href="/shop" className="btn-primary mt-4">Clear all filters</Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
              {items.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-3 text-sm">
              {page > 1 ? <Link className="btn-ghost" href={hrefFor({ page: String(page - 1) })}>← Previous</Link> : <span />}
              <span>Page {page} of {totalPages}</span>
              {page < totalPages ? <Link className="btn-ghost" href={hrefFor({ page: String(page + 1) })}>Next →</Link> : <span />}
            </nav>
          )}
        </div>
      </div>
    </div>
  );
}

function Select({ id, label, value, options }: { id: string; label: string; value?: string; options: [string, string][] }) {
  return (
    <div>
      <label className="label" htmlFor={id}>{label}</label>
      <select id={id} name={id} defaultValue={value ?? ""} className="field">
        <option value="">All</option>
        {options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
    </div>
  );
}