create table if not exists push_subscriptions (
  id             uuid primary key default gen_random_uuid(),
  wedding_id     uuid not null references weddings(id) on delete cascade,
  table_id       uuid not null references tables(id) on delete cascade,
  endpoint       text not null unique,
  subscription   jsonb not null,
  user_agent     text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  last_seen_at   timestamptz not null default now()
);

create index if not exists idx_push_subscriptions_table
  on push_subscriptions (table_id, updated_at desc);

alter table push_subscriptions enable row level security;
grant select, insert, update, delete on table push_subscriptions to service_role;
