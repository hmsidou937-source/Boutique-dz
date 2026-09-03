-- =====================================================================
-- DZ STORE — Supabase schema
-- Run this in Supabase SQL editor (Project > SQL Editor > New query)
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- CATEGORIES
-- ---------------------------------------------------------------------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_fr text not null,
  slug text unique not null,
  image_url text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- PRODUCTS
-- ---------------------------------------------------------------------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name_ar text not null,
  name_fr text not null,
  slug text unique not null,
  description_ar text,
  description_fr text,
  specs jsonb default '[]'::jsonb,          -- [{ "label_ar":"", "label_fr":"", "value_ar":"", "value_fr":"" }]
  category_id uuid references categories(id) on delete set null,
  price numeric(12,2) not null,
  old_price numeric(12,2),
  stock int not null default 0,
  colors text[] default '{}',
  sizes text[] default '{}',
  images text[] default '{}',               -- Supabase storage public URLs
  is_active boolean not null default true,
  is_featured boolean not null default false,
  rating numeric(2,1) default 0,
  rating_count int default 0,
  created_at timestamptz not null default now()
);

create index if not exists idx_products_category on products(category_id);
create index if not exists idx_products_active on products(is_active);
create index if not exists idx_products_search on products
  using gin (to_tsvector('simple', coalesce(name_ar,'') || ' ' || coalesce(name_fr,'') || ' ' || coalesce(sku,'')));

-- ---------------------------------------------------------------------
-- PRODUCT REVIEWS
-- ---------------------------------------------------------------------
create table if not exists product_reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating int not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- WILAYAS / COMMUNES / DELIVERY PRICING  (fully editable, no hardcoded prices)
-- ---------------------------------------------------------------------
create table if not exists wilayas (
  id serial primary key,
  code text unique not null,       -- e.g. "16"
  name_ar text not null,
  name_fr text not null
);

create table if not exists communes (
  id uuid primary key default gen_random_uuid(),
  wilaya_id int references wilayas(id) on delete cascade,
  name_ar text not null,
  name_fr text not null,
  home_price numeric(10,2) not null default 0,
  office_price numeric(10,2) not null default 0,
  delivery_days_min int default 1,
  delivery_days_max int default 3,
  carrier text,                    -- e.g. "Yalidine", "ZR Express"
  is_active boolean not null default true
);

create index if not exists idx_communes_wilaya on communes(wilaya_id);

-- ---------------------------------------------------------------------
-- CUSTOMERS  (optional accounts; guest checkout also supported)
-- ---------------------------------------------------------------------
create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid references auth.users(id) on delete set null,
  full_name text,
  phone text,
  email text,
  wilaya_id int references wilayas(id),
  commune_id uuid references communes(id),
  address text,
  created_at timestamptz not null default now()
);

create table if not exists customer_addresses (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  label text,
  full_name text,
  phone text,
  wilaya_id int references wilayas(id),
  commune_id uuid references communes(id),
  address text,
  is_default boolean default false
);

create table if not exists wishlist_items (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (customer_id, product_id)
);

-- ---------------------------------------------------------------------
-- ORDERS
-- ---------------------------------------------------------------------
create type order_status as enum (
  'new', 'confirming', 'confirmed', 'shipping', 'delivered', 'cancelled', 'returned'
);

create type delivery_method as enum ('home', 'office');

create sequence if not exists order_number_seq start 1000;

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text unique not null default (
    'DZ-' || nextval('order_number_seq')::text || '-' || upper(substr(encode(gen_random_bytes(3), 'hex'), 1, 5))
  ),
  customer_id uuid references customers(id),
  full_name text not null,
  phone text not null,
  wilaya_id int references wilayas(id) not null,
  commune_id uuid references communes(id) not null,
  address text,
  notes text,
  delivery_method delivery_method not null default 'home',
  delivery_price numeric(10,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  total numeric(12,2) not null default 0,
  status order_status not null default 'new',
  payment_method text not null default 'cod',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_phone on orders(phone);
create index if not exists idx_orders_created on orders(created_at);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  product_name text not null,
  unit_price numeric(12,2) not null,
  quantity int not null,
  color text,
  size text
);

-- ---------------------------------------------------------------------
-- STORE SETTINGS  (single row, edited from /admin/settings — never hardcode)
-- ---------------------------------------------------------------------
create table if not exists store_settings (
  id int primary key default 1,
  store_name text default 'DZ Store',
  logo_url text,
  favicon_url text,
  primary_color text default '#ea580c',
  currency text default 'DZD',
  phone text,
  whatsapp text,
  email text,
  address text,
  facebook_url text,
  instagram_url text,
  tiktok_url text,
  delivery_policy_ar text,
  delivery_policy_fr text,
  return_policy_ar text,
  return_policy_fr text,
  privacy_policy_ar text,
  privacy_policy_fr text,
  meta_pixel_id text,
  tiktok_pixel_id text,
  constraint single_row check (id = 1)
);
insert into store_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- updated_at trigger for orders
-- ---------------------------------------------------------------------
create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on orders;
create trigger trg_orders_updated_at before update on orders
for each row execute function set_updated_at();

-- =====================================================================
-- ROW LEVEL SECURITY
-- Public (anon) can read products/categories/wilayas/communes/settings
-- and INSERT orders (checkout). Everything else requires the service
-- role key, used only in server actions under src/app/admin/**.
-- =====================================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_reviews enable row level security;
alter table wilayas enable row level security;
alter table communes enable row level security;
alter table store_settings enable row level security;
alter table orders enable row level security;
alter table order_items enable row level security;
alter table customers enable row level security;
alter table customer_addresses enable row level security;
alter table wishlist_items enable row level security;

create policy "public read categories" on categories for select using (true);
create policy "public read active products" on products for select using (is_active = true);
create policy "public read reviews" on product_reviews for select using (true);
create policy "public insert reviews" on product_reviews for insert with check (true);
create policy "public read wilayas" on wilayas for select using (true);
create policy "public read communes" on communes for select using (is_active = true);
create policy "public read settings" on store_settings for select using (true);

-- Guests can create orders + order items (checkout). Orders/order_items
-- are NOT publicly readable via the anon key (that would let anyone
-- list every customer's name/phone/address). The order-confirmation
-- page and the "track my order" page instead go through a server
-- action that uses the service-role key and only ever returns the one
-- order matching an exact order_number (+ phone for tracking), never a
-- list. See src/app/order-confirmation and src/app/account/orders.
create policy "public insert orders" on orders for insert with check (true);
create policy "public insert order items" on order_items for insert with check (true);

-- Logged-in customers can see their own orders directly (used for the
-- "My orders" list when signed in).
create policy "customers read own orders" on orders
  for select using (
    exists (select 1 from customers c where c.id = orders.customer_id and c.auth_user_id = auth.uid())
  );
create policy "customers read own order items" on order_items
  for select using (
    exists (
      select 1 from orders o
      join customers c on c.id = o.customer_id
      where o.id = order_items.order_id and c.auth_user_id = auth.uid()
    )
  );

-- Customers can manage only their own rows (requires Supabase Auth)
create policy "customers manage own row" on customers
  for all using (auth.uid() = auth_user_id) with check (auth.uid() = auth_user_id);
create policy "customers manage own addresses" on customer_addresses
  for all using (exists (select 1 from customers c where c.id = customer_id and c.auth_user_id = auth.uid()));
create policy "customers manage own wishlist" on wishlist_items
  for all using (exists (select 1 from customers c where c.id = customer_id and c.auth_user_id = auth.uid()));

-- NOTE: Admin dashboard pages (src/app/admin/**) use the Supabase
-- SERVICE ROLE key on the server only (see src/lib/supabase/admin.ts),
-- which bypasses RLS. Never expose that key to the browser.

-- =====================================================================
-- SEED: a couple of wilayas/communes to get started (add the rest from
-- the admin panel or extend this list — all 58 wilayas follow the same
-- pattern).
-- =====================================================================
insert into wilayas (code, name_ar, name_fr) values
  ('16', 'الجزائر', 'Alger'),
  ('31', 'وهران', 'Oran'),
  ('25', 'قسنطينة', 'Constantine')
on conflict (code) do nothing;

insert into communes (wilaya_id, name_ar, name_fr, home_price, office_price, carrier)
select w.id, 'باب الزوار', 'Bab Ezzouar', 500, 350, 'Yalidine'
from wilayas w where w.code = '16'
on conflict do nothing;

insert into communes (wilaya_id, name_ar, name_fr, home_price, office_price, carrier)
select w.id, 'وسط المدينة', 'Centre Ville', 600, 400, 'Yalidine'
from wilayas w where w.code = '31'
on conflict do nothing;
