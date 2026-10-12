"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/products";

export default function AddToCart({ product, withQuantity = false }: { product: Product; withQuantity?: boolean }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0 || product.availability !== "in_stock";

  if (soldOut) {
    return <button className="btn-ghost w-full" disabled>Out of stock</button>;
  }

  const onAdd = () => {
    add(product.slug, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {withQuantity && (
          <div className="flex items-center rounded-md border border-ink/20 bg-white">
            <button type="button" aria-label="Decrease quantity" className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
            <input
              aria-label="Quantity" inputMode="numeric" className="w-12 border-x border-ink/10 py-2 text-center text-sm"
              value={qty}
              onChange={(e) => { const n = parseInt(e.target.value, 10); setQty(Number.isNaN(n) ? 1 : Math.max(1, Math.min(product.stock, n))); }}
            />
            <button type="button" aria-label="Increase quantity" className="px-3 py-2 text-lg" onClick={() => setQty((q) => Math.min(product.stock, q + 1))}>+</button>
          </div>
        )}
        <button type="button" onClick={onAdd} className="btn-primary flex-1">
          {added ? "Added ✓" : "Add to cart"}
        </button>
      </div>
      {added && (
        <p role="status" className="text-xs text-harbor">
          Added to your cart. <Link href="/cart" className="font-semibold underline">View cart</Link>
        </p>
      )}
    </div>
  );
}
