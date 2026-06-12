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

export function getGoogleAuthUrl(siteUrl?: string) {
  const redirectUri = `${siteUrl || process.env.NEXT_PUBLIC_SITE_URL}/api/google/callback`;

  const scope = [
    'https://www.googleapis.com/auth/photoslibrary',
    'https://www.googleapis.com/auth/photoslibrary.sharing',
  ].join(' ');

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope,
    access_type: 'offline',
    prompt: 'consent',
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
}

export async function exchangeGoogleCode(code: string, siteUrl?: string) {
  const redirectUri = `${siteUrl || process.env.NEXT_PUBLIC_SITE_URL}/api/google/callback`;

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

export interface GoogleAlbum {
  id: string;
  title: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl?: string;
}

interface GoogleAlbumsResponse {
  albums?: GoogleAlbum[];
  nextPageToken?: string;
}

export async function listAlbums(): Promise<{ albums: GoogleAlbum[]; error?: string }> {
  const token = await getValidGoogleToken();
  if (!token) return { albums: [], error: 'Not authenticated' };

  const allAlbums: GoogleAlbum[] = [];
  let nextPageToken: string | undefined;

  do {
    const params = new URLSearchParams({ pageSize: '50' });
    if (nextPageToken) params.set('pageToken', nextPageToken);

    const res = await fetch(`${GOOGLE_PHOTOS_API}/albums?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) return { albums: allAlbums, error: 'Failed to list albums' };

    const data = (await res.json()) as GoogleAlbumsResponse;
    if (data.albums) allAlbums.push(...data.albums);
    nextPageToken = data.nextPageToken;
  } while (nextPageToken);

  return { albums: allAlbums };
}

export async function resolveGoogleUrl(input: string): Promise<{ type: 'albumId' | 'shareToken'; value: string } | undefined> {
  const url = input.trim();

  const albumIdPattern = /^[A-Za-z0-9_-]{20,}$/;
  if (albumIdPattern.test(url) && !url.includes('/')) {
    return { type: 'albumId', value: url };
  }

  const albumMatch = url.match(/\/album\/([A-Za-z0-9_-]+)/);
  if (albumMatch?.[1]) return { type: 'albumId', value: albumMatch[1] };

  const shareMatch = url.match(/\/share\/([A-Za-z0-9_-]+)/);
  if (shareMatch?.[1]) return { type: 'shareToken', value: shareMatch[1] };

  if (url.includes('goo.gl') || url.includes('photos.app.goo.gl')) {
    try {
      const res = await fetch(url, { method: 'HEAD', redirect: 'follow' });
      const resolved = res.url;
      const sm = resolved.match(/\/share\/([A-Za-z0-9_-]+)/);
      if (sm?.[1]) return { type: 'shareToken', value: sm[1] };
      const am = resolved.match(/\/album\/([A-Za-z0-9_-]+)/);
      if (am?.[1]) return { type: 'albumId', value: am[1] };
    } catch {
      return undefined;
    }
  }

  return undefined;
}

export async function joinSharedAlbum(shareToken: string): Promise<string | undefined> {
  const token = await getValidGoogleToken();
  if (!token) return undefined;

  const res = await fetch(`${GOOGLE_PHOTOS_API}/sharedAlbums:join`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ shareToken }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error(`Failed to join shared album (${res.status}): ${body}`);
    return undefined;
  }

  const data = await res.json() as { album: { id: string } };
  return data.album?.id;
}

export async function syncGooglePhotos(albumId?: string, albumUrl?: string): Promise<{ synced: number; error?: string }> {
  const token = await getValidGoogleToken();
  if (!token) return { synced: 0, error: 'Não conectado ao Google Fotos' };

  let resolvedId = albumId;

  if (!resolvedId && albumUrl) {
    const result = await resolveGoogleUrl(albumUrl);
    if (!result) {
      return { synced: 0, error: 'Não foi possível interpretar o link do álbum. Use o link de compartilhamento do Google Fotos.' };
    }
    if (result.type === 'albumId') {
      resolvedId = result.value;
    } else {
      const joined = await joinSharedAlbum(result.value);
      if (!joined) {
        return { synced: 0, error: 'Não foi possível acessar o álbum compartilhado. Certifique-se de que o link está correto e que você autorizou o acesso a álbuns compartilhados.' };
      }
      resolvedId = joined;
    }
  }

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
    if (resolvedId) body.albumId = resolvedId;
    if (nextPageToken) body.pageToken = nextPageToken;

    const res = await fetch(`${GOOGLE_PHOTOS_API}/mediaItems:search`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      return { synced, error: `Erro ao buscar fotos (${res.status})` };
    }

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
