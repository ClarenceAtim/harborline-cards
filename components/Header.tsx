"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartProvider";
import { activeCategories } from "@/lib/products";
import { store } from "@/lib/config";

const groups = ["Sports", "Trading card games", "More"] as const;
const cats = activeCategories();

export default function Header() {
  const { count, ready } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-white/95 backdrop-blur">
      <div className="bg-ink px-4 py-1.5 text-center text-xs text-white">{store.announcement}</div>
      <div className="container-x flex items-center gap-3 py-3">
        <button className="rounded p-2 lg:hidden" aria-label="Toggle menu" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
          <span aria-hidden className="block text-xl leading-none">{open ? "✕" : "☰"}</span>
        </button>
        <Link href="/" className="font-display text-xl font-bold tracking-tight text-harbor sm:text-2xl">
          Harborline<span className="text-signal"> Cards</span>
        </Link>

        <form action="/shop" method="get" role="search" className="mx-2 hidden flex-1 md:block">
          <label htmlFor="site-search" className="sr-only">Search products</label>
          <input id="site-search" name="q" type="search" placeholder="Search boxes, packs, sets, brands…" className="field" />
        </form>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-5 text-sm font-semibold lg:flex">
          <Link href="/shop" className="hover:text-harbor">Shop all</Link>
          <Link href="/shop?category=pokemon" className="hover:text-harbor">Pokémon</Link>
          <Link href="/releases" className="hover:text-harbor">Release calendar</Link>
        </nav>

        <Link href="/cart" className="relative ml-auto rounded-md border border-ink/20 px-3 py-2 text-sm font-semibold hover:border-ink/50 lg:ml-0" aria-label={`Cart, ${ready ? count : 0} items`}>
          Cart
          <span className="ml-2 inline-flex min-w-[1.4rem] justify-center rounded-full bg-signal px-1.5 text-xs font-bold text-ink" suppressHydrationWarning>
            {ready ? count : 0}
          </span>
        </Link>
      </div>

      {/* Desktop category bar */}
      <nav aria-label="Categories" className="hidden border-t border-ink/10 lg:block">
        <ul className="container-x flex gap-5 overflow-x-auto py-2 text-sm text-ink-soft">
          {cats.map((c) => (
            <li key={c.slug} className="shrink-0">
              <Link href={`/shop?category=${c.slug}`} className="hover:text-harbor">{c.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-nav" className="max-h-[75vh] overflow-y-auto border-t border-ink/10 bg-white lg:hidden">
          <form action="/shop" method="get" role="search" className="container-x py-3">
            <label htmlFor="m-search" className="sr-only">Search products</label>
            <input id="m-search" name="q" type="search" placeholder="Search products…" className="field" />
          </form>
          <div className="container-x pb-4">
            <Link href="/shop" onClick={() => setOpen(false)} className="block py-2 font-semibold">Shop all</Link>
            <Link href="/releases" onClick={() => setOpen(false)} className="block py-2 font-semibold">Release calendar</Link>
            {groups.filter((g) => cats.some((c) => c.group === g)).map((g) => (
              <div key={g} className="mt-3">
                <p className="text-xs font-bold uppercase tracking-wide text-ink-faint">{g}</p>
                {cats.filter((c) => c.group === g).map((c) => (
                  <Link key={c.slug} href={`/shop?category=${c.slug}`} onClick={() => setOpen(false)} className="block py-1.5 text-sm">{c.label}</Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
