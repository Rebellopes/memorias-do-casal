import { NextResponse } from 'next/server';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuario = searchParams.get('usuario') || 'default';
  const siteUrl = new URL(request.url).origin;
  const spotifyUrl = getSpotifyAuthUrl(usuario, siteUrl);

  return NextResponse.json({ url: spotifyUrl });
}
