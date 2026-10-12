import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "About Harborline Cards",
  description: "Harborline Cards is an online store for sealed sports cards, Pokémon cards and trading card game products.",
  alternates: { canonical: "/about" },
};

const a = "text-harbor underline";

export default function About() {
  return (
    <InfoPage title="About Us">
      <p>Welcome to Harborline Cards, your online destination for sealed sports cards, Pokémon trading cards, and collectible trading card products.</p>
      <p>We aim to make discovering and collecting trading cards straightforward by offering a range of products for collectors, players, and fans.</p>
      <p>
        From hobby boxes, blasters and booster packs to booster boxes, Elite Trainer Boxes, tins, and collection boxes, our goal is to help customers discover products that match their interests, across{" "}
        <Link className={a} href="/shop?category=baseball">baseball</Link>, <Link className={a} href="/shop?category=basketball">basketball</Link>, <Link className={a} href="/shop?category=football">football</Link>, <Link className={a} href="/shop?category=soccer">soccer</Link>, <Link className={a} href="/shop?category=hockey">hockey</Link>, <Link className={a} href="/shop?category=pokemon">Pokémon</Link>, <Link className={a} href="/shop?category=magic">Magic: The Gathering</Link>, <Link className={a} href="/shop?category=one-piece">One Piece</Link>, <Link className={a} href="/shop?category=yu-gi-oh">Yu-Gi-Oh!</Link> and <Link className={a} href="/shop?category=dragon-ball">Dragon Ball</Link>.
      </p>
      <p>We believe in clear product information, a convenient shopping experience, and responsive customer support.</p>
      <p>Whether you are expanding your collection, searching for a particular box, or exploring a new release, we’re glad you’re here. Thank you for choosing Harborline Cards. Questions? <Link className={a} href="/contact">Call or text us</Link>.</p>
    </InfoPage>
  );
}