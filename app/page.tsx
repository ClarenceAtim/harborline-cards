import Link from "next/link";
import { products, byCategory, activeCategories } from "@/lib/products";
import ProductRow from "@/components/ProductRow";
import { siteTitle, siteDescription } from "@/lib/seo";

export const metadata = {
  title: { absolute: siteTitle },
  description: siteDescription,
  alternates: { canonical: "/" },
};

export default function Home() {
  const featured = products.filter((p) => p.featured).slice(0, 5);
  const newReleases = products.filter((p) => p.year >= 2026).slice(0, 5);
  const popularSealed = products.filter((p) => /Booster Box|Hobby Box|Hobby Case/.test(p.boxType)).slice(0, 5);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-harbor-dark via-harbor to-ink text-white">
        <div className="container-x grid gap-8 py-14 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-signal">Sealed · Sports · TCG</p>
            <h1 className="mt-3 font-display text-4xl font-bold leading-tight sm:text-5xl">Sealed sports cards, Pokémon boxes &amp; trading card games</h1>
            <p className="mt-4 max-w-md text-white/80">Shop hobby boxes, blaster boxes, booster boxes, elite trainer boxes and collection boxes across baseball, basketball, football, soccer, hockey, Pokémon, Magic: The Gathering, One Piece, Yu-Gi-Oh! and Dragon Ball.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-accent">Shop all products</Link>
              <Link href="/shop?category=pokemon" className="btn border border-white/40 text-white hover:bg-white/10">Pokémon</Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 self-center">
            {[
              ["Baseball", "baseball"], ["Basketball", "basketball"], ["Football", "football"], ["Pokémon", "pokemon"],
            ].map(([label, slug]) => (
              <Link key={slug} href={`/shop?category=${slug}`} className="rounded-lg border border-white/20 bg-white/10 p-5 text-lg font-semibold transition hover:bg-white/20">
                {label}
                <span className="mt-1 block text-xs font-normal text-white/70">{byCategory(slug as any).length} products →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Category tiles */}
      <section className="container-x py-10" aria-labelledby="cats-h">
        <h2 id="cats-h" className="font-display text-2xl font-bold sm:text-3xl">Find your kind of collecting</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {(["Sports", "Trading card games", "More"] as const).filter((g) => activeCategories().some((c) => c.group === g)).map((g) => (
            <div key={g} className="rounded-lg border border-ink/10 bg-white p-5">
              <h3 className="font-semibold text-harbor">{g}</h3>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-sm">
                {activeCategories().filter((c) => c.group === g).map((c) => (
                  <li key={c.slug}><Link href={`/shop?category=${c.slug}`} className="hover:text-harbor hover:underline">{c.label}</Link></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <ProductRow id="featured" title="Featured products" subtitle="Staff-picked sealed product" href="/shop" items={featured} />
      <ProductRow id="new" title="New releases" subtitle="2026 products" href="/shop?sort=newest" items={newReleases} />
      <ProductRow id="baseball" title="Baseball" href="/shop?category=baseball" items={byCategory("baseball").slice(0, 5)} />
      <ProductRow id="basketball" title="Basketball" href="/shop?category=basketball" items={byCategory("basketball").slice(0, 5)} />
      <ProductRow id="football" title="Football" href="/shop?category=football" items={byCategory("football").slice(0, 5)} />

      <div className="bg-harbor-light/60">
        <ProductRow id="pokemon" title="Pokémon" subtitle="Booster boxes, packs, tins and collection boxes" href="/shop?category=pokemon" items={byCategory("pokemon").slice(0, 10)} />
      </div>

      <ProductRow id="magic" title="Magic: The Gathering" href="/shop?category=magic" items={byCategory("magic")} />
      <ProductRow id="soccer" title="Soccer" href="/shop?category=soccer" items={byCategory("soccer")} />
      <ProductRow id="onepiece" title="One Piece" href="/shop?category=one-piece" items={byCategory("one-piece")} />
      <ProductRow id="dbs" title="Dragon Ball" href="/shop?category=dragon-ball" items={byCategory("dragon-ball")} />
      <ProductRow id="yugioh" title="Yu-Gi-Oh!" href="/shop?category=yu-gi-oh" items={byCategory("yu-gi-oh")} />
      <ProductRow id="sealed" title="Popular sealed products" href="/shop?sort=price-desc" items={popularSealed} />

      <section className="container-x py-10" aria-labelledby="about-h">
        <h2 id="about-h" className="font-display text-2xl font-bold sm:text-3xl">Buy sealed hobby boxes, blasters and booster boxes online</h2>
        <div className="mt-4 max-w-3xl space-y-3 text-sm leading-relaxed text-ink-soft">
          <p>
            Harborline Cards is an online store for collectors who want sealed product. Shop baseball, basketball, football, soccer and hockey
            hobby boxes, blaster boxes and cases from Topps, Bowman, Panini, Leaf and Upper Deck, plus Pokémon booster boxes, elite trainer boxes,
            tins and collection boxes, Magic: The Gathering bundles and Commander decks, and One Piece, Yu-Gi-Oh! and Dragon Ball Super booster boxes.
          </p>
          <p>
            Filter by brand, set, year, box type and price to find the right box. Popular searches:{" "}
            <Link className="text-harbor underline" href="/shop?category=pokemon&boxType=Booster%20Box">Pokémon booster boxes</Link>,{" "}
            <Link className="text-harbor underline" href="/shop?category=pokemon&boxType=Elite%20Trainer%20Box">Pokémon elite trainer boxes</Link>,{" "}
            <Link className="text-harbor underline" href="/shop?category=baseball&boxType=Hobby%20Box">baseball hobby boxes</Link>,{" "}
            <Link className="text-harbor underline" href="/shop?category=football&boxType=Hobby%20Box">football hobby boxes</Link>,{" "}
            <Link className="text-harbor underline" href="/shop?category=basketball">basketball cards</Link> and{" "}
            <Link className="text-harbor underline" href="/shop?category=soccer">soccer cards</Link>.
          </p>
          <p>Questions about an order? Call <a className="font-semibold text-harbor underline" href={"tel:9173231461"}>9173231461</a>.</p>
        </div>
      </section>
    </>
  );
}