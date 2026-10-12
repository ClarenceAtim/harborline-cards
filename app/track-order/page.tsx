import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Track Your Order",
  description: "How to track your Harborline Cards order once it has been dispatched.",
  alternates: { canonical: "/track-order" },
};

export default function Track() {
  return (
    <InfoPage title="Track Your Order">
      <p>Want to know where your order is? Once your order has been dispatched, tracking information will be provided when available.</p>
      <h2>How to track your order</h2>
      <ul>
        <li>Locate your order confirmation or shipping confirmation email.</li>
        <li>Find the tracking number, if one has been provided.</li>
        <li>Use the carrier’s tracking service to check your shipment status.</li>
      </ul>
      <p>If you have not received tracking information or need assistance with a delayed shipment, please contact our customer support team. Please have your order number ready when contacting us.</p>
      <h2>Need help?</h2>
      <p><Link className="text-harbor underline" href="/contact">Call or text us</Link>.</p>
    </InfoPage>
  );
}