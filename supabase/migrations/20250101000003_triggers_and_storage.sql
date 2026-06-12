-- ============================================================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'nome', 'Novo Usuário'));
  return new;
end;
$$;

-- Trigger the function every time a user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Allow public access to read photos
create policy "Photos are publicly accessible"
  on storage.objects for select
  using (bucket_id = 'photos');

-- Allow authenticated users to upload photos
create policy "Authenticated users can upload photos"
  on storage.objects for insert
  with check (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

-- Allow authenticated users to update photos
create policy "Authenticated users can update photos"
  on storage.objects for update
  using (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

-- Allow authenticated users to delete photos
create policy "Authenticated users can delete photos"
  on storage.objects for delete
  using (
    bucket_id = 'photos'
    and auth.role() = 'authenticated'
  );

-- ============================================================================
-- SPOTIFY STATUS AUTO-UPDATE timestamp
-- ============================================================================
create or replace function public.update_spotify_timestamp()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists on_spotify_status_updated on public.spotify_status;
create trigger on_spotify_status_updated
  before update on public.spotify_status
  for each row execute function public.update_spotify_timestamp();
