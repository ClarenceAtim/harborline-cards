import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { enabledPaymentMethods } from "@/lib/config";

export const metadata: Metadata = {
  title: "Payment Methods",
  description: "Payment methods accepted at Harborline Cards and how payment works after you place an order.",
  alternates: { canonical: "/payment-methods" },
};

export default function Payments() {
  return (
    <InfoPage title="Payment Methods">
      <p>We aim to provide a convenient and secure checkout experience. Available payment methods are displayed at checkout:</p>
      <ul>
        {enabledPaymentMethods().map((m) => <li key={m.id}><strong>{m.label}</strong>: {m.description}</li>)}
      </ul>
      <p>After you submit your order, we send payment instructions to your email address. Payment availability may vary depending on your location.</p>
      <p>Orders will be processed after payment confirmation.</p>
      <p>If you experience a payment issue, please <Link className="text-harbor underline" href="/contact">contact us</Link> and include your order number if one has been generated.</p>
      <p>For your security, never send your full payment card number or security code by email or text.</p>
    </InfoPage>
  );
}