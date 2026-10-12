import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Frequently Asked Questions",
  description: "Answers about products, authenticity, ordering, payment, shipping, cancellations and returns at Harborline Cards.",
  alternates: { canonical: "/faq" },
};

const faqs: [string, React.ReactNode][] = [
  ["What products do you sell?", "We offer sealed sports cards and trading card products: hobby boxes, blasters, booster packs, booster boxes, Elite Trainer Boxes, collection boxes, tins, and more across baseball, basketball, football, soccer, hockey, Pokémon, Magic: The Gathering, One Piece, Yu-Gi-Oh! and Dragon Ball."],
  ["Are your products authentic?", "We aim to offer genuine trading card products sourced from reliable suppliers. Product descriptions indicate relevant details about the item, including its condition where applicable."],
  ["How can I place an order?", "Browse our shop, add the products you want to your cart, and go to checkout. Enter your shipping information and submit your order. We then send you payment instructions."],
  ["What payment methods do you accept?", <>Available payment methods are displayed during checkout. See <Link className="text-harbor underline" href="/payment-methods">payment methods</Link>.</>],
  ["How long does shipping take?", "Delivery times depend on your location, the shipping method selected, and order processing time. Any available delivery estimates are provided during checkout or in your shipping confirmation."],
  ["Can I cancel or change my order?", "Contact our customer support team as soon as possible if you need to change or cancel an order. Requests are subject to the order’s processing and shipment status."],
  ["Can I return a product?", <>Returns are subject to our <Link className="text-harbor underline" href="/refund-policy">refund policy</Link>. Please review it before placing an order.</>],
  ["How can I contact customer support?", <>Call or text us using the details on our <Link className="text-harbor underline" href="/contact">contact page</Link>.</>],
];

export default function FAQ() {
  return (
    <InfoPage title="Frequently Asked Questions">
      {faqs.map(([q, a], i) => (
        <div key={q}><h2>{i + 1}. {q}</h2><p>{a}</p></div>
      ))}
    </InfoPage>
  );
}