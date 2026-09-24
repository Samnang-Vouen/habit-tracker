-- Habit Tracker schema
-- Run this in the Supabase SQL Editor.

-- ============================================================
-- Tables
-- ============================================================

create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null check (char_length(trim(name)) > 0),
  created_at timestamptz not null default now()
);

create table if not exists public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid not null references public.habits (id) on delete cascade,
  log_date date not null,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

create index if not exists habits_user_id_idx on public.habits (user_id);
create index if not exists daily_logs_habit_id_idx on public.daily_logs (habit_id);
create index if not exists daily_logs_habit_id_log_date_idx on public.daily_logs (habit_id, log_date);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table public.habits enable row level security;
alter table public.daily_logs enable row level security;

-- habits policies: a user may only access their own habits.

create policy "habits_select_own"
  on public.habits for select
  using (auth.uid() = user_id);

create policy "habits_insert_own"
  on public.habits for insert
  with check (auth.uid() = user_id);

create policy "habits_update_own"
  on public.habits for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "habits_delete_own"
  on public.habits for delete
  using (auth.uid() = user_id);

-- daily_logs policies: a user may only access logs belonging to their own habits.

create policy "daily_logs_select_own"
  on public.daily_logs for select
  using (
    exists (
      select 1 from public.habits
      where habits.id = daily_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "daily_logs_insert_own"
  on public.daily_logs for insert
  with check (
    exists (
      select 1 from public.habits
      where habits.id = daily_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "daily_logs_update_own"
  on public.daily_logs for update
  using (
    exists (
      select 1 from public.habits
      where habits.id = daily_logs.habit_id
        and habits.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.habits
      where habits.id = daily_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

create policy "daily_logs_delete_own"
  on public.daily_logs for delete
  using (
    exists (
      select 1 from public.habits
      where habits.id = daily_logs.habit_id
        and habits.user_id = auth.uid()
    )
  );

-- ============================================================
-- Seed data
-- ============================================================
-- Seeding requires a real auth.users row. Create a test account first
-- (Supabase Dashboard -> Authentication -> Users -> Add user, or sign up
-- through the app), then run the block below with that user's id.
--
-- do $$
-- declare
--   test_user_id uuid := '00000000-0000-0000-0000-000000000000'; -- replace with a real auth.users id
--   habit1_id uuid;
--   habit2_id uuid;
-- begin
--   insert into public.habits (user_id, name) values (test_user_id, 'Morning Exercise') returning id into habit1_id;
--   insert into public.habits (user_id, name) values (test_user_id, 'Read 20 Minutes') returning id into habit2_id;
--
--   insert into public.daily_logs (habit_id, log_date, completed) values
--     (habit1_id, current_date, true),
--     (habit1_id, current_date - 1, true),
--     (habit2_id, current_date, false);
-- end $$;
