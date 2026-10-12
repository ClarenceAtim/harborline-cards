import { products, type Product } from "./products";

export const PAGE_SIZE = 24;

export type ShopParams = {
  q?: string; category?: string; brand?: string; set?: string; boxType?: string;
  year?: string; min?: string; max?: string; inStock?: string; sort?: string; page?: string;
};

export type SortKey = "featured" | "newest" | "price-asc" | "price-desc";

export function filterProducts(sp: ShopParams) {
  const q = (sp.q ?? "").trim().toLowerCase();
  const min = sp.min ? Number(sp.min) : NaN;
  const max = sp.max ? Number(sp.max) : NaN;
  const year = sp.year ? Number(sp.year) : NaN;

  let list = products.filter((p) => {
    if (sp.category && p.category !== sp.category) return false;
    if (sp.brand && p.brand !== sp.brand) return false;
    if (sp.set && p.set !== sp.set) return false;
    if (sp.boxType && p.boxType !== sp.boxType) return false;
    if (!Number.isNaN(year) && p.year !== year) return false;
    if (!Number.isNaN(min) && p.price < min) return false;
    if (!Number.isNaN(max) && p.price > max) return false;
    if (sp.inStock === "1" && !(p.stock > 0 && p.availability === "in_stock")) return false;
    if (q) {
      const hay = `${p.name} ${p.brand} ${p.set} ${p.boxType} ${p.year}`.toLowerCase();
      if (!q.split(/\s+/).every((t) => hay.includes(t))) return false;
    }
    return true;
  });

  const order = new Map(products.map((p, i) => [p.id, i]));
  const sort = (sp.sort ?? "featured") as SortKey;
  const cmp: Record<SortKey, (a: Product, b: Product) => number> = {
    // "Newest" = newest release year first, then later catalog entries. Add a releaseDate field for finer control.
    newest: (a, b) => b.year - a.year || order.get(a.id)! - order.get(b.id)!,
    "price-asc": (a, b) => a.price - b.price,
    "price-desc": (a, b) => b.price - a.price,
    featured: (a, b) => Number(b.featured) - Number(a.featured) || order.get(a.id)! - order.get(b.id)!,
  };
  list = [...list].sort(cmp[sort] ?? cmp.featured);

  const page = Math.max(1, parseInt(sp.page ?? "1", 10) || 1);
  const totalPages = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  return { total: list.length, page: safePage, totalPages, items: list.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE) };
}
