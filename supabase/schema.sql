-- ============================================================
-- AI ATLAS — Supabase schema (auth + per-lesson progress)
-- Run this once in your Supabase project:
--   Dashboard → SQL Editor → New query → paste → Run
-- Safe to re-run (idempotent).
-- ============================================================

-- ---------- profiles: one row per auth user ----------------
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text,
  full_name  text,
  role       text not null default 'student',   -- reserved for future roles
  created_at timestamptz not null default now()
);

-- Auto-create a profile whenever a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- progress: one row per completed lesson ----------
create table if not exists public.progress (
  user_id    uuid not null references auth.users(id) on delete cascade,
  module     text not null,                      -- data-page id, e.g. 'deep-learning'
  lesson     text not null,                      -- tab/lesson id, e.g. 'nn'
  completed  boolean not null default true,
  source     text not null default 'manual',     -- 'manual' | 'auto'
  updated_at timestamptz not null default now(),
  primary key (user_id, module, lesson)
);

create index if not exists progress_user_idx on public.progress (user_id);

-- ---------- Row-Level Security: users see only their own ----
alter table public.profiles enable row level security;
alter table public.progress enable row level security;

drop policy if exists "own profile: select" on public.profiles;
create policy "own profile: select" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "own profile: update" on public.profiles;
create policy "own profile: update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "own profile: insert" on public.profiles;
create policy "own profile: insert" on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "own progress: all" on public.progress;
create policy "own progress: all" on public.progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
