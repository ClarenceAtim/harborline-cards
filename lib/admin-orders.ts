// Server-only helpers for the admin orders page. Uses the Supabase service-role key.

import { orderStatuses } from "./config";

export type AdminItem = { name: string; quantity: number; unitCents: number; lineCents: number };
export type AdminOrder = {
  id: string;
  orderNumber: string;
  status: string;
  createdAt: string;
  totalCents: number;
  paymentMethod: string;
  sellerEmailStatus: string;
  emailError: string | null;
  customer: { name: string; email: string; phone: string; address: string; city: string; region: string; postalCode: string; country: string; notes: string };
  items: AdminItem[];
};

const url = () => process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = () => process.env.SUPABASE_SERVICE_ROLE_KEY;
export const adminDbConfigured = () => !!(url() && key());

const hdr = (extra: Record<string, string> = {}) => ({
  apikey: key()!,
  Authorization: `Bearer ${key()}`,
  "Content-Type": "application/json",
  ...extra,
});

export function isStatus(s: string | undefined): s is (typeof orderStatuses)[number] {
  return !!s && (orderStatuses as readonly string[]).includes(s);
}

export async function listOrders(status?: string): Promise<{ orders: AdminOrder[]; counts: Record<string, number>; error?: string }> {
  if (!adminDbConfigured()) return { orders: [], counts: {}, error: "The database is not configured (check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel)." };

  try {
    const filter = isStatus(status) ? `&status=eq.${status}` : "";
    const [ordersRes, countsRes] = await Promise.all([
      fetch(`${url()}/rest/v1/orders?select=*,order_items(*)&order=created_at.desc&limit=200${filter}`, { headers: hdr(), cache: "no-store" }),
      fetch(`${url()}/rest/v1/orders?select=status&limit=5000`, { headers: hdr(), cache: "no-store" }),
    ]);
    if (!ordersRes.ok) return { orders: [], counts: {}, error: `Could not load orders (${ordersRes.status}).` };

    const rows: any[] = await ordersRes.json();
    const counts: Record<string, number> = {};
    if (countsRes.ok) {
      for (const r of (await countsRes.json()) as { status: string }[]) counts[r.status] = (counts[r.status] ?? 0) + 1;
    }

    const orders: AdminOrder[] = rows.map((row) => ({
      id: row.id,
      orderNumber: row.order_number,
      status: row.status,
      createdAt: row.created_at,
      totalCents: row.total_cents,
      paymentMethod: row.payment_method,
      sellerEmailStatus: row.seller_email_status ?? "pending",
      emailError: row.email_error ?? null,
      customer: {
        name: row.customer_name,
        email: row.customer_email,
        phone: row.customer_phone,
        address: row.address_line,
        city: row.city,
        region: row.region,
        postalCode: row.postal_code ?? "",
        country: row.country,
        notes: row.notes ?? "",
      },
      items: (row.order_items ?? []).map((i: any) => ({
        name: i.name,
        quantity: i.quantity,
        unitCents: i.unit_price_cents,
        lineCents: i.line_total_cents,
      })),
    }));
    return { orders, counts };
  } catch (e) {
    console.error("listOrders failed", e);
    return { orders: [], counts: {}, error: "Could not reach the database." };
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function updateOrderStatus(id: string, status: string): Promise<boolean> {
  if (!adminDbConfigured() || !UUID.test(id) || !isStatus(status)) return false;
  try {
    const r = await fetch(`${url()}/rest/v1/orders?id=eq.${id}`, {
      method: "PATCH",
      headers: hdr(),
      body: JSON.stringify({ status }),
      cache: "no-store",
    });
    return r.ok;
  } catch {
    return false;
  }
}