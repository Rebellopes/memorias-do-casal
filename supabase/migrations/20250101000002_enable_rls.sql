-- ============================================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================================
alter table if exists public.profiles enable row level security;
alter table if exists public.story_sections enable row level security;
alter table if exists public.photos enable row level security;
alter table if exists public.spotify_status enable row level security;
alter table if exists public.dedications enable row level security;
alter table if exists public.events enable row level security;
alter table if exists public.daily_messages enable row level security;

-- ============================================================================
-- PROFILES
-- ============================================================================
-- Everyone can read profiles
create policy "Profiles are publicly readable"
  on public.profiles for select
  using (true);

-- Only the owner (authenticated user) can update their profile
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Only authenticated users can insert profiles
create policy "Authenticated users can insert profiles"
  on public.profiles for insert
  with check (auth.role() = 'authenticated');

-- ============================================================================
-- STORY SECTIONS
-- ============================================================================
create policy "Story sections are publicly readable"
  on public.story_sections for select
  using (true);

create policy "Only authenticated users can insert story sections"
  on public.story_sections for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update story sections"
  on public.story_sections for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete story sections"
  on public.story_sections for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- PHOTOS
-- ============================================================================
create policy "Photos are publicly readable"
  on public.photos for select
  using (true);

create policy "Only authenticated users can insert photos"
  on public.photos for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update photos"
  on public.photos for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete photos"
  on public.photos for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- SPOTIFY STATUS
-- ============================================================================
create policy "Spotify status is publicly readable"
  on public.spotify_status for select
  using (true);

create policy "Only authenticated users can insert spotify status"
  on public.spotify_status for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update spotify status"
  on public.spotify_status for update
  using (auth.role() = 'authenticated');

-- ============================================================================
-- DEDICATIONS
-- ============================================================================
create policy "Dedications are publicly readable"
  on public.dedications for select
  using (true);

create policy "Only authenticated users can insert dedications"
  on public.dedications for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update dedications"
  on public.dedications for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete dedications"
  on public.dedications for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- EVENTS
-- ============================================================================
create policy "Events are publicly readable"
  on public.events for select
  using (true);

create policy "Only authenticated users can insert events"
  on public.events for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update events"
  on public.events for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete events"
  on public.events for delete
  using (auth.role() = 'authenticated');

-- ============================================================================
-- DAILY MESSAGES
-- ============================================================================
create policy "Daily messages are publicly readable"
  on public.daily_messages for select
  using (true);

create policy "Only authenticated users can insert daily messages"
  on public.daily_messages for insert
  with check (auth.role() = 'authenticated');

create policy "Only authenticated users can update daily messages"
  on public.daily_messages for update
  using (auth.role() = 'authenticated');

create policy "Only authenticated users can delete daily messages"
  on public.daily_messages for delete
  using (auth.role() = 'authenticated');
