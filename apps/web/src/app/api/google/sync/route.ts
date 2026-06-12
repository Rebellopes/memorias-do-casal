import { NextResponse } from 'next/server';
import { syncGooglePhotos } from '@/lib/google-photos';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const albumId = body.albumId || process.env.GOOGLE_ALBUM_ID || undefined;
  const result = await syncGooglePhotos(albumId);
  return NextResponse.json(result);
}
