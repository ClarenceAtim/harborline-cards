// European-edition products (French, German, Spanish) are priced in euros.
//
// The seller's admin stores prices in US dollars only, so the euro price is
// derived from the stored USD price. Bob priced the European editions in USD
// at EUR x 1.0785 (rounded up to .95), so dividing by the same rate recovers
// the euro price. If the seller changes a USD price in the admin, the euro
// price shown on the site follows automatically — no second price to keep
// in sync. Products priced in euros in the code catalog carry their euro
// price directly and skip the conversion.

import type { Currency } from "./format";

export const EUR_USD_RATE = 1.0785;

export const isEuropeanEdition = (slug: string) =>
  /-(french|german|spanish)-edition$/.test(slug);

// USD -> EUR, rounded to the cent.
export const usdToEur = (usd: number) => Math.round((usd / EUR_USD_RATE) * 100) / 100;

// EUR -> USD, rounded to the cent. Used for the admin price field (USD-only)
// and for comparing euro prices against dollar price filters.
export const eurToUsd = (eur: number) => Math.round(eur * EUR_USD_RATE * 100) / 100;

export type TotalsByCurrency = { USD: number; EUR: number };

export const emptyTotals = (): TotalsByCurrency => ({ USD: 0, EUR: 0 });

// The order-level currency. MIXED means the order holds both dollars and
// euros; the exact split lives in the order's per-currency totals (and in
// the order emails), because the orders table keeps a single total column.
export type OrderCurrency = Currency | "MIXED";

export function orderCurrencyOf(totals: TotalsByCurrency): OrderCurrency {
  if (totals.USD > 0 && totals.EUR > 0) return "MIXED";
  if (totals.EUR > 0) return "EUR";
  return "USD";
}
