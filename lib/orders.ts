// Server-only order persistence. Uses the Supabase PostgREST API with the service-role key
// (never imported by client components). Orders are NEVER readable by the browser.

import { randomBytes } from "crypto";
import type { PaymentMethodId } from "./config";

export type StoredItem = { slug: string; name: string; qty: number; unitCents: number; lineCents: number; productId: string };
export type StoredOrder = {
  id: string;
  orderNumber: string;
  status: string;
  items: StoredItem[];
  subtotalCents: number;
  totalCents: number;
  paymentMethod: PaymentMethodId;
  customer: { name: string; email: string; phone: string; address: string; city: string; region: string; postalCode: string; country: string; notes: string };
  persisted: boolean;
  duplicate?: boolean;
};

export class ConfigError extends Error {}

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
export const dbConfigured = () => !!(url() && key());

const hdr = (extra: Record<string, string> = {}) => ({
  apikey: key()!,
  Authorization: `Bearer ${key()}`,
  "Content-Type": "application/json",
  ...extra,
});

// Unambiguous alphabet (no 0/O/1/I).
export function newOrderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = randomBytes(6);
  const code = Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
  const d = new Date();
  const ymd = `${String(d.getUTCFullYear()).slice(2)}${String(d.getUTCMonth() + 1).padStart(2, "0")}${String(d.getUTCDate()).padStart(2, "0")}`;
  return `HL-${ymd}-${code}`;
}

// Dev-only fallback when Supabase is not configured. Never used in production.
const memory = new Map<string, StoredOrder>();
const memoryByKey = new Map<string, string>();

type NewOrder = Omit<StoredOrder, "id" | "orderNumber" | "status" | "persisted" | "duplicate">;

function rowToOrder(row: any, items: any[]): StoredOrder {
  return {
    id: row.id,
    orderNumber: row.order_number,
    status: row.status,
    subtotalCents: row.subtotal_cents,
    totalCents: row.total_cents,
    paymentMethod: row.payment_method,
    customer: {
      name: row.customer_name, email: row.customer_email, phone: row.customer_phone,
      address: row.address_line, city: row.city, region: row.region,
      postalCode: row.postal_code ?? "", country: row.country, notes: row.notes ?? "",
    },
    items: items.map((i) => ({
      slug: i.slug, name: i.name, qty: i.quantity, unitCents: i.unit_price_cents,
      lineCents: i.line_total_cents, productId: i.product_id,
    })),
    persisted: true,
  };
}

async function fetchByKey(idemKey: string): Promise<StoredOrder | null> {
  const r = await fetch(`${url()}/rest/v1/orders?idempotency_key=eq.${encodeURIComponent(idemKey)}&select=*,order_items(*)`, { headers: hdr(), cache: "no-store" });
  if (!r.ok) return null;
  const rows = await r.json();
  if (!rows[0]) return null;
  return rowToOrder(rows[0], rows[0].order_items ?? []);
}

export async function createOrder(input: NewOrder, idempotencyKey: string): Promise<StoredOrder> {
  if (!dbConfigured()) {
    if (process.env.NODE_ENV === "production") throw new ConfigError("Order storage is not configured.");
    const existingId = memoryByKey.get(idempotencyKey);
    if (existingId) return { ...memory.get(existingId)!, duplicate: true };
    const order: StoredOrder = { ...input, id: randomBytes(8).toString("hex"), orderNumber: newOrderNumber(), status: "pending", persisted: false };
    memory.set(order.id, order);
    memoryByKey.set(idempotencyKey, order.id);
    return order;
  }

  for (let attempt = 0; attempt < 4; attempt++) {
    const orderNumber = newOrderNumber();
    const res = await fetch(`${url()}/rest/v1/orders`, {
      method: "POST",
      headers: hdr({ Prefer: "return=representation" }),
      body: JSON.stringify({
        order_number: orderNumber,
        idempotency_key: idempotencyKey,
        status: "pending",
        customer_name: input.customer.name,
        customer_email: input.customer.email,
        customer_phone: input.customer.phone,
        address_line: input.customer.address,
        city: input.customer.city,
        region: input.customer.region,
        postal_code: input.customer.postalCode || null,
        country: input.customer.country,
        notes: input.customer.notes || null,
        payment_method: input.paymentMethod,
        subtotal_cents: input.subtotalCents,
        total_cents: input.totalCents,
        currency: "USD",
      }),
      cache: "no-store",
    });

    if (res.status === 409) {
      // Duplicate idempotency key (double submit) or order-number collision.
      const existing = await fetchByKey(idempotencyKey);
      if (existing) return { ...existing, duplicate: true };
      continue; // order-number collision: retry with a new number
    }
    if (!res.ok) throw new Error(`Order insert failed (${res.status})`);

    const [row] = await res.json();
    const itemsRes = await fetch(`${url()}/rest/v1/order_items`, {
      method: "POST",
      headers: hdr(),
      body: JSON.stringify(
        input.items.map((i) => ({
          order_id: row.id, product_id: i.productId, slug: i.slug, name: i.name,
          unit_price_cents: i.unitCents, quantity: i.qty, line_total_cents: i.lineCents,
        })),
      ),
      cache: "no-store",
    });
    if (!itemsRes.ok) {
      await fetch(`${url()}/rest/v1/orders?id=eq.${row.id}`, { method: "DELETE", headers: hdr() }).catch(() => {});
      throw new Error(`Order items insert failed (${itemsRes.status})`);
    }
    return { ...input, id: row.id, orderNumber: row.order_number, status: row.status, persisted: true };
  }
  throw new Error("Could not allocate a unique order number.");
}

export async function setEmailStatus(
  orderId: string,
  patch: { seller_email_status?: string; customer_email_status?: string; email_error?: string | null },
) {
  if (!dbConfigured()) return;
  await fetch(`${url()}/rest/v1/orders?id=eq.${orderId}`, {
    method: "PATCH", headers: hdr(), body: JSON.stringify(patch), cache: "no-store",
  }).catch(() => {});
}

export type PendingNotice = StoredOrder & { sellerStatus: string; customerStatus: string };

export async function listUnnotified(): Promise<PendingNotice[]> {
  if (!dbConfigured()) return [];
  const r = await fetch(
    `${url()}/rest/v1/orders?or=(seller_email_status.neq.sent,customer_email_status.neq.sent)&select=*,order_items(*)&order=created_at.asc&limit=50`,
    { headers: hdr(), cache: "no-store" },
  );
  if (!r.ok) return [];
  const rows = await r.json();
  return rows.map((row: any) => ({
    ...rowToOrder(row, row.order_items ?? []),
    sellerStatus: row.seller_email_status as string,
    customerStatus: row.customer_email_status as string,
  }));
}
