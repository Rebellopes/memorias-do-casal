import { NextResponse } from 'next/server';
import { syncGooglePhotos } from '@/lib/google-photos';
import { getSetting } from '@/lib/settings';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  let albumId = body.albumId || process.env.GOOGLE_ALBUM_ID || undefined;

  if (!albumId) {
    const savedUrl = await getSetting('google_album_url');
    if (savedUrl) albumId = extractAlbumId(savedUrl);
  }

  const result = await syncGooglePhotos(albumId);
  return NextResponse.json(result);
}

function extractAlbumId(input: string): string | undefined {
  if (/^[A-Za-z0-9_-]{20,}$/.test(input.trim()) && !input.includes('/')) {
    return input.trim();
  }

  const albumMatch = input.match(/\/album\/([A-Za-z0-9_-]+)/);
  if (albumMatch) return albumMatch[1];

  return undefined;
}

