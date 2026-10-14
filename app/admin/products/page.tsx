import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin, adminEnabled } from "@/lib/admin-auth";
import { listExtras } from "@/lib/admin-catalog";
import { applyExtras, normalizeExtras, type Extra } from "@/lib/catalog-merge";
import { formatPrice } from "@/lib/format";
import { baseProducts, categoryLabel } from "@/lib/products";
import published from "@/lib/catalog-extras.generated.json";
import { publishSite } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Products", robots: { index: false, follow: false } };

type SP = { q?: string; saved?: string; removed?: string; published?: string };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
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

  const { extras, error } = await listExtras();
  const items = applyExtras(baseProducts, extras, { keepHidden: true });
  const byslug = new Map<string, Extra>(extras.map((e) => [e.slug, e]));
  const unpublished = !error && normalizeExtras(extras) !== normalizeExtras(published as unknown as Extra[]);

  const q = (sp.q ?? "").trim().toLowerCase();
  const shown = q ? items.filter((p) => `${p.name} ${p.brand} ${p.set}`.toLowerCase().includes(q)) : items;

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl font-bold">Products</h1>
          <Link href="/admin" className="text-sm font-semibold text-harbor underline">← Orders</Link>
        </div>
        <Link href="/admin/products/edit" className="btn btn-primary">+ Add product</Link>
      </div>

      {sp.saved && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Saved. Press “Publish to the site” to make it live.</p>}
      {sp.removed && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Done. Press “Publish to the site” to make it live.</p>}
      {sp.published === "1" && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Publishing started. Your changes go live in about 2 minutes.</p>}
      {sp.published === "0" && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">Could not start publishing. Check the deploy hook address in Vercel.</p>}
      {sp.published === "nohook" && (
        <p className="mt-5 rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Publishing is not set up yet. Add the <code>VERCEL_DEPLOY_HOOK_URL</code> variable in Vercel (see the setup steps), then redeploy.
        </p>
      )}
      {error && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

      {unpublished && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded border border-signal bg-signal/15 px-4 py-3">
          <p className="text-sm font-semibold">You have saved changes that are not on the public site yet.</p>
          <form action={publishSite}>
            <button type="submit" className="btn btn-accent">Publish to the site</button>
          </form>
        </div>
      )}

      <form method="get" className="mt-6 flex gap-2" role="search">
        <label htmlFor="q" className="sr-only">Search products</label>
        <input id="q" name="q" defaultValue={sp.q ?? ""} placeholder="Search by name, brand or set" className="field max-w-sm" />
        <button type="submit" className="btn btn-ghost">Search</button>
      </form>
      <p className="mt-3 text-xs text-ink-faint">{shown.length} product{shown.length === 1 ? "" : "s"}</p>

      <ul className="mt-3 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {shown.map((p) => {
          const ex = byslug.get(p.slug);
          const isHidden = !!ex?.hidden;
          return (
            <li key={p.slug} className="flex items-center gap-3 p-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-ink/10 bg-paper">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.image} alt="" className="h-full w-full object-contain" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.name}</p>
                <p className="text-xs text-ink-soft">
                  {formatPrice(p.price)} · {p.stock} in stock · {categoryLabel(p.category)}
                </p>
                <p className="mt-1 flex flex-wrap gap-1 text-[11px] font-semibold">
                  {ex?.isNew && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-sky-900">Added by you</span>}
                  {ex && !ex.isNew && !isHidden && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Edited</span>}
                  {isHidden && <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-800">Hidden from shop</span>}
                  {p.stock <= 0 && !isHidden && <span className="rounded bg-ink/10 px-1.5 py-0.5">Out of stock</span>}
                </p>
              </div>
              <Link href={`/admin/products/edit?slug=${encodeURIComponent(p.slug)}`} className="btn btn-ghost shrink-0">Edit</Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}