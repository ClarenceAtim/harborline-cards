import type { Metadata } from "next";
import Link from "next/link";
import { formatPostDate, readingMinutes } from "@/lib/blog";
import { liveSorted } from "@/lib/blog-live";

export const metadata: Metadata = {
  title: "Collecting guides and tips",
  description: "Simple guides for collectors: sealed boxes, storage, buying tips and more from Harborline Cards.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const list = liveSorted();
  return (
    <div className="container-x max-w-3xl py-10">
      <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
        <Link href="/" className="hover:underline">Home</Link> / <span>Blog</span>
      </nav>
      <h1 className="mt-2 font-display text-3xl font-bold">Collecting guides and tips</h1>
      <p className="mt-2 text-sm text-ink-soft">Short, practical guides for people who collect and open sealed cards.</p>

      <ul className="mt-8 space-y-4">
        {list.map((p) => (
          <li key={p.slug} className="flex gap-4 rounded-lg border border-ink/10 bg-white p-5 shadow-sm">
            {p.image ? (
              <Link href={`/blog/${p.slug}`} className="hidden h-24 w-24 shrink-0 overflow-hidden rounded border border-ink/10 sm:block" aria-hidden="true" tabIndex={-1}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt="" className="h-full w-full object-cover" />
              </Link>
            ) : null}
            <div className="min-w-0">
              <p className="text-xs text-ink-faint">
                {formatPostDate(p.date)} · {readingMinutes(p)} min read
              </p>
              <h2 className="mt-1 font-display text-xl font-bold">
                <Link href={`/blog/${p.slug}`} className="hover:text-harbor">{p.title}</Link>
              </h2>
              <p className="mt-2 text-sm text-ink-soft">{p.description}</p>
              <Link href={`/blog/${p.slug}`} className="mt-3 inline-block text-sm font-semibold text-harbor underline">
                Read the guide
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}