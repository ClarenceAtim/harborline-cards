import { NextResponse } from "next/server";
import { validateCheckout } from "@/lib/validate";
import { getProduct } from "@/lib/products";
import { toCents } from "@/lib/format";
import { createOrder, ConfigError, setEmailStatus, type StoredOrder } from "@/lib/orders";
import { sendSellerEmail, sendCustomerEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Best-effort per-instance rate limit (5 requests / 10 min / IP).
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 10 * 60_000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > 5;
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "Too many attempts. Please wait a few minutes." }, { status: 429 });

  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot: bots fill the hidden "website" field. Reject without storing.
  if (typeof body?.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: false, error: "Could not process request." }, { status: 400 });
  }

  const v = validateCheckout(body);
  if (!v.ok) return NextResponse.json({ ok: false, errors: v.errors }, { status: 422 });
  const { customer, items, paymentMethod, idempotencyKey } = v.data;

  // Trusted pricing and stock check. Browser-supplied prices are never read.
  const lines: StoredOrder["items"] = [];
  const problems: string[] = [];
  for (const it of items) {
    const p = getProduct(it.slug);
    if (!p) { problems.push(`A product in your cart is no longer available.`); continue; }
    if (p.stock <= 0 || p.availability !== "in_stock") { problems.push(`${p.name} is out of stock.`); continue; }
    if (it.qty > p.stock) { problems.push(`Only ${p.stock} of ${p.name} available.`); continue; }
    const unitCents = toCents(p.price);
    lines.push({ slug: p.slug, productId: p.id, name: p.name, qty: it.qty, unitCents, lineCents: unitCents * it.qty });
  }
  if (problems.length) return NextResponse.json({ ok: false, error: problems.join(" ") }, { status: 409 });

  const subtotalCents = lines.reduce((s, l) => s + l.lineCents, 0);

  let order: StoredOrder;
  try {
    order = await createOrder({ customer, items: lines, subtotalCents, totalCents: subtotalCents, paymentMethod }, idempotencyKey);
  } catch (e) {
    if (e instanceof ConfigError) {
      return NextResponse.json({ ok: false, error: "Ordering is temporarily unavailable. Please try again later." }, { status: 503 });
    }
    console.error("createOrder failed", e);
    return NextResponse.json({ ok: false, error: "We could not save your order. Please try again." }, { status: 500 });
  }

  // Emails run after the order is safely stored. Any failure is recorded and never fatal.
  if (!order.duplicate) {
    try {
      const [seller, cust] = await Promise.all([
        sendSellerEmail(order).catch((e: any) => ({ ok: false, skipped: false, error: String(e?.message ?? e) })),
        sendCustomerEmail(order).catch((e: any) => ({ ok: false, skipped: false, error: String(e?.message ?? e) })),
      ]);
      const status = (r: { ok: boolean; skipped?: boolean }) => (r.ok ? "sent" : r.skipped ? "skipped" : "failed");
      const err = [seller.error && `seller: ${seller.error}`, cust.error && `customer: ${cust.error}`].filter(Boolean).join(" | ") || null;
      await setEmailStatus(order.id, {
        seller_email_status: status(seller),
        customer_email_status: status(cust),
        email_error: err,
      });
      if (!seller.ok) console.warn(`Seller notification not sent for ${order.orderNumber}: ${seller.error}`);
    } catch (e) {
      console.error("email step failed (order was saved)", e);
    }
  }

  return NextResponse.json({
    ok: true,
    order: {
      orderNumber: order.orderNumber,
      status: order.status,
      items: order.items.map((i) => ({ slug: i.slug, name: i.name, qty: i.qty, unitCents: i.unitCents, lineCents: i.lineCents })),
      totalCents: order.totalCents,
      paymentMethod: order.paymentMethod,
      persisted: order.persisted,
    },
  });
}