import { supabaseAdmin } from './supabase-admin';

const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API = 'https://api.spotify.com/v1';

function getBasicAuth() {
  const id = process.env.SPOTIFY_CLIENT_ID!;
  const secret = process.env.SPOTIFY_CLIENT_SECRET!;
  return Buffer.from(`${id}:${secret}`).toString('base64');
}

export async function getSpotifyTokens(usuario: string) {
  const { data, error } = await supabaseAdmin
    .from('integration_tokens')
    .select('*')
    .eq('provider', 'spotify')
    .eq('usuario', usuario)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function refreshSpotifyToken(refreshToken: string) {
  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${getBasicAuth()}`,
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<{
    access_token: string;
    expires_in: number;
  }>;
}

export async function getValidSpotifyToken(usuario: string) {
  const tokens = await getSpotifyTokens(usuario);
  if (!tokens) return null;

  const now = new Date();
  const expiresAt = new Date(tokens.expires_at);

  if (now >= expiresAt) {
    const refreshed = await refreshSpotifyToken(tokens.refresh_token);
    if (!refreshed) return null;

    const newExpires = new Date(now.getTime() + refreshed.expires_in * 1000);

    await supabaseAdmin
      .from('integration_tokens')
      .update({
        access_token: refreshed.access_token,
        expires_at: newExpires.toISOString(),
      })
      .eq('id', tokens.id);

    return refreshed.access_token;
  }

  return tokens.access_token;
}

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string; images: { url: string }[] };
  external_urls: { spotify: string };
}

interface SpotifyCurrentlyPlaying {
  is_playing: boolean;
  item: SpotifyTrack | null;
}

interface SpotifyRecentlyPlayed {
  items: {
    track: SpotifyTrack;
    played_at: string;
  }[];
}

export async function fetchSpotifyStatus(usuario: string) {
  const token = await getValidSpotifyToken(usuario);
  if (!token) return null;

  const [currentRes, recentRes] = await Promise.all([
    fetch(`${SPOTIFY_API}/me/player/currently-playing`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
    fetch(`${SPOTIFY_API}/me/player/recently-played?limit=1`, {
      headers: { Authorization: `Bearer ${token}` },
    }),
  ]);

  if (currentRes.status === 200) {
    const data = (await currentRes.json()) as SpotifyCurrentlyPlaying;
    if (data.is_playing && data.item) {
      return {
        musica: data.item.name,
        artista: data.item.artists.map((a) => a.name).join(', '),
        album: data.item.album.name,
        capa: data.item.album.images[0]?.url ?? '',
        reproduzindo_agora: true,
        ultima_reproducao: null,
      };
    }
  }

  if (recentRes.status === 200) {
    const data = (await recentRes.json()) as SpotifyRecentlyPlayed;
    const last = data.items[0];
    if (last) {
      return {
        musica: last.track.name,
        artista: last.track.artists.map((a) => a.name).join(', '),
        album: last.track.album.name,
        capa: last.track.album.images[0]?.url ?? '',
        reproduzindo_agora: false,
        ultima_reproducao: last.played_at,
      };
    }
  }

  return null;
}

export function getSpotifyAuthUrl(usuario: string, siteUrl?: string) {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = `${siteUrl || process.env.NEXT_PUBLIC_SITE_URL}/api/spotify/callback`;
  const scopes = 'user-read-currently-playing user-read-recently-played';

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: scopes,
    state: usuario,
  });

  return `https://accounts.spotify.com/authorize?${params}`;
}

export async function exchangeSpotifyCode(code: string, usuario: string, siteUrl?: string) {
  const redirectUri = `${siteUrl || process.env.NEXT_PUBLIC_SITE_URL}/api/spotify/callback`;

  const res = await fetch(SPOTIFY_TOKEN_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${getBasicAuth()}`,
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  const { error } = await supabaseAdmin.from('integration_tokens').upsert(
    {
      provider: 'spotify',
      usuario,
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: 'provider,usuario' },
  );

  return error ? null : true;
}
