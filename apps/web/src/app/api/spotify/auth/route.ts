import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuario = searchParams.get('usuario') || 'default';
  const siteUrl = new URL(request.url).origin;
  const spotifyUrl = getSpotifyAuthUrl(usuario, siteUrl);

  return new Response(
    `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${spotifyUrl}"><title>Redirecionando...</title></head><body><p>Redirecionando para o Spotify...</p></body></html>`,
    { headers: { 'Content-Type': 'text/html' } },
  );
}
