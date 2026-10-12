import Link from "next/link";
import type { Product } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import ProductImage from "./ProductImage";
import AddToCart from "./AddToCart";

export default function ProductCard({ product }: { product: Product }) {
  const soldOut = product.stock <= 0 || product.availability !== "in_stock";
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-ink/10 bg-white transition hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block" aria-label={product.name}>
        <ProductImage product={product} />
      </Link>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-faint">{product.brand} · {product.year}</p>
        <h3 className="line-clamp-3 min-h-[3.6em] text-sm font-semibold leading-snug">
          <Link href={`/products/${product.slug}`} className="hover:text-harbor">{product.name}</Link>
        </h3>
        <div className="mt-auto flex items-baseline justify-between pt-2">
          <span className="text-lg font-bold">{formatPrice(product.price)}</span>
          <span className={`text-xs font-semibold ${soldOut ? "text-red-700" : "text-emerald-700"}`}>{soldOut ? "Out of stock" : "In stock"}</span>
        </div>
        <div className="pt-2"><AddToCart product={product} /></div>
      </div>
    </article>
  );
}
