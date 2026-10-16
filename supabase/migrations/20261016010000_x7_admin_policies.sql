-- X7 External: RLS boundaries for remote config and aggregated request statistics.
-- Admin membership is only manageable by project owners through the SQL editor/dashboard.
create table if not exists public.x7_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.x7_admins enable row level security;
alter table public.x7_app_config enable row level security;
alter table public.x7_request_stats enable row level security;
revoke all on public.x7_admins from anon, authenticated;
grant select on public.x7_admins to authenticated;
create policy "admins can verify own membership" on public.x7_admins
  for select to authenticated using (user_id = (select auth.uid()));
-- Public clients may read non-secret remote config; only listed admins may mutate it.
grant select on public.x7_app_config to anon, authenticated;
grant insert, update, delete on public.x7_app_config to authenticated;
create policy "remote config readable" on public.x7_app_config
  for select to anon, authenticated using (true);
create policy "admins insert remote config" on public.x7_app_config
  for insert to authenticated with check (exists(select 1 from public.x7_admins a where a.user_id=(select auth.uid())));
create policy "admins update remote config" on public.x7_app_config
  for update to authenticated using (exists(select 1 from public.x7_admins a where a.user_id=(select auth.uid())))
  with check (exists(select 1 from public.x7_admins a where a.user_id=(select auth.uid())));
create policy "admins delete remote config" on public.x7_app_config
  for delete to authenticated using (exists(select 1 from public.x7_admins a where a.user_id=(select auth.uid())));
-- Aggregated statistics are admin-readable only. No direct public inserts to avoid forged metrics.
revoke all on public.x7_request_stats from anon, authenticated;
grant select on public.x7_request_stats to authenticated;
create policy "admins read request stats" on public.x7_request_stats
  for select to authenticated using (exists(select 1 from public.x7_admins a where a.user_id=(select auth.uid())));
