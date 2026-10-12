import Link from "next/link";
import { store } from "@/lib/config";
import ContactNumber from "./ContactNumber";

export default function Footer() {
  return (
    <footer className="mt-16 bg-ink text-white">
      <div className="container-x grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="font-display text-xl font-bold">Harborline<span className="text-signal"> Cards</span></p>
          <p className="mt-2 text-sm text-white/70">{store.tagline}</p>
          <p className="mt-4 text-sm">
            <span className="text-white/60">Call or text: </span>
            <ContactNumber dark up />
          </p>
        </div>
        <FooterCol title="Shop" links={[
          ["All products", "/shop"], ["Baseball cards", "/shop?category=baseball"], ["Basketball cards", "/shop?category=basketball"],
          ["Football cards", "/shop?category=football"], ["Soccer cards", "/shop?category=soccer"], ["Hockey cards", "/shop?category=hockey"],
          ["Pokémon cards", "/shop?category=pokemon"], ["Magic: The Gathering", "/shop?category=magic"], ["One Piece", "/shop?category=one-piece"],
          ["Yu-Gi-Oh!", "/shop?category=yu-gi-oh"], ["Dragon Ball", "/shop?category=dragon-ball"],
        ]} />
        <FooterCol title="Company" links={[["About", "/about"], ["Contact", "/contact"]]} />
        <FooterCol title="Help" links={[
          ["FAQ", "/faq"], ["Shipping & returns", "/shipping-returns"], ["Refund policy", "/refund-policy"], ["Payment methods", "/payment-methods"],
          ["Track your order", "/track-order"], ["Cart", "/cart"], ["Privacy policy", "/privacy"], ["Terms & conditions", "/terms"],
        ]} />
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {store.name}. Product names and trademarks belong to their respective owners.
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-white/80">{title}</p>
      <ul className="mt-3 space-y-2 text-sm">
        {links.map(([l, h]) => (
          <li key={h}><Link href={h} className="text-white/70 hover:text-white">{l}</Link></li>
        ))}
      </ul>
    </div>
  );
}