export type Currency = "USD" | "EUR";

export const toCents = (dollars: number) => Math.round(dollars * 100);

export const formatCents = (cents: number, currency: Currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(cents / 100);

export const formatPrice = (dollars: number, currency: Currency = "USD") => formatCents(toCents(dollars), currency);

// Per-currency totals with the zero ones dropped, for display as separate
// lines. Dollar and euro amounts are never added together.
export function nonzeroTotals(
  totals: { USD: number; EUR: number },
  inCents = false,
): { currency: Currency; label: string }[] {
  return (["USD", "EUR"] as Currency[])
    .filter((c) => totals[c] > 0)
    .map((c) => ({ currency: c, label: inCents ? formatCents(totals[c], c) : formatPrice(totals[c], c) }));
}

export const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
