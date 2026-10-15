import type { Metadata } from "next";
import Link from "next/link";
import PhotoInput from "@/components/PhotoInput";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { listBlogRows } from "@/lib/admin-blog";
import { posts as starterPosts } from "@/lib/blog";
import { blocksToText, mergePosts } from "@/lib/blog-live";
import { removePost, savePost } from "../actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin · Edit post", robots: { index: false, follow: false } };

export default async function EditPostPage({ searchParams }: { searchParams: Promise<{ slug?: string; error?: string }> }) {
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
  const { rows } = await listBlogRows();
  const items = mergePosts(rows, { keepDrafts: true });
  const post = slug ? items.find((p) => p.slug === slug) : undefined;
  const row = rows.find((r) => r.slug === slug);

  if (slug && !post) {
    return (
      <div className="container-x max-w-xl py-16">
        <p className="text-sm">Post not found.</p>
        <Link href="/admin/blog" className="mt-3 inline-block font-semibold text-harbor underline">← Back to the blog list</Link>
      </div>
    );
  }

  const isStarter = !!post && starterPosts.some((p) => p.slug === post.slug);
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="container-x max-w-2xl py-10">
      <Link href="/admin/blog" className="text-sm font-semibold text-harbor underline">← Back to the blog list</Link>
      <h1 className="mt-3 font-display text-3xl font-bold">{post ? "Edit post" : "New post"}</h1>
      {post && <p className="mt-1 text-sm text-ink-soft">Address: /blog/{post.slug}</p>}

      {sp.error && <p className="mt-5 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{sp.error}</p>}

      <form action={savePost} className="mt-6 space-y-4">
        <input type="hidden" name="mode" value={post ? "existing" : "new"} />
        <input type="hidden" name="slug" value={post?.slug ?? ""} />

        <div>
          <label htmlFor="title" className="label">Title</label>
          <input id="title" name="title" required minLength={5} maxLength={150} defaultValue={post?.title ?? ""} className="field" placeholder="How to Spot a Resealed Booster Box" />
        </div>

        <div>
          <label htmlFor="description" className="label">Short description (shows in Google results)</label>
          <textarea id="description" name="description" required minLength={20} maxLength={200} rows={2} defaultValue={post?.description ?? ""} className="field" placeholder="One or two sentences, about 150 characters, saying what the guide covers." />
        </div>

        <div>
          <label htmlFor="date" className="label">Date</label>
          <input id="date" name="date" type="date" required defaultValue={post?.date ?? today} className="field max-w-xs" />
        </div>

        <div>
          <label htmlFor="body" className="label">Article text</label>
          <textarea id="body" name="body" required minLength={80} maxLength={20000} rows={18} defaultValue={post ? blocksToText(post.body) : ""} className="field font-mono text-[13px]" placeholder={"Write the opening paragraph here.\n\n## A heading\n\nA paragraph under the heading.\n\n- A bullet point\n- Another bullet point"} />
          <p className="mt-1 text-xs text-ink-faint">
            Leave a blank line between paragraphs. Start a line with <code>## </code> (two hash signs and a space) for a heading, and with <code>- </code> (a dash and a space) for a bullet point.
          </p>
        </div>

        <div>
          <span className="label">Cover photo (optional)</span>
          <PhotoInput current={post?.image || undefined} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="shopLabel" className="label">Button text (optional)</label>
            <input id="shopLabel" name="shopLabel" maxLength={60} defaultValue={post?.shopLink.label ?? ""} className="field" placeholder="Browse sealed boxes" />
          </div>
          <div>
            <label htmlFor="shopHref" className="label">Button link (optional)</label>
            <input id="shopHref" name="shopHref" maxLength={200} defaultValue={post?.shopLink.href ?? ""} className="field" placeholder="/shop" />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="published" defaultChecked={post ? !post.draft : true} /> Show this post on the site (untick to keep it as a draft)
        </label>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button type="submit" className="btn btn-primary">Save</button>
          <Link href="/admin/blog" className="btn btn-ghost">Cancel</Link>
        </div>
        <p className="text-xs text-ink-faint">
          Saving does not change the public site yet. After saving, press “Publish to the site” on the blog list. If an error appears after you press Save, your text may be cleared, so keep a copy of long articles until you see “Saved”.
        </p>
      </form>

      {row && (
        <details className="mt-10 rounded border border-red-200 p-4">
          <summary className="cursor-pointer text-sm font-semibold text-red-800">
            {isStarter ? "Undo my changes (go back to the original)" : "Delete this post"}
          </summary>
          <form action={removePost} className="mt-3">
            <input type="hidden" name="slug" value={row.slug} />
            <p className="mb-3 text-sm text-ink-soft">
              {isStarter ? "This removes your edits and restores the original article." : "This deletes the post. It stays on the live site until you publish."}
            </p>
            <button type="submit" className="btn bg-red-700 text-white hover:bg-red-800">
              {isStarter ? "Yes, undo my changes" : "Yes, delete it"}
            </button>
          </form>
        </details>
      )}
    </div>
  );
}