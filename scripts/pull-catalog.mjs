// Runs automatically before every build ("prebuild" in package.json).
// Pulls the seller's product edits and blog posts from Supabase and writes
// lib/catalog-extras.generated.json (merged by lib/products.ts) and lib/blog-posts.generated.json (merged by lib/blog-live.ts).
//
// - Supabase not configured, or table not created yet: keeps the existing file and continues.
// - Supabase configured but unreachable: FAILS the build, so the live site keeps its last good version
//   instead of silently losing products. Set SKIP_CATALOG_PULL=1 to bypass.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("lib/catalog-extras.generated.json");
const BLOG_OUT = resolve("lib/blog-posts.generated.json");

function loadEnvFile() {
  const f = resolve(".env.local");
  if (!existsSync(f)) return;
  for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!m) continue;
    let v = m[2];
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = v;
  }
}

loadEnvFile();

if (process.env.SKIP_CATALOG_PULL === "1") {
  console.log("[catalog] skipped (SKIP_CATALOG_PULL=1)");
  process.exit(0);
}

const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.log("[catalog] Supabase is not configured; keeping the existing catalog file.");
  process.exit(0);
}

const omitNull = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => v !== null && v !== undefined));
const headers = { apikey: key, Authorization: `Bearer ${key}` };

try {
  // 1) Product edits
  const res = await fetch(`${url}/rest/v1/catalog_items?select=*&order=created_at.asc`, { headers });
  if (res.status === 404) {
    console.log("[catalog] table catalog_items not found yet; keeping the existing catalog file.");
  } else {
    if (!res.ok) throw new Error(`Supabase answered HTTP ${res.status} for catalog_items`);
    const rows = await res.json();
    const extras = rows.map((r) =>
      omitNull({
        slug: r.slug,
        isNew: !!r.is_new,
        hidden: !!r.hidden,
        name: r.name,
        brand: r.brand,
        category: r.category,
        set: r.set_name,
        year: r.year,
        boxType: r.box_type,
        description: r.description,
        price: r.price_cents === null || r.price_cents === undefined ? null : r.price_cents / 100,
        stock: r.stock,
        featured: r.featured,
        image: r.image_url,
      }),
    );
    writeFileSync(OUT, JSON.stringify(extras, null, 2) + "\n");
    console.log(`[catalog] ${extras.length} seller edit(s) written to lib/catalog-extras.generated.json`);
  }

  // 2) Blog posts
  const bres = await fetch(`${url}/rest/v1/blog_posts?select=*&order=created_at.asc`, { headers });
  if (bres.status === 404) {
    console.log("[blog] table blog_posts not found yet; keeping the existing blog file.");
  } else {
    if (!bres.ok) throw new Error(`Supabase answered HTTP ${bres.status} for blog_posts`);
    const brows = await bres.json();
    const posts = brows.map((r) =>
      omitNull({
        slug: r.slug,
        title: r.title,
        description: r.description ?? "",
        date: String(r.post_date).slice(0, 10),
        body: r.body ?? "",
        image: r.image_url || null,
        shopLabel: r.shop_label || null,
        shopHref: r.shop_href || null,
        published: r.published !== false,
      }),
    );
    writeFileSync(BLOG_OUT, JSON.stringify(posts, null, 2) + "\n");
    console.log(`[blog] ${posts.length} post(s) written to lib/blog-posts.generated.json`);
  }
} catch (e) {
  console.error("[catalog] Could not read from Supabase:", e instanceof Error ? e.message : e);
  process.exit(1);
}