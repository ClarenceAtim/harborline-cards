import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Harborline Cards collects, uses and protects your personal information.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <InfoPage title="Privacy Policy">
      <h2>Introduction</h2>
      <p>We respect your privacy and are committed to protecting the personal information you provide when using our website.</p>
      <h2>Information we collect</h2>
      <p>Depending on how you use our website, we may collect information such as your name, email address, phone number, shipping and billing details, order history, and information submitted through contact forms.</p>
      <h2>How we use your information</h2>
      <ul>
        <li>Process and fulfill orders.</li>
        <li>Communicate order confirmations and shipping updates.</li>
        <li>Respond to customer inquiries.</li>
        <li>Improve our website and customer experience.</li>
        <li>Detect fraud and protect our services.</li>
        <li>Meet applicable legal obligations.</li>
      </ul>
      <h2>Payments</h2>
      <p>This website does not collect or store payment card details. Payment is arranged directly with us after you submit your order, or through third-party payment providers where offered.</p>
      <h2>Cookies and analytics</h2>
      <p>Our website may use cookies and similar technologies, including your browser’s local storage to remember your shopping cart, to support website functionality, understand usage, and improve performance.</p>
      <h2>Sharing information</h2>
      <p>We may share relevant information with service providers involved in payment processing, shipping, website hosting, email delivery, analytics, and order fulfillment where necessary to provide our services.</p>
      <h2>Data security</h2>
      <p>We take reasonable steps to protect personal information. However, no method of online transmission or electronic storage can be guaranteed to be completely secure.</p>
      <h2>Your rights</h2>
      <p>Depending on applicable law, you may have rights to access, correct, delete, or otherwise manage your personal information.</p>
      <h2>Contact</h2>
      <p>For privacy-related questions, <Link className="text-harbor underline" href="/contact">contact us</Link>.</p>
      <p>Last updated: October 11, 2026</p>
    </InfoPage>
  );
}