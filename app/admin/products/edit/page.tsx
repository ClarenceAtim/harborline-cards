import type { Metadata } from "next";
import Link from "next/link";
import PhotoInput from "@/components/PhotoInput";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { listExtras } from "@/lib/admin-catalog";
import { applyExtras } from "@/lib/catalog-merge";
import { baseProducts, categories } from "@/lib/products";
import { removeItem, saveProduct } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Edit product", robots: { index: false, follow: false } };

export default async function EditProductPage({ searchParams }: { searchParams: Promise<{ slug?: string; error?: string }> }) {
  const sp = await searchParams;

  if (!adminEnabled() || !(await isAdmin())) {
    return (
      <div className="container-x max-w-md py-16">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <p className="mt-3 text-sm text-ink-soft">
          Please <Link href="/admin" className="font-semibold text-harbor underline">log in</Link> first.
        </p>
      </div>
    );
  }

  const slug = sp.slug ?? "";
  const { extras } = await listExtras();
  const items = applyExtras(baseProducts, extras, { keepHidden: true });
  const product = slug ? items.find((p) => p.slug === slug) : undefined;
  const extra = extras.find((e) => e.slug === slug);

  if (slug && !product) {
    return (
      <div className="container-x max-w-xl py-16">
        <p className="text-sm">Product not found.</p>
        <Link href="/admin/products" className="mt-3 inline-block font-semibold text-harbor underline">← Back to products</Link>
      </div>
    );
  }

  const isStatic = !!product && baseProducts.some((b) => b.slug === product.slug);
  const mode = !product ? "new" : isStatic ? "static" : "custom";
  const fullFields = mode !== "static";

  return (
    <div className="container-x max-w-2xl py-10">
      <Link href="/admin/products" className="text-sm font-semibold text-harbor underline">← Back to products</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{product ? "Edit product" : "Add product"}</h1>
      {product && <p className="mt-1 text-sm text-ink-soft">{product.name}</p>}

      {sp.error && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{sp.error}</p>}

      <form action={saveProduct} className="mt-6 space-y-4">
        <input type="hidden" name="mode" value={mode} />
        <input type="hidden" name="slug" value={product?.slug ?? ""} />

        <div>
          <label htmlFor="name" className="label">Name</label>
          <input id="name" name="name" required minLength={3} maxLength={200} defaultValue={product?.name ?? ""} className="field" placeholder="2026 Topps Chrome Baseball Hobby Box" />
        </div>

        {fullFields && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="brand" className="label">Brand</label>
                <input id="brand" name="brand" required maxLength={100} defaultValue={product?.brand ?? ""} className="field" placeholder="Topps" />
              </div>
              <div>
                <label htmlFor="category" className="label">Category</label>
                <select id="category" name="category" required defaultValue={product?.category ?? ""} className="field">
                  <option value="" disabled>Choose…</option>
                  {categories.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="set" className="label">Set / series</label>
                <input id="set" name="set" required maxLength={150} defaultValue={product?.set ?? ""} className="field" placeholder="Topps Chrome" />
              </div>
              <div>
                <label htmlFor="boxType" className="label">Product type</label>
                <input id="boxType" name="boxType" required maxLength={100} defaultValue={product?.boxType ?? ""} className="field" placeholder="Hobby Box" />
              </div>
              <div>
                <label htmlFor="year" className="label">Year</label>
                <input id="year" name="year" type="number" required min={1900} max={2100} defaultValue={product?.year ?? new Date().getFullYear()} className="field" />
              </div>
            </div>
          </>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="price" className="label">Price (US dollars)</label>
            <input id="price" name="price" type="number" step="0.01" min="0.01" required defaultValue={product?.price ?? ""} className="field" placeholder="49.95" />
          </div>
          <div>
            <label htmlFor="stock" className="label">In stock (quantity)</label>
            <input id="stock" name="stock" type="number" step="1" min="0" required defaultValue={product?.stock ?? 1} className="field" />
          </div>
        </div>

        <div>
          <label htmlFor="description" className="label">Description</label>
          <textarea id="description" name="description" rows={5} maxLength={2000} defaultValue={product?.description ?? ""} className="field" placeholder="What is in the box, set details, anything buyers should know." />
        </div>

        <div>
          <span className="label">Photo</span>
          <PhotoInput current={product?.image || undefined} />
        </div>

        <div className="flex flex-wrap gap-6 text-sm">
          <label className="flex items-center gap-2">
            <input type="checkbox" name="featured" defaultChecked={product?.featured ?? false} /> Show on the home page (featured)
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" name="hidden" defaultChecked={!!extra?.hidden} /> Hide from the shop
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className="btn btn-primary">Save</button>
          <Link href="/admin/products" className="btn btn-ghost">Cancel</Link>
        </div>
        <p className="text-xs text-ink-faint">Saving does not change the public site yet. After saving, press “Publish to the site” on the products page.</p>
      </form>

      {extra && (
        <details className="mt-10 rounded border border-red-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-800">
            {extra.isNew ? "Delete this product" : "Undo my changes (go back to the original)"}
          </summary>
          <form action={removeItem} className="mt-3">
            <input type="hidden" name="slug" value={extra.slug} />
            <p className="mb-3 text-sm text-ink-soft">
              {extra.isNew ? "This removes the product you added. It stays on the live site until you publish." : "This removes your edits and restores the original price, stock and details."}
            </p>
            <button type="submit" className="btn bg-red-700 text-white hover:bg-red-800">
              {extra.isNew ? "Yes, delete it" : "Yes, undo my changes"}
            </button>
          </form>
        </details>
      )}
    </div>
  );
}