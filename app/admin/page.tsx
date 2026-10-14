import type { Metadata } from "next";
import Link from "next/link";
import { orderStatuses } from "@/lib/config";
import { formatCents } from "@/lib/format";
import { adminEnabled, isAdmin } from "@/lib/admin-auth";
import { isStatus, listOrders, type AdminOrder } from "@/lib/admin-orders";
import { login, logout, setStatus } from "./actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };

const PAYMENT_LABELS: Record<string, string> = {
  bank_transfer: "Bank transfer",
  zelle: "Zelle",
  cashapp: "Cash App",
  paypal: "PayPal",
  venmo: "Venmo",
  chime: "Chime",
  crypto: "Crypto",
  mobile_money: "Mobile money",
  cash_on_delivery: "Cash on delivery",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "New",
  awaiting_payment: "Awaiting payment",
  paid: "Paid",
  processing: "Processing",
  shipped: "Shipped",
  completed: "Completed",
  cancelled: "Cancelled",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-signal/20 text-ink",
  awaiting_payment: "bg-amber-100 text-amber-900",
  paid: "bg-emerald-100 text-emerald-900",
  processing: "bg-sky-100 text-sky-900",
  shipped: "bg-indigo-100 text-indigo-900",
  completed: "bg-ink/10 text-ink",
  cancelled: "bg-red-100 text-red-800",
};

const label = (s: string) => STATUS_LABELS[s] ?? s;

const when = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Africa/Lagos" }).format(new Date(iso));

function LoginForm({ error }: { error?: string }) {
  return (
    <div className="container-x max-w-md py-16">
      <h1 className="font-display text-3xl font-bold">Admin</h1>
      <p className="mt-2 text-sm text-ink-soft">Enter the admin password to manage orders.</p>
      <form action={login} className="mt-6 space-y-4">
        <div>
          <label htmlFor="password" className="label">Password</label>
          <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
        </div>
        {error === "bad" && <p className="text-sm text-red-700">Wrong password.</p>}
        {error === "locked" && <p className="text-sm text-red-700">Too many attempts. Wait 15 minutes and try again.</p>}
        <button type="submit" className="btn btn-primary">Log in</button>
      </form>
    </div>
  );
}

function OrderCard({ o }: { o: AdminOrder }) {
  const c = o.customer;
  const phone = c.phone.replace(/[^\d+]/g, "");
  return (
    <li className="rounded-lg border border-ink/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="font-mono text-sm font-bold">{o.orderNumber}</p>
          <p className="text-xs text-ink-soft">{when(o.createdAt)} (Lagos time)</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[o.status] ?? "bg-ink/10"}`}>{label(o.status)}</span>
          <span className="text-lg font-bold">{formatCents(o.totalCents)}</span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <p className="font-semibold">{c.name}</p>
          <p className="mt-1 space-x-3">
            <a className="text-harbor underline" href={`tel:${phone}`}>{c.phone}</a>
            <a className="text-harbor underline" href={`mailto:${c.email}`}>{c.email}</a>
          </p>
          <p className="mt-2 text-ink-soft">
            {c.address}<br />
            {c.city}, {c.region} {c.postalCode}<br />
            {c.country}
          </p>
          {c.notes && <p className="mt-2 rounded bg-paper px-2 py-1 text-ink-soft"><span className="font-semibold">Note:</span> {c.notes}</p>}
        </div>
        <div>
          <ul className="space-y-1">
            {o.items.map((i, idx) => (
              <li key={idx} className="flex justify-between gap-3">
                <span>{i.quantity} × {i.name}</span>
                <span className="shrink-0 text-ink-soft">{formatCents(i.lineCents)}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-ink-soft">
            Payment: <span className="font-semibold text-ink">{PAYMENT_LABELS[o.paymentMethod] ?? o.paymentMethod}</span> (not verified until you mark it paid)
          </p>
          <p className="mt-1 text-xs text-ink-faint">
            Alert email to you: {o.sellerEmailStatus}
            {o.emailError ? ` · ${o.emailError}` : ""}
          </p>
        </div>
      </div>

      <form action={setStatus} className="mt-4 flex flex-wrap items-center gap-2 border-t border-ink/10 pt-3">
        <input type="hidden" name="id" value={o.id} />
        <label htmlFor={`status-${o.id}`} className="text-sm font-semibold">Status</label>
        <select id={`status-${o.id}`} name="status" defaultValue={o.status} className="field !w-auto">
          {orderStatuses.map((s) => (
            <option key={s} value={s}>{label(s)}</option>
          ))}
        </select>
        <button type="submit" className="btn btn-primary">Save</button>
      </form>
    </li>
  );
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<{ status?: string; error?: string }> }) {
  const sp = await searchParams;

  if (!adminEnabled()) {
    return (
      <div className="container-x max-w-xl py-16">
        <h1 className="font-display text-3xl font-bold">Admin</h1>
        <p className="mt-3 text-sm text-ink-soft">
          The admin page is switched off. Set an <code>ADMIN_TOKEN</code> of at least 16 characters in the environment variables and redeploy.
        </p>
      </div>
    );
  }

  if (!(await isAdmin())) return <LoginForm error={sp.error} />;

  const active = isStatus(sp.status) ? sp.status : undefined;
  const { orders, counts, error } = await listOrders(active);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const tab = (href: string, text: string, isActive: boolean) => (
    <Link
      key={text}
      href={href}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${isActive ? "border-ink bg-ink text-white" : "border-ink/20 bg-white text-ink hover:bg-paper"}`}
    >
      {text}
    </Link>
  );

  return (
    <div className="container-x py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Orders</h1>
        <form action={logout}>
          <button type="submit" className="btn btn-ghost">Log out</button>
        </form>
      </div>

      <nav className="mt-5 flex flex-wrap gap-2" aria-label="Filter orders by status">
        {tab("/admin", `All (${total})`, !active)}
        {orderStatuses.map((s) => tab(`/admin?status=${s}`, `${label(s)} (${counts[s] ?? 0})`, active === s))}
      </nav>

      {error && <p className="mt-6 rounded bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>}

      {!error && orders.length === 0 && <p className="mt-8 text-sm text-ink-soft">No orders here yet.</p>}

      <ul className="mt-6 space-y-4">
        {orders.map((o) => (
          <OrderCard key={o.id} o={o} />
        ))}
      </ul>
    </div>
  );
}