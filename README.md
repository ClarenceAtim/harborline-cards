# Harborline Cards (demo trading-card store)

Independent educational recreation of a sports/TCG storefront. Not affiliated with Midwest Cards or any manufacturer.
Stack: Next.js 15 (App Router) · TypeScript · React 19 · Tailwind CSS 3 · Supabase (orders) · Resend (email) · Vercel.

## Status: read this first

| Area | State |
|---|---|
| Source code for all pages, cart, checkout, API, SQL, email | Written |
| `npm install` / `next build` / browser testing | **NOT run.** The build environment blocked the npm registry. Run `npm install && npm run build` first and fix anything it reports. |
| Pure logic (catalog, filters, validation, order numbers) | Tested with a script: 19 checks pass |
| Supabase persistence, Resend email | Built but **untested** (no credentials) |
| Product photos | Placeholders until you run `npm run images` (see "Images") |

## Run locally
```bash
npm install
cp .env.example .env.local     # fill in later; the site runs without it
npm run dev                    # http://localhost:3000
npm run build                  # must pass before you deploy
```
Without Supabase configured, orders work in development only, held in memory, and the confirmation page says they were NOT saved. In production, checkout returns "temporarily unavailable" until Supabase is configured.

## Catalog
`lib/products.ts` is the single source. 61 products across baseball, basketball, football, soccer, hockey, other sports, Pokémon, Magic, One Piece, Yu-Gi-Oh!, Dragon Ball. Names and prices come from midwestcards.com listings retrieved 2026-10-09 (prices change; re-verify). **Unverified:** stock (placeholder 10 each), most `year` values for Pokémon/Panini rows, descriptions (generic), and the shortened name "Pitch Black Build & Battle Box". Stock is verified for the 10 soccer / One Piece / Dragon Ball products added on 2026-10-09 (most are genuinely sold out, which also exercises the out-of-stock behaviour). Memorabilia, apparel and supplies have no verified listings, so they are hidden from menus until you add products. The Chaos Origins price showed $89.95 on its own page but $99.95 elsewhere; re-check it.
Note: your brief listed "2026 Topps Prizm Baseball Hobby Blaster Box"; the reference site lists it as **2026 Panini Prizm Baseball Hobby Blaster Box** ($32.95), so that is what the catalog uses.

## Images (real product photos)
The catalog ships with packaging-style placeholders because the build environment could not download images. To pull real photos onto your machine:
```bash
npm run images        # = node scripts/fetch-images.mjs  (needs internet)
npm run dev
```
It reads `scripts/image-sources.json` (a direct image URL **or** a product page URL per product; the page's `og:image` is used), saves files to `public/products/`, and writes `lib/images.generated.json`, which the catalog reads automatically. 11 entries have sources I found; the rest are guesses on the reference site and may fail. The script prints which failed. For those, edit that product's `"source"` (paste an official manufacturer or retailer product page URL) and re-run. Missing photos fall back to the placeholder.
Photos belong to their owners: fine for the class demo, use licensed images for a live store.

## Environment variables (all server-only)
| Variable | Purpose |
|---|---|
| `SITE_URL` | Public URL (sitemap, metadata) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server key. Never prefix with `NEXT_PUBLIC_` |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | e.g. `Harborline Cards <orders@yourdomain.com>` |
| `SELLER_EMAIL` | Inbox that receives new-order emails (you will supply this) |
| `ADMIN_TOKEN` | 16+ char random secret for the retry endpoint |

## Database (Supabase)
1. Create a free project at supabase.com.
2. SQL Editor: paste and run `supabase/schema.sql`. It creates `orders` and `order_items`, enables Row Level Security with **no policies** (anon and logged-out users cannot read or write anything), and revokes public grants.
3. Project Settings > API: copy the Project URL and the `service_role` key into the env vars.
4. Order management: use Table Editor > `orders` to read orders and change `status` (pending → awaiting_payment → paid → processing → shipped → completed, or cancelled). No public admin page exists on purpose, so no customer data is exposed. Mark `paid` only after you have verified payment.

## Email (Resend)
1. Create an account at resend.com and an API key.
2. Sending to anyone other than yourself requires a verified domain: Resend > Domains > add DNS records, wait for verification. Until then Resend only allows its test sender to your own account email.
3. Set `EMAIL_FROM` to an address on that domain, `SELLER_EMAIL` to the seller inbox.
4. Each order sends a seller notification and a customer acknowledgement. Results are stored in `orders.seller_email_status` / `customer_email_status` (`sent`, `failed`, `skipped`) with `email_error`. An order is never lost if email fails.
5. Retry failed or skipped emails:
```bash
curl -X POST https://YOUR-SITE/api/admin/retry-emails -H "Authorization: Bearer $ADMIN_TOKEN"
```

## Payment methods
`lib/config.ts` → `paymentMethods`. Only `bank_transfer` is enabled; enable others only if you really support them. No card data is ever collected.

## Security notes
- Prices, stock and totals are recomputed server-side from the catalog; browser prices are ignored.
- Double-submit protection: client lock + idempotency key (unique in the DB).
- Spam: honeypot field + 5 requests / 10 min / IP. The limiter is per serverless instance only, so add Vercel Firewall rate limiting for real protection.
- Confirmation page reads the order from the buyer's own session; there is no public order lookup.

## GitHub
```bash
cd harborline
git init && git add . && git commit -m "Initial store"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```
`.env*` files are git-ignored.

## Vercel
1. vercel.com > Add New > Project > import the GitHub repo (framework auto-detects Next.js).
2. Add the env vars above (Production and Preview).
3. Deploy. Then set `SITE_URL` to the final domain and redeploy.
4. Smoke test: browse, add to cart, refresh (cart persists), place an order, check the Supabase row and emails.

## Your to-do list
1. `npm install && npm run build`; fix any reported errors.
2. Create Supabase project, run the SQL, add keys.
3. Set up Resend + domain, supply `SELLER_EMAIL`, `EMAIL_FROM`.
4. Add real product photos; re-verify prices, years and stock.
5. Replace demo text on About / Contact / Shipping / FAQ / Privacy / Terms (have legal pages reviewed).
6. Fill `lib/releases.ts` with real release dates.
7. Decide which payment methods you truly support.
