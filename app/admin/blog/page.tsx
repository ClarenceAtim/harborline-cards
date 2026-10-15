import type { Metadata } from "next";
import Link from "next/link";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { listBlogRows } from "@/lib/admin-blog";
import { posts as starterPosts, formatPostDate } from "@/lib/blog";
import { mergePosts, normalizeRows, type BlogRow } from "@/lib/blog-live";
import published from "@/lib/blog-posts.generated.json";
import { publishBlog } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Blog", robots: { index: false, follow: false } };

type SP = { saved?: string; removed?: string; published?: string };

export default async function AdminBlogPage({ searchParams }: { searchParams: Promise<SP> }) {
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

  const { rows, error } = await listBlogRows();
  const items = mergePosts(rows, { keepDrafts: true }).sort((a, b) => b.date.localeCompare(a.date));
  const saved = new Set(rows.map((r) => r.slug));
  const starters = new Set(starterPosts.map((p) => p.slug));
  const unpublished = !error && normalizeRows(rows) !== normalizeRows(published as unknown as BlogRow[]);

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <h1 className="font-display text-3xl font-bold">Blog</h1>
          <Link href="/admin" className="text-sm font-semibold text-harbor underline">← Orders</Link>
          <Link href="/admin/products" className="text-sm font-semibold text-harbor underline">Products →</Link>
        </div>
        <Link href="/admin/blog/edit" className="btn btn-primary">+ New post</Link>
      </div>

      {sp.saved && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Saved. Press “Publish to the site” to make it live.</p>}
      {sp.removed && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Done. Press “Publish to the site” to make it live.</p>}
      {sp.published === "1" && <p className="mt-5 rounded bg-emerald-50 px-3 py-2 text-sm text-emerald-900">Publishing started. Your changes go live in about 2 minutes.</p>}
      {sp.published === "0" && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">Could not start publishing. Check the deploy hook address in Vercel.</p>}
      {sp.published === "nohook" && (
        <p className="mt-5 rounded bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Publishing is not set up yet. Add the <code>VERCEL_DEPLOY_HOOK_URL</code> variable in Vercel, then redeploy.
        </p>
      )}
      {error && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

      {unpublished && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded border border-signal bg-signal/15 px-4 py-3">
          <p className="text-sm font-semibold">You have saved changes that are not on the public site yet.</p>
          <form action={publishBlog}>
            <button type="submit" className="btn btn-accent">Publish to the site</button>
          </form>
        </div>
      )}

      <p className="mt-6 text-xs text-ink-faint">{items.length} post{items.length === 1 ? "" : "s"}</p>

      <ul className="mt-3 divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
        {items.map((p) => (
          <li key={p.slug} className="flex items-center gap-3 p-3">
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded border border-ink/10 bg-paper">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{p.title}</p>
              <p className="text-xs text-ink-soft">{formatPostDate(p.date)} · /blog/{p.slug}</p>
              <p className="mt-1 flex flex-wrap gap-1 text-[11px] font-semibold">
                {saved.has(p.slug) && !starters.has(p.slug) && <span className="rounded bg-sky-100 px-1.5 py-0.5 text-sky-900">Written by you</span>}
                {saved.has(p.slug) && starters.has(p.slug) && <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Edited</span>}
                {p.draft && <span className="rounded bg-red-100 px-1.5 py-0.5 text-red-800">Draft (hidden)</span>}
              </p>
            </div>
            <Link href={`/admin/blog/edit?slug=${encodeURIComponent(p.slug)}`} className="btn btn-ghost shrink-0">Edit</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}