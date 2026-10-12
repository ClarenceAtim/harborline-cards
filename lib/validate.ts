import { enabledPaymentMethods, PaymentMethodId } from "./config";

export type CheckoutPayload = {
  customer: {
    name: string; email: string; phone: string;
    address: string; city: string; region: string; postalCode: string; country: string;
    notes: string;
  };
  items: { slug: string; qty: number }[];
  paymentMethod: PaymentMethodId;
  idempotencyKey: string;
};

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export function validateCheckout(body: unknown): { ok: true; data: CheckoutPayload } | { ok: false; errors: Record<string, string> } {
  const errors: Record<string, string> = {};
  const b = (body ?? {}) as Record<string, any>;
  const c = (b.customer ?? {}) as Record<string, unknown>;

  const customer = {
    name: str(c.name, 120),
    email: str(c.email, 200).toLowerCase(),
    phone: str(c.phone, 40),
    address: str(c.address, 250),
    city: str(c.city, 100),
    region: str(c.region, 100),
    postalCode: str(c.postalCode, 20),
    country: str(c.country, 100),
    notes: str(c.notes, 1000),
  };

  if (customer.name.length < 2) errors.name = "Enter your full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(customer.email)) errors.email = "Enter a valid email address.";
  if (!/^[+()\d][\d\s().-]{5,}$/.test(customer.phone)) errors.phone = "Enter a valid phone number.";
  if (customer.address.length < 5) errors.address = "Enter your shipping address.";
  if (customer.city.length < 2) errors.city = "Enter your city.";
  if (customer.region.length < 2) errors.region = "Enter your state or region.";
  if (customer.country.length < 2) errors.country = "Enter your country.";

  const pm = enabledPaymentMethods().find((m) => m.id === b.paymentMethod);
  if (!pm) errors.paymentMethod = "Choose an available payment method.";

  const rawItems = Array.isArray(b.items) ? b.items : [];
  const merged = new Map<string, number>();
  for (const it of rawItems.slice(0, 50)) {
    const slug = str(it?.slug, 200);
    const qty = Number(it?.qty);
    if (!slug || !Number.isInteger(qty) || qty < 1 || qty > 99) {
      errors.items = "Your cart contains an invalid item.";
      continue;
    }
    merged.set(slug, (merged.get(slug) ?? 0) + qty);
  }
  if (merged.size === 0 && !errors.items) errors.items = "Your cart is empty.";

  const idempotencyKey = str(b.idempotencyKey, 100);
  if (!/^[A-Za-z0-9-]{16,100}$/.test(idempotencyKey)) errors.idempotencyKey = "Invalid request key. Refresh and try again.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      customer,
      items: Array.from(merged, ([slug, qty]) => ({ slug, qty })),
      paymentMethod: pm!.id,
      idempotencyKey,
    },
  };
}
