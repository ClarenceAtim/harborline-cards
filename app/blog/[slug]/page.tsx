import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatPostDate, readingMinutes } from "@/lib/blog";
import { getLivePost, livePosts, liveSorted } from "@/lib/blog-live";
import { siteUrl, store } from "@/lib/config";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return livePosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getLivePost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      images: post.image ? [post.image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getLivePost(slug);
  if (!post) notFound();

  const more = liveSorted().filter((p) => p.slug !== post.slug).slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    image: post.image ? [post.image] : undefined,
    mainEntityOfPage: `${siteUrl()}/blog/${post.slug}`,
    author: { "@type": "Organization", name: store.name },
    publisher: { "@type": "Organization", name: store.name },
  };

  return (
    <article className="container-x max-w-3xl py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <nav aria-label="Breadcrumb" className="text-xs text-ink-faint">
        <Link href="/" className="hover:underline">Home</Link> / <Link href="/blog" className="hover:underline">Blog</Link>
      </nav>

      <h1 className="mt-2 font-display text-3xl font-bold leading-tight">{post.title}</h1>
      <p className="mt-2 text-xs text-ink-faint">
        {formatPostDate(post.date)} · {readingMinutes(post)} min read
      </p>

      {post.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={post.image} alt={post.title} className="mt-6 max-h-[420px] w-full rounded-lg border border-ink/10 object-cover" />
      ) : null}

      <div className="mt-6 space-y-4 text-[15px] leading-7 text-ink">
        {post.body.map((b, i) => {
          if (b.type === "h2") {
            return (
              <h2 key={i} className="pt-4 font-display text-xl font-bold">
                {b.text}
              </h2>
            );
          }
          if (b.type === "ul") {
            return (
              <ul key={i} className="list-disc space-y-2 pl-6">
                {b.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            );
          }
          return <p key={i}>{b.text}</p>;
        })}
      </div>

      <div className="mt-10 rounded-lg border border-ink/10 bg-paper p-5">
        <p className="font-semibold">Ready to look around?</p>
        <Link href={post.shopLink.href} className="btn-primary mt-3 inline-block">
          {post.shopLink.label}
        </Link>
      </div>

      {more.length > 0 && (
        <section className="mt-10" aria-label="More guides">
          <h2 className="font-display text-lg font-bold">More guides</h2>
          <ul className="mt-3 space-y-2">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`} className="text-harbor underline">
                  {p.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}