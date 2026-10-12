#!/usr/bin/env node
// Run on your computer (needs internet):   node scripts/fetch-images.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ORIGIN = "https://www.midwestcards.com";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const STOP = new Set(["and", "the", "of", "tcg", "box", "pack"]);

// Exact retailer pages found by search (their addresses differ from ours). Tried first.
const OVERRIDES = {
  "pokemon-scarlet-and-violet-prismatic-evolutions-poster-collection-6-box-case": "https://www.midwestcards.com/shop/pokemon-non-sports-cards/pokemon-scarlet-violet-prismatic-evolutions-poster-collection-6-box-case/",
  "pokemon-scarlet-and-violet-prismatic-evolutions-poster-collection-box": "https://www.midwestcards.com/shop/pokemon-non-sports-cards/pokemon-scarlet-violet-prismatic-evolutions-poster-collection-box/",
  "pokemon-scarlet-and-violet-prismatic-evolutions-super-premium-collection-box": "https://www.midwestcards.com/pokemon-non-sports-cards/pokemon-scarlet-violet-prismatic-evolutions-super-premium-collection-box/",
  "pokemon-mega-evolution-pitch-black-build-and-battle-box": "https://www.midwestcards.com/pokemon-non-sports-cards/pokemon-mega-evolution-pitch-black-build-battle-box/",
  "pokemon-mega-evolution-moonlit-tin-6-box-case": "https://www.midwestcards.com/pokemon-non-sports-cards/pokemon-mega-moonlit-tin-6-box-case/",
  "pokemon-scarlet-and-violet-151-ultra-premium-collection-box": "https://www.midwestcards.com/shop/pokemon-scarlet-violet-151-ultra-premium-collection-box/",
  "pokemon-scarlet-and-violet-paradox-rift-booster-pack": "https://www.midwestcards.com/shop/pokemon-scarlet-violet-paradox-rift-booster-pack/",
  "pokemon-sword-and-shield-astral-radiance-booster-pack": "https://www.midwestcards.com/non-sports-cards/pokemon-sword-shield-astral-radiance-booster-pack/",
  "pokemon-sword-and-shield-fusion-strike-booster-pack": "https://www.midwestcards.com/pokemon-sword-shield-fusion-strike-booster-pack/",
  "pokemon-mega-evolution-ascended-heroes-booster-bundle-box": "https://www.midwestcards.com/products/pokemon-mega-evolution-ascended-heroes-booster-bundle-box",
};

export const tokens = (s) =>
  s
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[’']/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t && !STOP.has(t));

// Strict: every word of our product name must be in the page address (max 1 extra word).
export function bestMatch(name, candidates) {
  const a = new Set(tokens(name));
  let best = null;
  for (const c of candidates) {
    const b = new Set(tokens(c.slug));
    if (![...a].every((t) => b.has(t))) continue;
    const extra = b.size - a.size;
    if (extra > 1) continue;
    if (!best || extra < best.extra) best = { ...c, extra, score: a.size / b.size };
  }
  return best;
}

async function get(url, accept = "*/*") {
  const r = await fetch(url, { headers: { "User-Agent": UA, Accept: accept }, redirect: "follow" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r;
}

async function loadSitemapUrls() {
  const queue = [];
  try {
    const robots = await (await get(`${ORIGIN}/robots.txt`)).text();
    for (const m of robots.matchAll(/^\s*sitemap:\s*(\S+)/gim)) queue.push(m[1]);
  } catch {}
  queue.push(`${ORIGIN}/sitemap.xml`);
  const seen = new Set();
  const pages = [];
  while (queue.length && seen.size < 60) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    try {
      const xml = await (await get(sm)).text();
      for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)) {
        const loc = m[1].replace(/&amp;/g, "&");
        if (/\.xml(\?|$)/i.test(loc) || /sitemap/i.test(loc)) queue.push(loc);
        else {
          const slug = new URL(loc).pathname.split("/").filter(Boolean).pop();
          if (slug) pages.push({ url: loc, slug });
        }
      }
    } catch {}
  }
  return pages;
}

function photoFromHtml(html, base) {
  const og =
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i) ||
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (og) return new URL(og[1].replace(/&amp;/g, "&"), base).href;
  const next = html.match(/\/_next\/image\?url=[^"'\s,)]+/i);
  if (next) return new URL(next[0].replace(/&amp;/g, "&"), base).href;
  const ld = html.match(/"image"\s*:\s*\[?\s*"([^"]+)"/i);
  if (ld) return new URL(ld[1], base).href;
  return null;
}

const extFor = (ct) => ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" })[ct.split(";")[0].trim()];

async function download(source) {
  let r = await get(source, "image/*,text/html;q=0.8,*/*;q=0.5");
  let ct = r.headers.get("content-type") || "";
  if (ct.startsWith("text/html")) {
    const img = photoFromHtml(await r.text(), source);
    if (!img) throw new Error("no photo found on page");
    r = await get(img, "image/*");
    ct = r.headers.get("content-type") || "";
  }
  const ext = extFor(ct);
  if (!ext) throw new Error(`not a jpg/png/webp image (${ct || "unknown"})`);
  const buf = Buffer.from(await r.arrayBuffer());
  if (buf.length < 2000) throw new Error("image too small");
  return { buf, ext };
}

async function main() {
  const root = new URL("../", import.meta.url);
  const list = JSON.parse(await readFile(new URL("scripts/image-sources.json", root), "utf8"));
  const outDir = new URL("public/products/", root);
  const mapFile = new URL("lib/images.generated.json", root);
  await mkdir(outDir, { recursive: true });

  console.log("Reading the retailer sitemap...");
  const candidates = await loadSitemapUrls();
  console.log(candidates.length ? `Found ${candidates.length} page addresses.` : "Sitemap not reachable; using sources from image-sources.json only.");

  const map = existsSync(mapFile) ? JSON.parse(await readFile(mapFile, "utf8")) : {};
  const failed = [];
  let ok = 0;

  for (const p of list) {
    const tries = [];
    if (OVERRIDES[p.slug]) tries.push(OVERRIDES[p.slug]);
    const m = candidates.length ? bestMatch(p.name, candidates) : null;
    if (m && !tries.includes(m.url)) tries.push(m.url);
    if (p.source && !tries.includes(p.source)) tries.push(p.source);

    let done = false;
    const reasons = [];
    for (const t of tries) {
      try {
        const { buf, ext } = await download(t);
        await writeFile(new URL(`${p.slug}.${ext}`, outDir), buf);
        map[p.slug] = `/products/${p.slug}.${ext}`;
        console.log(`OK    ${p.slug}${m && t === m.url ? `   <- ${m.slug}` : ""}`);
        ok++;
        done = true;
        break;
      } catch (e) {
        reasons.push(`${t} (${e.message})`);
      }
    }
    if (!done) {
      console.log(`FAIL  ${p.slug}`);
      failed.push(`${p.name}\n    slug: ${p.slug}\n    tried: ${reasons.join(" | ") || "nothing to try"}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  await writeFile(mapFile, JSON.stringify(map, null, 2) + "\n");
  console.log(`\nDownloaded ${ok}/${list.length}. Wrote lib/images.generated.json`);
  if (failed.length) {
    console.log(`\n${failed.length} product(s) have no photo yet. For each, save a photo as public/products/<slug>.jpg\n(or paste a product-page / image address into its "source" in scripts/image-sources.json and re-run):\n`);
    console.log(failed.map((f) => "- " + f).join("\n"));
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();