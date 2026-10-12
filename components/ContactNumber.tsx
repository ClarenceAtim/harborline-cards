import { store } from "@/lib/config";

export default function ContactNumber({ dark = false, up = false }: { dark?: boolean; up?: boolean }) {
  const intl = store.phoneIntl ?? "+1" + store.phone;
  const display = store.phoneDisplay ?? store.phone;
  const wa = intl.replace(/\D/g, "");
  const item = "block px-4 py-2.5 text-sm text-ink hover:bg-paper";
  return (
    <details className="relative inline-block">
      <summary className={`cursor-pointer list-none font-semibold underline [&::-webkit-details-marker]:hidden ${dark ? "text-white" : "text-harbor"}`}>
        {display}
      </summary>
      <div className={`absolute left-0 z-20 w-48 overflow-hidden rounded-lg border border-ink/10 bg-white shadow-lg ${up ? "bottom-full mb-2" : "mt-2"}`}>
        <a href={`tel:${intl}`} className={item}>📞 Call</a>
        <a href={`sms:${intl}`} className={item}>💬 Text message</a>
        <a href={`https://wa.me/${wa}`} target="_blank" rel="noopener noreferrer" className={item}>🟢 WhatsApp</a>
      </div>
    </details>
  );
}