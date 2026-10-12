import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Refund Policy",
  description: "Returns, damaged or incorrect orders, refunds and cancellations at Harborline Cards.",
  alternates: { canonical: "/refund-policy" },
};

export default function Refund() {
  return (
    <InfoPage title="Refund Policy">
      <h2>Returns</h2>
      <p>If you wish to return a product, please contact our customer support team before sending it back. We will explain the applicable return procedure and eligibility requirements.</p>
      <h2>Product condition</h2>
      <p>Trading cards and sealed collectible products can be sensitive to handling and packaging condition. Please take care when opening, handling, or storing your purchases. Any applicable return restrictions will be communicated in accordance with consumer protection laws.</p>
      <h2>Damaged or incorrect orders</h2>
      <p>If you receive a damaged, defective, or incorrect product, contact us with your order number and photographs of the item and packaging where appropriate. We will review the issue and explain the available resolution.</p>
      <h2>Refund processing</h2>
      <p>Approved refunds will be issued through the original payment method where possible. Processing times may depend on the payment provider or financial institution.</p>
      <h2>Cancellations</h2>
      <p>Contact us as soon as possible if you want to cancel an order. Cancellation may not be possible once an order has been dispatched.</p>
      <h2>Contact</h2>
      <p>For return or refund assistance, <Link className="text-harbor underline" href="/contact">call or text us</Link>.</p>
    </InfoPage>
  );
}