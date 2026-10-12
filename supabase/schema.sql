-- Run this in Supabase: SQL Editor > New query > paste > Run.
-- Orders contain customer PII. RLS is ENABLED with NO policies, so the public anon/authenticated
-- keys cannot read or write anything. Only the server (service-role key, which bypasses RLS)
-- and logged-in dashboard users can access these tables.

create extension if not exists "pgcrypto";

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  idempotency_key text not null unique,
  status text not null default 'pending'
    check (status in ('pending','awaiting_payment','paid','processing','shipped','completed','cancelled')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  address_line text not null,
  city text not null,
  region text not null,
  postal_code text,
  country text not null,
  notes text,
  payment_method text not null
    check (payment_method in ('bank_transfer','paypal','mobile_money','cash_on_delivery')),
  subtotal_cents integer not null check (subtotal_cents >= 0),
  total_cents integer not null check (total_cents >= 0),
  currency text not null default 'USD',
  seller_email_status text not null default 'pending',   -- pending | sent | failed | skipped
  customer_email_status text not null default 'pending',
  email_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text not null,
  slug text not null,
  name text not null,
  unit_price_cents integer not null check (unit_price_cents >= 0),
  quantity integer not null check (quantity > 0),
  line_total_cents integer not null check (line_total_cents >= 0)
);

create index if not exists order_items_order_id_idx on public.order_items(order_id);
create index if not exists orders_created_at_idx on public.orders(created_at desc);
create index if not exists orders_email_status_idx on public.orders(seller_email_status, customer_email_status);

create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

-- Row Level Security: enabled, deliberately no policies => deny all for anon/authenticated.
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;
