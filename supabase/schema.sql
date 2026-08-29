-- Geometry MVP database schema
-- Run this against the Supabase project used by the Geometry Vercel deployment.

create table if not exists public.artworks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'Untitled structure' check (char_length(title) between 1 and 80),
  dimension smallint not null default 3 check (dimension between 2 and 4),
  points jsonb not null default '[]'::jsonb check (jsonb_typeof(points) = 'array'),
  edges jsonb not null default '[]'::jsonb check (jsonb_typeof(edges) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists artworks_user_id_updated_at_idx
  on public.artworks (user_id, updated_at desc);

alter table public.artworks enable row level security;

-- New Supabase projects may not expose SQL-created tables to the Data API automatically.
-- Grant only what the Geometry browser client needs. RLS still controls row access.
revoke all on table public.artworks from anon;
grant select, insert, update, delete on table public.artworks to authenticated;
grant select, insert, update, delete on table public.artworks to service_role;

drop policy if exists "Users can view their own artworks" on public.artworks;
create policy "Users can view their own artworks"
  on public.artworks
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create their own artworks" on public.artworks;
create policy "Users can create their own artworks"
  on public.artworks
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own artworks" on public.artworks;
create policy "Users can update their own artworks"
  on public.artworks
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own artworks" on public.artworks;
create policy "Users can delete their own artworks"
  on public.artworks
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);
