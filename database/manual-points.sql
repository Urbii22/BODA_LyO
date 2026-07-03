alter table tables
  add column if not exists manual_points integer not null default 0;

drop view if exists ranking_view;

create view ranking_view with (security_invoker = true) as
select
  t.id as table_id,
  t.wedding_id,
  t.name as table_name,
  t.code as table_code,
  t.display_order,
  t.manual_points,
  coalesce(sum(s.awarded_points) filter (where s.status = 'approved'), 0) + t.manual_points as total_points,
  count(s.id) filter (where s.status = 'approved') as approved_count,
  min(s.reviewed_at) filter (where s.status = 'approved') as first_approved_at
from tables t
left join submissions s on s.table_id = t.id
group by t.id;

revoke all on ranking_view from anon, authenticated;
