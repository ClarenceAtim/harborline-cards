"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import ProductImage from "@/components/ProductImage";
import { formatPrice } from "@/lib/format";

export default function CartPage() {
  const { lines, subtotal, ready, setQty, remove } = useCart();

  if (!ready) return <div className="container-x py-16 text-center text-ink-soft">Loading your cart…</div>;

  if (lines.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-ink-soft">Discover our collection of sports cards, Pokémon cards, booster packs, booster boxes, Elite Trainer Boxes and other trading card products.</p>
        <Link href="/shop" className="btn-primary mt-6">Continue shopping</Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="font-display text-3xl font-bold">Your cart</h1>
      <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
        <ul className="divide-y divide-ink/10 rounded-lg border border-ink/10 bg-white">
          {lines.map(({ product: p, qty }) => (
            <li key={p.slug} className="flex gap-4 p-4">
              <div className="w-24 shrink-0 overflow-hidden rounded border border-ink/10"><ProductImage product={p} /></div>
              <div className="flex flex-1 flex-col gap-2">
                <Link href={`/products/${p.slug}`} className="text-sm font-semibold hover:text-harbor">{p.name}</Link>
                <p className="text-sm text-ink-soft">{formatPrice(p.price)} each</p>
                <div className="mt-auto flex flex-wrap items-center gap-3">
                  <div className="flex items-center rounded-md border border-ink/20">
                    <button aria-label={`Decrease quantity of ${p.name}`} className="px-3 py-1.5" onClick={() => setQty(p.slug, qty - 1)} disabled={qty <= 1}>−</button>
                    <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
                    <button aria-label={`Increase quantity of ${p.name}`} className="px-3 py-1.5" onClick={() => setQty(p.slug, qty + 1)} disabled={qty >= p.stock}>+</button>
                  </div>
                  <button className="text-sm font-semibold text-red-700 hover:underline" onClick={() => remove(p.slug)}>Remove</button>
                </div>
              </div>
              <p className="text-sm font-bold">{formatPrice(p.price * qty)}</p>
            </li>
          ))}
        </ul>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5" aria-label="Order summary">
          <h2 className="font-semibold">Order summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between text-ink-soft"><dt>Shipping</dt><dd>Confirmed by seller</dd></div>
            <div className="flex justify-between border-t border-ink/10 pt-2 text-base font-bold"><dt>Total</dt><dd>{formatPrice(subtotal)}</dd></div>
          </dl>
          <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to checkout</Link>
          <Link href="/shop" className="btn-ghost mt-2 w-full">Continue shopping</Link>
          <p className="mt-3 text-xs text-ink-faint">Final prices and availability are re-checked on our server when you submit your order.</p>
        </aside>
      </div>
    </div>
  );
}
