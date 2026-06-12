import { NextResponse } from 'next/server';
import { exchangeSpotifyCode } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const errorParam = searchParams.get('error');
  const usuario = searchParams.get('state') || 'default';
  const siteUrl = new URL(request.url).origin;

  if (errorParam) {
    return new Response(`Spotify error: ${errorParam}`, { status: 400 });
  }

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const result = await exchangeSpotifyCode(code, usuario, siteUrl);
  if (result?.error) {
    return new Response(result.error, { status: 500 });
  }
  if (!result) {
    return new Response('Falha ao trocar código com Spotify', { status: 500 });
  }

  return NextResponse.redirect(new URL('/admin', siteUrl));
}
