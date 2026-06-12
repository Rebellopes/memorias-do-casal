import { NextResponse } from 'next/server';
import { syncGooglePhotos } from '@/lib/google-photos';
import { getSetting } from '@/lib/settings';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const albumId = body.albumId || process.env.GOOGLE_ALBUM_ID || undefined;
  const albumUrl = body.albumUrl || await getSetting('google_album_url') || undefined;

  const result = await syncGooglePhotos(albumId, albumUrl);
  return NextResponse.json(result);
}
