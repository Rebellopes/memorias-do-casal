import { NextResponse } from 'next/server';
import { exchangeSpotifyCode } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const usuario = searchParams.get('state') || 'default';
  const siteUrl = new URL(request.url).origin;

  if (!code) {
    return new Response('No code provided', { status: 400 });
  }

  const success = await exchangeSpotifyCode(code, usuario, siteUrl);
  if (!success) {
    return new Response('Failed to exchange code', { status: 500 });
  }

  return NextResponse.redirect(new URL('/admin', siteUrl));
}
