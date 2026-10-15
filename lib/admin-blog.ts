// Server-only helpers for the admin blog editor (Supabase REST, service-role key).

import type { BlogRow } from "./blog-live";

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
const configured = () => !!(url() && key());
const headers = (extra: Record<string, string> = {}) => ({
  apikey: key()!,
  Authorization: `Bearer ${key()}`,
  "Content-Type": "application/json",
  ...extra,
});

type Row = {
  slug: string;
  title: string;
  description: string | null;
  post_date: string;
  body: string | null;
  image_url: string | null;
  shop_label: string | null;
  shop_href: string | null;
  published: boolean | null;
};

const rowToBlog = (r: Row): BlogRow => {
  const x: BlogRow = {
    slug: r.slug,
    title: r.title,
    description: r.description ?? "",
    date: String(r.post_date).slice(0, 10),
    body: r.body ?? "",
    published: r.published !== false,
  };
  if (r.image_url) x.image = r.image_url;
  if (r.shop_label) x.shopLabel = r.shop_label;
  if (r.shop_href) x.shopHref = r.shop_href;
  return x;
};

export async function listBlogRows(): Promise<{ rows: BlogRow[]; error?: string }> {
  if (!configured()) return { rows: [], error: "The database is not configured (check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)." };
  try {
    const r = await fetch(`${url()}/rest/v1/blog_posts?select=*&order=created_at.asc`, { headers: headers(), cache: "no-store" });
    if (r.status === 404) return { rows: [], error: "The blog table does not exist yet. Run supabase/blog.sql in the Supabase SQL Editor." };
    if (!r.ok) return { rows: [], error: `Could not load posts (${r.status}).` };
    return { rows: ((await r.json()) as Row[]).map(rowToBlog) };
  } catch {
    return { rows: [], error: "Could not reach the database." };
  }
}

export async function getBlogRow(slug: string): Promise<BlogRow | null> {
  if (!configured()) return null;
  try {
    const r = await fetch(`${url()}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}&select=*`, { headers: headers(), cache: "no-store" });
    if (!r.ok) return null;
    const rows = (await r.json()) as Row[];
    return rows[0] ? rowToBlog(rows[0]) : null;
  } catch {
    return null;
  }
}

// Returns an error message, or null on success.
export async function upsertBlogRow(x: BlogRow): Promise<string | null> {
  if (!configured()) return "The database is not configured.";
  const row = {
    slug: x.slug,
    title: x.title,
    description: x.description,
    post_date: x.date,
    body: x.body,
    image_url: x.image ?? null,
    shop_label: x.shopLabel ?? null,
    shop_href: x.shopHref ?? null,
    published: x.published,
    updated_at: new Date().toISOString(),
  };
  try {
    const r = await fetch(`${url()}/rest/v1/blog_posts?on_conflict=slug`, {
      method: "POST",
      headers: headers({ Prefer: "resolution=merge-duplicates,return=minimal" }),
      body: JSON.stringify(row),
      cache: "no-store",
    });
    if (r.status === 404) return "The blog table does not exist yet. Run supabase/blog.sql in the Supabase SQL Editor.";
    if (!r.ok) return `Could not save (${r.status}).`;
    return null;
  } catch {
    return "Could not reach the database.";
  }
}

export async function deleteBlogRow(slug: string): Promise<boolean> {
  if (!configured()) return false;
  try {
    const r = await fetch(`${url()}/rest/v1/blog_posts?slug=eq.${encodeURIComponent(slug)}`, { method: "DELETE", headers: headers(), cache: "no-store" });
    return r.ok;
  } catch {
    return false;
  }
}