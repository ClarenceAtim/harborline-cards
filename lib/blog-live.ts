// Blog posts = the starter posts in lib/blog.ts + posts written in the admin page
// (stored in Supabase, pulled into blog-posts.generated.json at build time).
// A post written in the admin with the same slug as a starter post replaces it.
// Pure functions: safe to import anywhere.

import { posts as staticPosts, type Block, type Post } from "./blog";
import generated from "./blog-posts.generated.json";

export type LivePost = Post & { image?: string; draft?: boolean };

export type BlogRow = {
  slug: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  body: string; // simple text: "## Heading", "- bullet", blank line between paragraphs
  image?: string;
  shopLabel?: string;
  shopHref?: string;
  published: boolean;
};

export function textToBlocks(text: string): Block[] {
  const blocks: Block[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flushPara = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
  };
  const flushList = () => {
    if (list.length) blocks.push({ type: "ul", items: list });
    list = [];
  };
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) {
      flushPara();
      flushList();
      continue;
    }
    if (line.startsWith("## ")) {
      flushPara();
      flushList();
      const t = line.slice(3).trim();
      if (t) blocks.push({ type: "h2", text: t });
      continue;
    }
    if (line.startsWith("- ")) {
      flushPara();
      const t = line.slice(2).trim();
      if (t) list.push(t);
      continue;
    }
    flushList();
    para.push(line);
  }
  flushPara();
  flushList();
  return blocks;
}

export const blocksToText = (blocks: Block[]) =>
  blocks
    .map((b) => (b.type === "h2" ? `## ${b.text}` : b.type === "ul" ? b.items.map((i) => `- ${i}`).join("\n") : b.text))
    .join("\n\n");

const rowToPost = (r: BlogRow): LivePost => ({
  slug: r.slug,
  title: r.title,
  description: r.description,
  date: r.date,
  shopLink: { label: r.shopLabel || "Browse sealed boxes", href: r.shopHref || "/shop" },
  body: textToBlocks(r.body),
  image: r.image,
  draft: !r.published,
});

export function mergePosts(rows: BlogRow[], opts: { keepDrafts?: boolean } = {}): LivePost[] {
  const out: LivePost[] = staticPosts.map((p) => ({ ...p }));
  for (const r of rows) {
    if (!r || !r.slug) continue;
    const i = out.findIndex((p) => p.slug === r.slug);
    if (!r.published && !opts.keepDrafts) {
      if (i !== -1) out.splice(i, 1);
      continue;
    }
    const p = rowToPost(r);
    if (i === -1) out.push(p);
    else out[i] = p;
  }
  return out;
}

// Stable string used to tell whether saved posts differ from what is published on the site.
export const normalizeRows = (rows: BlogRow[]) =>
  JSON.stringify(
    [...rows]
      .sort((a, b) => a.slug.localeCompare(b.slug))
      .map((r) => [r.slug, r.title, r.description, r.date, r.body, r.image ?? "", r.shopLabel ?? "", r.shopHref ?? "", r.published]),
  );

export const livePosts: LivePost[] = mergePosts(generated as unknown as BlogRow[]);
export const liveSorted = () => [...livePosts].sort((a, b) => b.date.localeCompare(a.date));
export const getLivePost = (slug: string) => livePosts.find((p) => p.slug === slug);