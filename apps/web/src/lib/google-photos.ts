import { supabaseAdmin } from './supabase-admin';

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';
const GOOGLE_PHOTOS_API = 'https://photoslibrary.googleapis.com/v1';

export async function getGoogleTokens() {
  const { data, error } = await supabaseAdmin
    .from('integration_tokens')
    .select('*')
    .eq('provider', 'google_photos')
    .maybeSingle();

  if (error || !data) return null;
  return data;
}

async function refreshGoogleToken(refreshToken: string) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) return null;
  return res.json() as Promise<{ access_token: string; expires_in: number }>;
}

export async function getValidGoogleToken() {
  const tokens = await getGoogleTokens();
  if (!tokens) return null;

  const now = new Date();
  const expiresAt = new Date(tokens.expires_at);

  if (now >= expiresAt) {
    const refreshed = await refreshGoogleToken(tokens.refresh_token);
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

export function getGoogleAuthUrl() {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/google/callback`;

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code: string) {
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL}/api/google/callback`;

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  if (!data.refresh_token) return null;

  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  const { error } = await supabaseAdmin.from('integration_tokens').upsert(
    {
      provider: 'google_photos',
      usuario: 'default',
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: expiresAt.toISOString(),
    },
    { onConflict: 'provider,usuario' },
  );

  return error ? null : true;
}

interface GoogleMediaItem {
  id: string;
  filename: string;
  mimeType: string;
  mediaMetadata: {
    creationTime: string;
    width: string;
    height: string;
  };
  baseUrl: string;
}

interface GoogleMediaItemsResponse {
  mediaItems?: GoogleMediaItem[];
  nextPageToken?: string;
}

export async function syncGooglePhotos() {
  const token = await getValidGoogleToken();
  if (!token) return { synced: 0, error: 'Not authenticated' };

  let synced = 0;
  let nextPageToken: string | undefined;

  const { data: existing } = await supabaseAdmin
    .from('photos')
    .select('image_url')
    .eq('source', 'google_photos');

  const existingUrls = new Set(existing?.map((p) => p.image_url) ?? []);

  do {
    const body: Record<string, unknown> = {
      pageSize: 50,
    };
    if (nextPageToken) body.pageToken = nextPageToken;

    const res = await fetch(`${GOOGLE_PHOTOS_API}/mediaItems:search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) break;

    const data = (await res.json()) as GoogleMediaItemsResponse;
    nextPageToken = data.nextPageToken;

    if (!data.mediaItems) break;

    const newPhotos = data.mediaItems
      .filter((item) => item.mimeType.startsWith('image/'))
      .filter((item) => {
        const url = `${item.baseUrl}=d`;
        return !existingUrls.has(url);
      })
      .map((item) => ({
        image_url: `${item.baseUrl}=d`,
        data_foto: item.mediaMetadata.creationTime.slice(0, 10) || new Date().toISOString().slice(0, 10),
        source: 'google_photos' as const,
        descricao: item.filename,
      }));

    if (newPhotos.length > 0) {
      const { error } = await supabaseAdmin.from('photos').insert(newPhotos);
      if (!error) synced += newPhotos.length;
    }
  } while (nextPageToken);

  return { synced };
}
