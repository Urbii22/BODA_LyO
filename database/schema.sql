create table weddings (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  couple_name   text not null,
  title         text not null,
  wedding_date  date,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table missions (
  id          uuid primary key default gen_random_uuid(),
  wedding_id  uuid not null references weddings(id) on delete cascade,
  title       text not null,
  description text not null,
  points      integer not null check (points > 0),
  difficulty  text not null check (difficulty in ('easy','medium','hard','epic')),
  category    text not null check (category in ('social','photo','dance','emotional','funny')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table tables (
  id            uuid primary key default gen_random_uuid(),
  wedding_id    uuid not null references weddings(id) on delete cascade,
  code          text not null,
  name          text not null,
  display_order integer not null default 0,
  mission_id    uuid references missions(id),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (wedding_id, code)
);

create table submissions (
  id               uuid primary key default gen_random_uuid(),
  wedding_id       uuid not null references weddings(id) on delete cascade,
  table_id         uuid not null references tables(id) on delete cascade,
  mission_id       uuid not null references missions(id),
  participant_name text not null check (char_length(participant_name) between 2 and 80),
  comment          text check (char_length(comment) <= 500),
  media_path       text not null,
  status           text not null default 'pending' check (status in ('pending','approved','rejected')),
  awarded_points   integer not null default 0 check (awarded_points >= 0),
  admin_note       text,
  created_at       timestamptz not null default now(),
  reviewed_at      timestamptz,
  updated_at       timestamptz not null default now()
);

create table push_subscriptions (
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

create index idx_tables_wedding_code on tables (wedding_id, code);
create index idx_submissions_status on submissions (wedding_id, status, created_at desc);
create index idx_submissions_table on submissions (table_id, created_at desc);
create index idx_push_subscriptions_table on push_subscriptions (table_id, updated_at desc);

create view ranking_view with (security_invoker = true) as
select
  t.id as table_id,
  t.wedding_id,
  t.name as table_name,
  t.code as table_code,
  t.display_order,
  coalesce(sum(s.awarded_points) filter (where s.status = 'approved'), 0) as total_points,
  count(s.id) filter (where s.status = 'approved') as approved_count,
  min(s.reviewed_at) filter (where s.status = 'approved') as first_approved_at
from tables t
left join submissions s on s.table_id = t.id
group by t.id;

alter table weddings enable row level security;
alter table missions enable row level security;
alter table tables enable row level security;
alter table submissions enable row level security;
alter table push_subscriptions enable row level security;
grant select, insert, update, delete on table push_subscriptions to service_role;
revoke all on ranking_view from anon, authenticated;
