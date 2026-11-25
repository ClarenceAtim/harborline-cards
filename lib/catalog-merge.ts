// Merges seller edits (stored in Supabase, pulled into catalog-extras.generated.json at build time)
// onto the catalog that lives in code. Pure functions: safe to import anywhere.

import type { CategorySlug, Product } from "./products";
import { isEuropeanEdition, usdToEur } from "./eur-pricing";

export type Extra = {
  slug: string;
  isNew: boolean;
  hidden: boolean;
  name?: string;
  brand?: string;
  category?: string;
  set?: string;
  year?: number;
  boxType?: string;
  description?: string;
  price?: number; // dollars
  stock?: number;
  featured?: boolean;
  image?: string; // full public URL
  updatedAt?: string; // ISO timestamp of the seller's edit (Supabase updated_at / created_at)
};

const KEYS: (keyof Extra)[] = ["slug", "isNew", "hidden", "name", "brand", "category", "set", "year", "boxType", "description", "price", "stock", "featured", "image"];

// Stable string used to tell whether live edits differ from what is published on the site.
export const normalizeExtras = (xs: Extra[]) =>
  JSON.stringify([...xs].sort((a, b) => a.slug.localeCompare(b.slug)).map((x) => KEYS.map((k) => x[k] ?? null)));

function newProduct(x: Extra, n: number): Product {
  const stock = x.stock ?? 0;
  const name = x.name ?? x.slug;
  const brand = x.brand ?? "";
  const set = x.set ?? "";
  const year = x.year ?? new Date().getFullYear();
  const boxType = x.boxType ?? "";
  return {
    id: `x${String(n + 1).padStart(3, "0")}`,
    slug: x.slug,
    name,
    brand,
    category: (x.category ?? "other-tcg") as CategorySlug,
    set,
    year,
    boxType,
    description: x.description || `${name} is a sealed ${boxType.toLowerCase() || "trading-card product"} from ${set || brand || "this release"} (${year}). It is listed for collectors who want factory-sealed product from this set; check the manufacturer's checklist for exact contents and odds before purchasing.`,
    price: x.price ?? 0,
    currency: "USD",
    image: x.image ?? "",
    imageStatus: x.image ? "source-photo" : "placeholder",
    gallery: [],
    stock,
    availability: stock > 0 ? "in_stock" : "out_of_stock",
    featured: !!x.featured,
    specifications: { Brand: brand, Set: set, Year: String(year), Format: boxType },
    seoTitle: name,
    seoDescription: `Shop ${name}, a sealed ${boxType.toLowerCase() || "trading-card product"} from ${set || brand || "this release"} (${year}). Order request with seller-confirmed payment and shipping.`,
    // Seller-added products carry their edit date when the catalog pull provides one;
    // otherwise fall back to the catalog's known-as-of date (see CATALOG_LAST_EDITED in lib/products.ts).
    updated: x.updatedAt ? x.updatedAt.slice(0, 10) : "2026-10-12",
    verification: { name: "verified", price: "verified", stock: "verified", image: x.image ? "verified" : "placeholder" },
    source: "Added by the seller",
  };
}

export function applyExtras(base: Product[], extras: Extra[], opts: { keepHidden?: boolean } = {}): Product[] {
  const out: Product[] = base.map((p) => ({ ...p, specifications: { ...p.specifications }, verification: { ...p.verification } }));

  for (const x of extras) {
    if (!x || !x.slug) continue;
    const idx = out.findIndex((p) => p.slug === x.slug);

    if (x.isNew) {
      if (idx !== -1) continue; // name clash with an existing product: ignore the extra
      if (x.hidden && !opts.keepHidden) continue;
      out.push(newProduct(x, out.length));
      continue;
    }

    if (idx === -1) continue;
    if (x.hidden && !opts.keepHidden) {
      out.splice(idx, 1);
      continue;
    }

    const p = out[idx];
    if (x.name) {
      p.name = x.name;
      p.seoTitle = `${x.name} | Harborline Cards`;
    }
    // The admin price field is US dollars. On a euro product the stored
    // dollars convert to euros, so a seller price edit flows through.
    if (typeof x.price === "number") {
      if (p.currency === "EUR") {
        p.usdPrice = x.price;
        p.price = usdToEur(x.price);
      } else {
        p.price = x.price;
      }
    }
    if (typeof x.stock === "number") {
      p.stock = x.stock;
      p.availability = x.stock > 0 ? "in_stock" : "out_of_stock";
      p.verification.stock = "verified";
    }
    if (x.description) p.description = x.description;
    if (typeof x.featured === "boolean") p.featured = x.featured;
    if (x.image) {
      p.image = x.image;
      p.imageStatus = "source-photo";
      p.verification.image = "verified";
    }
    if (x.updatedAt) p.updated = x.updatedAt.slice(0, 10);
  }

  // European editions are priced in euros. The admin stores USD only, so the
  // euro price is derived from the stored USD price (see lib/eur-pricing.ts).
  // Runs last, so a seller price edit flows through to the euro price.
  // Products already priced in euros (code catalog) are left alone.
  for (const p of out) {
    if (p.currency === "USD" && isEuropeanEdition(p.slug)) {
      p.usdPrice = p.price;
      p.price = usdToEur(p.price);
      p.currency = "EUR";
    }
  }
  return out;
}