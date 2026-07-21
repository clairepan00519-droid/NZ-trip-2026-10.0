-- 在 Supabase SQL Editor 執行一次。可重複執行。
create table if not exists public.nz_sync (
  key text primary key,
  value text not null,
  updated_at timestamptz not null default now()
);

alter table public.nz_sync enable row level security;

drop policy if exists "public read" on public.nz_sync;
drop policy if exists "public write" on public.nz_sync;
drop policy if exists "public update" on public.nz_sync;
create policy "public read" on public.nz_sync for select using (true);
create policy "public write" on public.nz_sync for insert with check (true);
create policy "public update" on public.nz_sync for update using (true) with check (true);

do $$ begin
  alter publication supabase_realtime add table public.nz_sync;
exception when duplicate_object then null;
end $$;
