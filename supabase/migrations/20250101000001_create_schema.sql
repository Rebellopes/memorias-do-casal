-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================================
-- PROFILES
-- ============================================================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  foto text,
  bio text,
  curiosidades text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- STORY SECTIONS
-- ============================================================================
create table if not exists public.story_sections (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  conteudo text not null,
  ordem integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- PHOTOS
-- ============================================================================
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  data_foto date not null,
  favorita boolean not null default false,
  descricao text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- SPOTIFY STATUS
-- ============================================================================
create table if not exists public.spotify_status (
  id uuid primary key default gen_random_uuid(),
  usuario text not null,
  musica text not null,
  artista text not null,
  album text not null,
  capa text not null,
  reproduzindo_agora boolean not null default false,
  ultima_reproducao timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- DEDICATIONS
-- ============================================================================
create table if not exists public.dedications (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  texto text not null,
  imagem text,
  autor text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- EVENTS
-- ============================================================================
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data_evento date not null,
  imagem text,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- DAILY MESSAGES
-- ============================================================================
create table if not exists public.daily_messages (
  id uuid primary key default gen_random_uuid(),
  autor text not null,
  destinatario text not null,
  mensagem text not null,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- INDEXES
-- ============================================================================
create index if not exists idx_photos_data_foto on public.photos(data_foto desc);
create index if not exists idx_events_data_evento on public.events(data_evento desc);
create index if not exists idx_dedications_created_at on public.dedications(created_at desc);
create index if not exists idx_daily_messages_created_at on public.daily_messages(created_at desc);
create index if not exists idx_spotify_status_usuario on public.spotify_status(usuario);
create index if not exists idx_story_sections_ordem on public.story_sections(ordem);
