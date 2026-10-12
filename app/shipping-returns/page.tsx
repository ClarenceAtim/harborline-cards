import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Order processing, shipping methods, delivery, tracking, damaged items and returns at Harborline Cards.",
  alternates: { canonical: "/shipping-returns" },
};

export default function ShippingReturns() {
  return (
    <InfoPage title="Shipping & Returns">
      <h2>Order processing</h2>
      <p>Orders are processed after payment has been confirmed. Processing times may vary depending on product availability, order volume, and whether an item is a pre-order.</p>
      <h2>Shipping methods and delivery</h2>
      <p>Available shipping methods, shipping charges, and estimated delivery times will be confirmed with your order where supported. Delivery times may vary depending on the destination and shipping carrier.</p>
      <h2>Order tracking</h2>
      <p>When tracking is available, tracking details will be provided after your order has been dispatched. See <Link className="text-harbor underline" href="/track-order">track your order</Link>.</p>
      <h2>Damaged, missing, or incorrect items</h2>
      <p>If your order arrives damaged, contains an incorrect item, or appears to be missing a product, please contact customer support with your order number and clear photographs where applicable.</p>
      <h2>Returns and refunds</h2>
      <p>Return eligibility, refund conditions, and any applicable deadlines are explained in our <Link className="text-harbor underline" href="/refund-policy">refund policy</Link>. Please review it before returning a product.</p>
      <h2>Pre-orders</h2>
      <p>Pre-order items are expected to ship according to their announced release dates and supplier availability. Release dates may change, and estimated dates are not guaranteed unless expressly stated.</p>
      <h2>Contact us</h2>
      <p>For shipping or return inquiries, <Link className="text-harbor underline" href="/contact">contact our customer support team</Link> and include your order number where applicable.</p>
    </InfoPage>
  );
}