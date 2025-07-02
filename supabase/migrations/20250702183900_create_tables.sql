-- baskets table
create table if not exists baskets (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rebalance_interval integer,
  current_price numeric,
  price_1h_change numeric,
  price_4h_change numeric,
  price_24h_change numeric,
  price_since_creation_change numeric,
  created_at timestamp with time zone default now()
);

-- tokens table
create table if not exists tokens (
  address text primary key,
  name text,
  symbol text,
  total_supply numeric,
  image_url text
);

-- basket_tokens table
create table if not exists basket_tokens (
  id uuid primary key default gen_random_uuid(),
  basket_id uuid references baskets(id) on delete cascade,
  address text references tokens(address) on delete cascade,
  symbol text,
  allocation numeric,
  unique (basket_id, address)
);

-- token_prices table
create table if not exists token_prices (
  id bigserial primary key,
  address text references tokens(address) on delete cascade,
  price numeric,
  timestamp timestamp with time zone not null default now()
);
create index if not exists idx_token_prices_address_timestamp on token_prices(address, timestamp desc);

-- basket_prices table
create table if not exists basket_prices (
  id bigserial primary key,
  basket_id uuid references baskets(id) on delete cascade,
  price numeric,
  timestamp timestamp with time zone not null default now()
);
create index if not exists idx_basket_prices_basket_id_timestamp on basket_prices(basket_id, timestamp desc);

-- feature_requests table
create table if not exists feature_requests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  votes integer default 0
);

-- increment_votes RPC
create or replace function increment_votes(feature_id uuid)
returns void as $$
begin
  update feature_requests set votes = votes + 1 where id = feature_id;
end;
$$ language plpgsql;