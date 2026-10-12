// Server-only email via the Resend REST API (free tier compatible). No SDK needed.

import { formatCents } from "./format";
import { paymentMethods, store } from "./config";
import type { StoredOrder } from "./orders";

export type SendResult = { ok: boolean; skipped?: boolean; error?: string };

// Safe against missing values: never throws.
const esc = (s?: string | null) =>
  String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const phone = () => store.phoneDisplay ?? store.phone ?? "";

async function send(to: string, subject: string, html: string, text: string, replyTo?: string): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from || !to) return { ok: false, skipped: true, error: "Email not configured" };
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject, html, text, ...(replyTo ? { reply_to: replyTo } : {}) }),
    });
    if (!res.ok) return { ok: false, error: `Provider error ${res.status}: ${(await res.text()).slice(0, 300)}` };
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}

const pmLabel = (id: string) => paymentMethods.find((m) => m.id === id)?.label ?? id;

function itemsTable(o: StoredOrder) {
  const rows = o.items
    .map((i) => `<tr><td style="padding:6px 8px;border-bottom:1px solid #eee">${esc(i.name)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:center">${i.qty}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${formatCents(i.unitCents)}</td><td style="padding:6px 8px;border-bottom:1px solid #eee;text-align:right">${formatCents(i.lineCents)}</td></tr>`)
    .join("");
  return `<table style="border-collapse:collapse;width:100%;font-size:14px"><thead><tr><th align="left" style="padding:6px 8px">Item</th><th style="padding:6px 8px">Qty</th><th align="right" style="padding:6px 8px">Price</th><th align="right" style="padding:6px 8px">Line</th></tr></thead><tbody>${rows}</tbody></table><p style="text-align:right;font-size:16px"><strong>Total: ${formatCents(o.totalCents)}</strong> (shipping to be confirmed)</p>`;
}

const itemsText = (o: StoredOrder) =>
  o.items.map((i) => `- ${i.name} x${i.qty} @ ${formatCents(i.unitCents)} = ${formatCents(i.lineCents)}`).join("\n") +
  `\nTotal: ${formatCents(o.totalCents)} (shipping to be confirmed)`;

export function sendSellerEmail(o: StoredOrder): Promise<SendResult> {
  const to = process.env.SELLER_EMAIL ?? "";
  const c = o.customer;
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px">
<h2>New order request ${esc(o.orderNumber)}</h2>
<p><strong>Payment method chosen:</strong> ${esc(pmLabel(o.paymentMethod))}<br><strong>Status:</strong> ${esc(o.status)} (payment NOT verified)</p>
<h3>Customer</h3>
<p>${esc(c.name)}<br>${esc(c.email)}<br>${esc(c.phone)}</p>
<h3>Ship to</h3>
<p>${esc(c.address)}<br>${esc(c.city)}, ${esc(c.region)} ${esc(c.postalCode)}<br>${esc(c.country)}</p>
${c.notes ? `<h3>Notes</h3><p>${esc(c.notes)}</p>` : ""}
<h3>Items</h3>${itemsTable(o)}
<p>Next: send the customer payment instructions, verify payment manually, then update the order status in Supabase.</p></div>`;
  const text = `New order request ${o.orderNumber}\nPayment: ${pmLabel(o.paymentMethod)} (NOT verified)\n\n${c.name}\n${c.email}\n${c.phone}\n\nShip to:\n${c.address}\n${c.city}, ${c.region} ${c.postalCode}\n${c.country}\n${c.notes ? `\nNotes: ${c.notes}\n` : ""}\nItems:\n${itemsText(o)}`;
  return send(to, `New order request ${o.orderNumber}`, html, text, c.email);
}

export function sendCustomerEmail(o: StoredOrder): Promise<SendResult> {
  const html = `<div style="font-family:Arial,sans-serif;max-width:640px">
<h2>Thanks for your order request, ${esc(o.customer.name)}</h2>
<p>We received order <strong>${esc(o.orderNumber)}</strong> at ${esc(store.name)}. <strong>No payment has been taken.</strong> We will send you payment instructions for your chosen method (${esc(pmLabel(o.paymentMethod))}) and confirm the shipping cost. Your order is processed only after payment is verified.</p>
${itemsTable(o)}
<p style="font-size:12px;color:#666">Questions? Call or text ${esc(phone())}. Please quote your order number.</p></div>`;
  const text = `Thanks for your order request, ${o.customer.name}.\n\nOrder ${o.orderNumber}. No payment has been taken. We will send payment instructions for ${pmLabel(o.paymentMethod)} and confirm the shipping cost. Your order is processed only after payment is verified.\n\n${itemsText(o)}\n\nQuestions? Call or text ${phone()}. Please quote your order number.`;
  return send(o.customer.email, `Order request received: ${o.orderNumber}`, html, text);
}