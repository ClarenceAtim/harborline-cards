"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/format";
import { baseProducts, categories } from "@/lib/products";
import { deleteExtra, getExtra, listExtras, uploadProductImage, upsertExtra } from "@/lib/admin-catalog";
import type { Extra } from "@/lib/catalog-merge";

const editUrl = (slug: string, error: string) =>
  `/admin/products/edit?${slug ? `slug=${encodeURIComponent(slug)}&` : ""}error=${encodeURIComponent(error)}`;

export async function saveProduct(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");

  const mode = String(formData.get("mode") ?? "new"); // new | custom | static
  const slugIn = String(formData.get("slug") ?? "");
  const fail = (m: string): never => redirect(editUrl(mode === "new" ? "" : slugIn, m));
  const text = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);

  const name = text("name", 200);
  const description = text("description", 2000);
  const priceNum = Number.parseFloat(String(formData.get("price") ?? ""));
  const stockNum = Number.parseInt(String(formData.get("stock") ?? ""), 10);
  const featured = formData.get("featured") === "on";
  const hidden = formData.get("hidden") === "on";

  if (name.length < 3) return fail("The name must be at least 3 characters.");
  if (!Number.isFinite(priceNum) || priceNum <= 0 || priceNum > 1_000_000) return fail("Enter a valid price in dollars, like 49.95.");
  if (!Number.isInteger(stockNum) || stockNum < 0 || stockNum > 99_999) return fail("Stock must be a whole number, 0 or more.");
  const priceCents = Math.round(priceNum * 100);

  const slug = mode === "new" ? slugify(name) : slugIn;
  if (!slug) return fail("Please use a name with letters or numbers.");

  let x: Extra;

  if (mode === "static") {
    const base = baseProducts.find((p) => p.slug === slug);
    if (!base) return fail("Product not found.");
    x = { slug, isNew: false, hidden };
    if (name !== base.name) x.name = name;
    if (priceCents !== Math.round(base.price * 100)) x.price = priceCents / 100;
    if (stockNum !== base.stock) x.stock = stockNum;
    if (description && description !== base.description) x.description = description;
    if (featured !== base.featured) x.featured = featured;
  } else {
    const brand = text("brand", 100);
    const set = text("set", 150);
    const boxType = text("boxType", 100);
    const category = String(formData.get("category") ?? "");
    const year = Number.parseInt(String(formData.get("year") ?? ""), 10);
    if (!brand) return fail("Enter a brand, like Panini or Pokémon.");
    if (!set) return fail("Enter the set or series name.");
    if (!boxType) return fail("Enter the product type, like Hobby Box or Booster Pack.");
    if (!categories.some((c) => c.slug === category)) return fail("Choose a category.");
    if (!Number.isInteger(year) || year < 1900 || year > 2100) return fail("Enter a valid year, like 2026.");

    if (mode === "new") {
      const { extras } = await listExtras();
      if (baseProducts.some((p) => p.slug === slug) || extras.some((e) => e.slug === slug)) {
        return fail("A product with this name already exists. Change the name a little.");
      }
    }
    x = { slug, isNew: true, hidden, name, brand, category, set, year, boxType, description, price: priceCents / 100, stock: stockNum, featured };
  }

  // Photo: upload a new one if chosen, otherwise keep the current custom photo.
  const existing = await getExtra(slug);
  const photo = formData.get("photo");
  let image = existing?.image;
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadProductImage(slug, photo);
    if (up.error) return fail(up.error);
    image = up.url;
  }
  if (image) x.image = image;

  // A change-free edit of a product from code needs no stored row.
  if (mode === "static" && !x.hidden && Object.keys(x).length === 3) {
    await deleteExtra(slug);
    revalidatePath("/admin/products");
    redirect("/admin/products?saved=1");
  }

  const err = await upsertExtra(x);
  if (err) return fail(err);

  revalidatePath("/admin/products");
  redirect("/admin/products?saved=1");
}

// "Delete product" for products added in admin; "Undo my changes" for products from code.
export async function removeItem(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteExtra(slug);
  revalidatePath("/admin/products");
  redirect("/admin/products?removed=1");
}

// Rebuilds the public site so saved changes go live (Vercel deploy hook).
export async function publishSite() {
  if (!(await isAdmin())) redirect("/admin");
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook || !hook.startsWith("https://api.vercel.com/")) redirect("/admin/products?published=nohook");
  let ok = false;
  try {
    const r = await fetch(hook, { method: "POST", cache: "no-store" });
    ok = r.ok;
  } catch {
    ok = false;
  }
  redirect(`/admin/products?published=${ok ? "1" : "0"}`);
}