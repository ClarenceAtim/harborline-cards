import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "Terms and conditions for using the Harborline Cards website and purchasing from our online store.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <InfoPage title="Terms & Conditions">
      <h2>1. Introduction</h2>
      <p>These Terms &amp; Conditions govern your use of our website and the purchase of products through our online store. By using the website, you agree to these terms and applicable laws.</p>
      <h2>2. Products</h2>
      <p>We sell trading cards, sealed trading card products, collectibles, and related merchandise. Product images and descriptions are provided to help customers understand the items offered. Actual products may differ in appearance because of packaging updates, printing variations, or differences between photographs and physical items. Individual card condition and language will be specified where applicable.</p>
      <h2>3. Pricing and availability</h2>
      <p>Prices and product availability may change without notice. An item added to your cart is not guaranteed to remain available until your order is accepted. Any applicable shipping charges and taxes will be disclosed before the purchase is completed, where required.</p>
      <h2>4. Orders</h2>
      <p>Submitting an order constitutes a purchase request. Orders may be subject to verification and acceptance. If an order cannot be fulfilled, we will contact the customer and arrange any applicable refund for payments received for the unfulfilled order.</p>
      <h2>5. Payments</h2>
      <p>Customers must provide accurate information and use an accepted payment method. Orders may not be dispatched until payment has been confirmed.</p>
      <h2>6. Shipping</h2>
      <p>Shipping methods, costs, and estimated delivery times depend on the destination and available services. Delivery estimates may change because of carrier delays, customs procedures, or other circumstances outside our control.</p>
      <h2>7. Returns and refunds</h2>
      <p>Returns, cancellations, and refunds are governed by our <Link className="text-harbor underline" href="/refund-policy">refund policy</Link> and applicable consumer protection laws. Nothing in these terms excludes rights that cannot legally be excluded.</p>
      <h2>8. Intellectual property</h2>
      <p>Website content, including original text, branding, graphics, and design elements, may be protected by intellectual property laws. Trademarks and copyrighted materials remain the property of their respective owners.</p>
      <h2>9. Limitation of liability</h2>
      <p>To the extent permitted by applicable law, we are not responsible for losses arising from circumstances beyond our reasonable control. Nothing in these terms limits liability where such limitation is prohibited by law.</p>
      <h2>10. Changes to these terms</h2>
      <p>We may update these terms from time to time. Updated terms will be published on this page with a revised effective date where appropriate.</p>
      <h2>11. Contact</h2>
      <p>For questions about these Terms &amp; Conditions, <Link className="text-harbor underline" href="/contact">contact us</Link>.</p>
      <p>Last updated: October 11, 2026</p>
    </InfoPage>
  );
}