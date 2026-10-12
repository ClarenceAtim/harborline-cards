"use client";

import { useState } from "react";
import type { Product } from "@/lib/products";

const tint: Record<string, string> = {
  baseball: "from-sky-700 to-sky-950", basketball: "from-orange-600 to-orange-900", football: "from-emerald-700 to-emerald-950",
  soccer: "from-lime-600 to-green-900", hockey: "from-cyan-700 to-slate-900", "other-sports": "from-indigo-700 to-indigo-950",
  pokemon: "from-yellow-500 to-red-700", magic: "from-purple-700 to-slate-900", "one-piece": "from-red-700 to-rose-950",
  "yu-gi-oh": "from-violet-700 to-fuchsia-950", "dragon-ball": "from-amber-500 to-orange-800", "other-tcg": "from-teal-700 to-teal-950",
};

export default function ProductImage({ product, src, className = "" }: { product: Product; src?: string; className?: string }) {
  const candidates = src
    ? [src]
    : [
        product.image,
        `/products/${product.slug}.jpg`,
        `/products/${product.slug}.png`,
        `/products/${product.slug}.webp`,
        `/api/img/${product.slug}`,
      ].filter(Boolean);
  const [i, setI] = useState(0);
  const url = candidates[i];

  if (url) {
    return (
      <div className={`relative aspect-square w-full overflow-hidden bg-white ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img key={url} src={url} alt={product.name} loading="lazy" onError={() => setI((n) => n + 1)} className="h-full w-full object-contain p-3" />
      </div>
    );
  }

  return (
    <div role="img" aria-label={`${product.name} (product photo not added yet)`}
      className={`relative flex aspect-square w-full items-center justify-center overflow-hidden bg-paper p-5 ${className}`}>
      <div className={`flex h-full w-[78%] max-w-[210px] flex-col justify-between rounded-lg bg-gradient-to-br ${tint[product.category] ?? "from-slate-700 to-slate-900"} p-3 text-white shadow-lg ring-1 ring-black/20`}>
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{product.brand}</span>
        <span className="line-clamp-4 text-center font-display text-sm font-bold leading-tight sm:text-base">{product.set}</span>
        <div className="text-center">
          <span className="inline-block rounded bg-white/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-ink">{product.boxType}</span>
          <span className="mt-1 block text-[10px] text-white/80">{product.year}</span>
        </div>
      </div>
      <span className="absolute bottom-1 right-2 text-[9px] text-ink-faint">photo not added</span>
    </div>
  );
}