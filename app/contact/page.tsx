import type { Metadata } from "next";
import InfoPage from "@/components/InfoPage";
import ContactNumber from "@/components/ContactNumber";
import { store } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact Harborline Cards",
  description: "Call or text Harborline Cards about sealed sports cards, Pokémon boxes and trading card game orders.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  const intl = store.phoneIntl ?? "+1" + store.phone;
  const wa = intl.replace(/\D/g, "");
  return (
    <InfoPage title="Contact us">
      <p>We’re here to help with your trading card shopping experience. Whether you have a question about a product, need help with an order, or want more information about our store, our customer support team is available to assist you.</p>

      <h2>Customer support</h2>
      <p className="text-base">Phone / text: <ContactNumber /></p>
      <div className="flex flex-wrap gap-3 !mt-3">
        <a href={`tel:${intl}`} className="btn-primary">📞 Call</a>
        <a href={`sms:${intl}`} className="btn-primary">💬 Text message</a>
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className="btn-primary">🟢 WhatsApp</a>
      </div>
      {store.publicContactEmail ? (
        <p>Email: <a className="font-semibold text-harbor underline" href={"mailto:" + store.publicContactEmail}>{store.publicContactEmail}</a></p>
      ) : null}

      <h2>Order inquiries</h2>
      <p>Please include your order number and a brief description of your issue so we can assist you more efficiently.</p>

      <h2>Product inquiries</h2>
      <p>For questions about card condition, product availability, upcoming releases, or pre-orders, contact us before placing your order.</p>

      <p>We aim to respond to customer inquiries as soon as possible. Thank you for shopping with us!</p>
    </InfoPage>
  );
}