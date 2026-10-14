// Server-only helpers for the admin product editor (Supabase REST + Storage, service-role key).

import type { Extra } from "./catalog-merge";

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
export const catalogDbConfigured = () => !!(url() && key());

const auth = () => ({ apikey: key()!, Authorization: `Bearer ${key()}` });
const json = (extra: Record<string, string> = {}) => ({ ...auth(), "Content-Type": "application/json", ...extra });

type Row = {
  slug: string; is_new: boolean | null; hidden: boolean | null;
  name: string | null; brand: string | null; category: string | null; set_name: string | null;
  year: number | null; box_type: string | null; description: string | null;
  price_cents: number | null; stock: number | null; featured: boolean | null; image_url: string | null;
};

const rowToExtra = (r: Row): Extra => {
  const x: Extra = { slug: r.slug, isNew: !!r.is_new, hidden: !!r.hidden };
  if (r.name != null) x.name = r.name;
  if (r.brand != null) x.brand = r.brand;
  if (r.category != null) x.category = r.category;
  if (r.set_name != null) x.set = r.set_name;
  if (r.year != null) x.year = r.year;
  if (r.box_type != null) x.boxType = r.box_type;
  if (r.description != null) x.description = r.description;
  if (r.price_cents != null) x.price = r.price_cents / 100;
  if (r.stock != null) x.stock = r.stock;
  if (r.featured != null) x.featured = r.featured;
  if (r.image_url != null) x.image = r.image_url;
  return x;
};

export async function listExtras(): Promise<{ extras: Extra[]; error?: string }> {
  if (!catalogDbConfigured()) return { extras: [], error: "The database is not configured (check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)." };
  try {
    const r = await fetch(`${url()}/rest/v1/catalog_items?select=*&order=created_at.asc`, { headers: json(), cache: "no-store" });
    if (r.status === 404) return { extras: [], error: "The catalog table does not exist yet. Run supabase/catalog.sql in the Supabase SQL Editor." };
    if (!r.ok) return { extras: [], error: `Could not load products (${r.status}).` };
    return { extras: ((await r.json()) as Row[]).map(rowToExtra) };
  } catch {
    return { extras: [], error: "Could not reach the database." };
  }
}

export async function getExtra(slug: string): Promise<Extra | null> {
  if (!catalogDbConfigured()) return null;
  try {
    const r = await fetch(`${url()}/rest/v1/catalog_items?slug=eq.${encodeURIComponent(slug)}&select=*`, { headers: json(), cache: "no-store" });
    if (!r.ok) return null;
    const rows = (await r.json()) as Row[];
    return rows[0] ? rowToExtra(rows[0]) : null;
  } catch {
    return null;
  }
}

// Returns an error message, or null on success.
export async function upsertExtra(x: Extra): Promise<string | null> {
  if (!catalogDbConfigured()) return "The database is not configured.";
  const row = {
    slug: x.slug,
    is_new: x.isNew,
    hidden: x.hidden,
    name: x.name ?? null,
    brand: x.brand ?? null,
    category: x.category ?? null,
    set_name: x.set ?? null,
    year: x.year ?? null,
    box_type: x.boxType ?? null,
    description: x.description ?? null,
    price_cents: typeof x.price === "number" ? Math.round(x.price * 100) : null,
    stock: typeof x.stock === "number" ? x.stock : null,
    featured: typeof x.featured === "boolean" ? x.featured : null,
    image_url: x.image ?? null,
    updated_at: new Date().toISOString(),
  };
  try {
    const r = await fetch(`${url()}/rest/v1/catalog_items?on_conflict=slug`, {
      method: "POST",
      headers: json({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (r.status === 404) return "The catalog table does not exist yet. Run supabase/catalog.sql in the Supabase SQL Editor.";
    if (!r.ok) return `Could not save (${r.status}).`;
    return null;
  } catch {
    return "Could not reach the database.";
  }
}

export async function deleteExtra(slug: string): Promise<boolean> {
  if (!catalogDbConfigured()) return false;
  try {
    const r = await fetch(`${url()}/rest/v1/catalog_items?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", headers: json(), cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}

const TYPES: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export async function uploadProductImage(slug: string, file: File): Promise<{ url?: string; error?: string }> {
  if (!catalogDbConfigured()) return { error: "The database is not configured." };
  const ext = TYPES[file.type];
  if (!ext) return { error: "Photo must be a JPG, PNG or WebP image." };
  if (file.size > 1_000_000) return { error: "Photo is too large. Use an image under 1 MB (the form shrinks photos automatically in most browsers)." };
  const path = `${slug}-${Date.now()}.${ext}`;
  try {
    const body = new Blob([await file.arrayBuffer()], { type: file.type });
    const r = await fetch(`${url()}/storage/v1/object/product-images/${path}`, {
      method: "POST",
      headers: { ...auth(), "Content-Type": file.type, "x-upsert": "true" },
      body,
      cache: "no-store",
    });
    if (!r.ok) return { error: `Photo upload failed (${r.status}). Check that supabase/catalog.sql was run.` };
    return { url: `${url()}/storage/v1/object/public/product-images/${path}` };
  } catch {
    return { error: "Could not reach the photo storage." };
  }
}