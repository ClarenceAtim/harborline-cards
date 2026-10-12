"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { paymentMethods } from "@/lib/config";
import { formatCents } from "@/lib/format";

type Summary = {
  orderNumber: string;
  items: { slug: string; name: string; qty: number; unitCents: number; lineCents: number }[];
  totalCents: number;
  paymentMethod: string;
  persisted: boolean;
};

// The confirmation reads the order summary the server returned for THIS browser session.
// There is deliberately no public "look up any order by number" endpoint (customer data stays private).
export default function ConfirmationPage() {
  const [order, setOrder] = useState<Summary | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("harborline_last_order");
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, []);

  if (!loaded) return <div className="container-x py-16 text-center text-ink-soft">Loading…</div>;
  if (!order) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="font-display text-3xl font-bold">No recent order found</h1>
        <p className="mt-2 text-ink-soft">If you just placed an order, check your email. Otherwise start shopping again.</p>
        <Link href="/shop" className="btn-primary mt-6">Browse products</Link>
      </div>
    );
  }

  const pm = paymentMethods.find((m) => m.id === order.paymentMethod)?.label ?? order.paymentMethod;

  return (
    <div className="container-x max-w-3xl py-10">
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-5">
        <h1 className="font-display text-3xl font-bold text-emerald-900">Order request received</h1>
        <p className="mt-1 text-emerald-900">Order number: <strong className="font-mono">{order.orderNumber}</strong></p>
      </div>

      {!order.persisted && (
        <p role="alert" className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-900">
          Development mode: the database is not configured, so this order was NOT saved permanently.
        </p>
      )}

      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5" aria-label="Order details">
        <ul className="divide-y divide-ink/10 text-sm">
          {order.items.map((i) => (
            <li key={i.slug} className="flex justify-between gap-3 py-2">
              <span>{i.name} <span className="text-ink-faint">× {i.qty} @ {formatCents(i.unitCents)}</span></span>
              <span className="font-semibold">{formatCents(i.lineCents)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 flex justify-between border-t border-ink/10 pt-3 font-bold"><span>Total (excl. shipping)</span><span>{formatCents(order.totalCents)}</span></p>
        <p className="mt-2 text-sm text-ink-soft">Payment method: <strong>{pm}</strong></p>
      </section>

      <section className="mt-6 rounded-lg border border-ink/10 bg-white p-5 text-sm">
        <h2 className="font-semibold">What happens next</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-ink-soft">
          <li>The seller reviews your order and emails you payment instructions for {pm.toLowerCase()}, plus the shipping cost.</li>
          <li>You pay using those instructions. No payment has been taken yet.</li>
          <li>The seller verifies your payment manually, then processes and ships your order.</li>
        </ol>
        <p className="mt-3 text-ink-soft">Keep your order number handy when you reply to the seller.</p>
      </section>

      <Link href="/shop" className="btn-primary mt-6">Continue shopping</Link>
    </div>
  );
}
