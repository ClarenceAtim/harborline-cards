"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isAdmin } from "@/lib/admin-auth";
import { slugify } from "@/lib/format";
import { posts as starterPosts } from "@/lib/blog";
import { deleteBlogRow, getBlogRow, listBlogRows, upsertBlogRow } from "@/lib/admin-blog";
import { uploadProductImage } from "@/lib/admin-catalog";
import type { BlogRow } from "@/lib/blog-live";

const editUrl = (slug: string, error: string) =>
  `/admin/blog/edit?${slug ? `slug=${encodeURIComponent(slug)}&` : ""}error=${encodeURIComponent(error)}`;

export async function savePost(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");

  const mode = String(formData.get("mode") ?? "new"); // new | existing
  const slugIn = String(formData.get("slug") ?? "");
  const fail = (m: string): never => redirect(editUrl(mode === "new" ? "" : slugIn, m));
  const text = (k: string, max: number) => String(formData.get(k) ?? "").trim().slice(0, max);

  const title = text("title", 150);
  const description = text("description", 200);
  const date = text("date", 10);
  const body = String(formData.get("body") ?? "").replace(/\r/g, "").trim().slice(0, 20000);
  const shopLabel = text("shopLabel", 60);
  const shopHref = text("shopHref", 200);
  const published = formData.get("published") === "on";

  if (title.length < 5) return fail("The title must be at least 5 characters.");
  if (description.length < 20) return fail("Write a short description of at least 20 characters. It shows in Google results.");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(date))) return fail("Choose a valid date.");
  if (body.length < 80) return fail("The article text is too short. Write at least a few sentences.");
  if (shopHref && (!shopHref.startsWith("/") || shopHref.startsWith("//"))) return fail("The button link must start with a single slash, like /shop.");

  const slug = mode === "new" ? slugify(title) : slugIn;
  if (!slug) return fail("Please use a title with letters or numbers.");

  if (mode === "new") {
    const { rows } = await listBlogRows();
    if (starterPosts.some((p) => p.slug === slug) || rows.some((r) => r.slug === slug)) {
      return fail("A post with this title already exists. Change the title a little.");
    }
  }

  // Cover photo: upload a new one if chosen, otherwise keep the current one.
  const existing = await getBlogRow(slug);
  const photo = formData.get("photo");
  let image = existing?.image;
  if (photo instanceof File && photo.size > 0) {
    const up = await uploadProductImage(`blog-${slug}`, photo);
    if (up.error) return fail(up.error);
    image = up.url;
  }

  const row: BlogRow = { slug, title, description, date, body, published };
  if (image) row.image = image;
  if (shopLabel) row.shopLabel = shopLabel;
  if (shopHref) row.shopHref = shopHref;

  const err = await upsertBlogRow(row);
  if (err) return fail(err);

  revalidatePath("/admin/blog");
  redirect("/admin/blog?saved=1");
}

// Deletes a post written in the admin, or undoes the changes made to a starter post.
export async function removePost(formData: FormData) {
  if (!(await isAdmin())) redirect("/admin");
  const slug = String(formData.get("slug") ?? "");
  if (slug) await deleteBlogRow(slug);
  revalidatePath("/admin/blog");
  redirect("/admin/blog?removed=1");
}

// Rebuilds the public site so saved posts go live (Vercel deploy hook).
export async function publishBlog() {
  if (!(await isAdmin())) redirect("/admin");
  const hook = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!hook || !hook.startsWith("https://api.vercel.com/")) redirect("/admin/blog?published=nohook");
  let ok = false;
  try {
    const r = await fetch(hook, { method: "POST", cache: "no-store" });
    ok = r.ok;
  } catch {
    ok = false;
  }
  redirect(`/admin/blog?published=${ok ? "1" : "0"}`);
}