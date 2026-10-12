"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products, type Product } from "@/lib/products";

type Line = { slug: string; qty: number };
type CartCtx = {
  lines: { product: Product; qty: number }[];
  count: number;
  subtotal: number; // dollars, display only. The server recomputes totals.
  ready: boolean;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "harborline_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [raw, setRaw] = useState<Line[]>([]);
  const [ready, setReady] = useState(false); // false on server + first client render => no hydration mismatch

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(saved)) setRaw(saved.filter((l) => l && typeof l.slug === "string" && Number.isInteger(l.qty) && l.qty > 0));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(raw)); } catch {}
  }, [raw, ready]);

  // Sync across tabs.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) {
        try { setRaw(JSON.parse(e.newValue || "[]")); } catch {}
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const maxFor = (slug: string) => products.find((p) => p.slug === slug)?.stock ?? 0;

  const add = useCallback((slug: string, qty = 1) => {
    setRaw((cur) => {
      const max = maxFor(slug);
      if (max <= 0) return cur;
      const found = cur.find((l) => l.slug === slug);
      if (found) return cur.map((l) => (l.slug === slug ? { ...l, qty: Math.min(max, l.qty + qty) } : l));
      return [...cur, { slug, qty: Math.min(max, qty) }];
    });
  }, []);
  const setQty = useCallback((slug: string, qty: number) => {
    setRaw((cur) => cur.map((l) => (l.slug === slug ? { ...l, qty: Math.max(1, Math.min(maxFor(slug) || 1, qty)) } : l)));
  }, []);
  const remove = useCallback((slug: string) => setRaw((cur) => cur.filter((l) => l.slug !== slug)), []);
  const clear = useCallback(() => setRaw([]), []);

  const value = useMemo<CartCtx>(() => {
    const lines = raw
      .map((l) => ({ product: products.find((p) => p.slug === l.slug)!, qty: l.qty }))
      .filter((l) => l.product && l.product.stock > 0);
    return {
      lines,
      count: lines.reduce((s, l) => s + l.qty, 0),
      subtotal: lines.reduce((s, l) => s + Math.round(l.product.price * 100) * l.qty, 0) / 100,
      ready, add, setQty, remove, clear,
    };
  }, [raw, ready, add, setQty, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
