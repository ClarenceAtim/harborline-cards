"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { enabledPaymentMethods } from "@/lib/config";
import { formatPrice } from "@/lib/format";

const KEY_STORE = "harborline_idem_v1";
const fields = ["name", "email", "phone", "address", "city", "region", "postalCode", "country", "notes"] as const;
type F = (typeof fields)[number];

function newKey() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}-abcdef`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { lines, subtotal, ready, clear } = useCart();
  const methods = enabledPaymentMethods();
  const [form, setForm] = useState<Record<F, string>>({ name: "", email: "", phone: "", address: "", city: "", region: "", postalCode: "", country: "", notes: "" });
  const [payment, setPayment] = useState(methods[0]?.id ?? "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const inFlight = useRef(false);

  // One idempotency key per checkout attempt, kept across refreshes until success.
  const keyRef = useRef("");
  useEffect(() => {
    try {
      keyRef.current = sessionStorage.getItem(KEY_STORE) || "";
      if (!keyRef.current) { keyRef.current = newKey(); sessionStorage.setItem(KEY_STORE, keyRef.current); }
    } catch { keyRef.current = newKey(); }
  }, []);

  const set = (k: F) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (inFlight.current) return; // blocks double clicks
    inFlight.current = true;
    setBusy(true); setErrors({}); setFormError("");
    try {
      const payload = JSON.stringify({
        customer: form,
        items: lines.map((l) => ({ slug: l.product.slug, qty: l.qty })),
        paymentMethod: payment,
        idempotencyKey: keyRef.current,
        website: honeypot,
      });
      const send = () => fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: payload });
      let res = await send();
      let data: any = await res.json().catch(() => null);
      if (!data) {
        // The first request can fail while the server is still starting up. Retrying is safe:
        // the idempotency key guarantees the same order is never created twice.
        await new Promise((r) => setTimeout(r, 1500));
        res = await send();
        data = await res.json().catch(() => ({}));
      }
      if (res.ok && data.ok) {
        try {
          sessionStorage.setItem("harborline_last_order", JSON.stringify(data.order));
          sessionStorage.removeItem(KEY_STORE);
        } catch {}
        setDone(true);
        router.push("/order/confirmation");
        setTimeout(() => clear(), 1500);
        return;
      }
      if (data.errors) setErrors(data.errors);
      setFormError(data.error || (data.errors ? "Please fix the highlighted fields." : "Something went wrong. Please try again."));
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
    if (done) return <div className="container-x py-16 text-center"><p className="font-display text-2xl font-bold">Order request received</p><p className="mt-2 text-ink-soft">Taking you to your confirmation…</p></div>;

  if (!ready) return <div className="container-x py-16 text-center text-ink-soft">Loading…</div>;
  if (lines.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="font-display text-3xl font-bold">Nothing to check out</h1>
        <Link href="/shop" className="btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const renderField = ({ k, label, type = "text", autoComplete, required = true }: { k: F; label: string; type?: string; autoComplete?: string; required?: boolean }) => (
    <div key={k}>
      <label className="label" htmlFor={k}>{label}{required ? " *" : ""}</label>
      <input id={k} name={k} type={type} autoComplete={autoComplete} value={form[k]} onChange={set(k)} required={required}
        aria-invalid={!!errors[k]} aria-describedby={errors[k] ? `${k}-err` : undefined} className="field" />
      {errors[k] && <p id={`${k}-err`} className="mt-1 text-xs text-red-700">{errors[k]}</p>}
    </div>
  );

  return (
    <div className="container-x py-8">
      <h1 className="font-display text-3xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-ink-soft">No card details are collected. You are placing an order request; the seller will email payment instructions.</p>

      <form onSubmit={submit} noValidate className="mt-6 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <fieldset className="rounded-lg border border-ink/10 bg-white p-5">
            <legend className="px-1 font-semibold">Contact</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{renderField({k: "name", label: "Full name", autoComplete: "name", })}</div>
              {renderField({k: "email", label: "Email address", type: "email", autoComplete: "email", })}
              {renderField({k: "phone", label: "Phone number", type: "tel", autoComplete: "tel", })}
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-ink/10 bg-white p-5">
            <legend className="px-1 font-semibold">Shipping address</legend>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">{renderField({k: "address", label: "Street address", autoComplete: "street-address", })}</div>
              {renderField({k: "city", label: "City", autoComplete: "address-level2", })}
              {renderField({ k: "region", label: "State / region", autoComplete: "address-level1" })}
              {renderField({k: "postalCode", label: "Postal code", autoComplete: "postal-code", required: false })}
              {renderField({k: "country", label: "Country", autoComplete: "country-name", })}
              <div className="sm:col-span-2">
                <label className="label" htmlFor="notes">Order notes (optional)</label>
                <textarea id="notes" rows={3} maxLength={1000} value={form.notes} onChange={set("notes")} className="field" />
              </div>
            </div>
          </fieldset>

          <fieldset className="rounded-lg border border-ink/10 bg-white p-5">
            <legend className="px-1 font-semibold">Payment method</legend>
            <div className="space-y-2">
              {methods.map((m) => (
                <label key={m.id} className={`flex cursor-pointer gap-3 rounded-md border p-3 ${payment === m.id ? "border-harbor bg-harbor-light" : "border-ink/15"}`}>
                  <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="mt-1" />
                  <span><span className="block text-sm font-semibold">{m.label}</span><span className="block text-xs text-ink-soft">{m.description}</span></span>
                </label>
              ))}
            </div>
            {errors.paymentMethod && <p className="mt-1 text-xs text-red-700">{errors.paymentMethod}</p>}
          </fieldset>

          {/* Honeypot: hidden from people, tempting to bots */}
          <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label>Website<input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-ink/10 bg-white p-5" aria-label="Order summary">
          <h2 className="font-semibold">Order summary</h2>
          <ul className="mt-3 divide-y divide-ink/10 text-sm">
            {lines.map((l) => (
              <li key={l.product.slug} className="flex justify-between gap-3 py-2">
                <span>{l.product.name} <span className="text-ink-faint">× {l.qty}</span></span>
                <span className="shrink-0 font-semibold">{formatPrice(l.product.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-bold"><span>Total</span><span>{formatPrice(subtotal)}</span></div>
          <p className="mt-1 text-xs text-ink-faint">Shipping cost confirmed by the seller. Totals are re-calculated on the server.</p>

          {(formError || errors.items) && <p role="alert" className="mt-4 rounded bg-red-50 p-3 text-sm text-red-800">{formError || errors.items}</p>}

          <button type="submit" className="btn-primary mt-4 w-full" disabled={busy || methods.length === 0}>
            {busy ? "Submitting…" : "Place order request"}
          </button>
          <Link href="/cart" className="btn-ghost mt-2 w-full">Back to cart</Link>
        </aside>
      </form>
    </div>
  );
}
