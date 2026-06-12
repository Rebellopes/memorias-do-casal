-- ============================================================================
-- ADD SOURCE COLUMN TO PHOTOS
-- ============================================================================
alter table if exists public.photos
  add column if not exists source text not null default 'manual';

-- ============================================================================
-- INTEGRATION TOKENS
-- ============================================================================
create table if not exists public.integration_tokens (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('spotify', 'google_photos')),
  usuario text not null,
  access_token text not null,
  refresh_token text not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, usuario)
);

alter table if exists public.integration_tokens enable row level security;

create policy "Integration tokens are publicly readable"
  on public.integration_tokens for select
  using (true);

create policy "Only authenticated users can insert integration tokens"
  on public.integration_tokens for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update integration tokens"
  on public.integration_tokens for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete integration tokens"
  on public.integration_tokens for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- UPDATE SPOTIFY STATUS TRIGGER
-- ============================================================================
create or replace function public.update_integration_timestamp()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_integration_tokens_updated on public.integration_tokens;
create trigger on_integration_tokens_updated
  before update on public.integration_tokens
  for each row execute function public.update_integration_timestamp();
