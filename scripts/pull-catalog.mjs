// Runs automatically before every build ("prebuild" in package.json).
// Pulls the seller's product edits from Supabase and writes lib/catalog-extras.generated.json,
// which lib/products.ts merges onto the catalog in code.
//
// - Supabase not configured, or table not created yet: keeps the existing file and continues.
// - Supabase configured but unreachable: FAILS the build, so the live site keeps its last good version
//   instead of silently losing products. Set SKIP_CATALOG_PULL=1 to bypass.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

const OUT = resolve("lib/catalog-extras.generated.json");

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

try {
  const res = await fetch(`${url}/rest/v1/catalog_items?select=*&order=created_at.asc`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (res.status === 404) {
    console.log("[catalog] table catalog_items not found yet; keeping the existing catalog file.");
    process.exit(0);
  }
  if (!res.ok) throw new Error(`Supabase answered HTTP ${res.status}`);

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
} catch (e) {
  console.error("[catalog] Could not read the catalog from Supabase:", e instanceof Error ? e.message : e);
  process.exit(1);
}