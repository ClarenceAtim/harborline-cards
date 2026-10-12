import Link from "next/link";
import type { Product } from "@/lib/products";
import ProductCard from "./ProductCard";

export default function ProductRow({
  title, subtitle, href, hrefLabel = "View all", items, id,
}: { title: string; subtitle?: string; href?: string; hrefLabel?: string; items: Product[]; id?: string }) {
  if (items.length === 0) return null;
  return (
    <section id={id} className="container-x py-10" aria-labelledby={`${id ?? title}-h`}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id={`${id ?? title}-h`} className="font-display text-2xl font-bold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>}
        </div>
        {href && <Link href={href} className="shrink-0 text-sm font-semibold text-harbor hover:underline">{hrefLabel} →</Link>}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {items.map((p) => <ProductCard key={p.id} product={p} />)}
      </div>
    </section>
  );
}
