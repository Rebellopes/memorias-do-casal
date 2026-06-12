import { redirect } from 'next/navigation';
import { getSpotifyAuthUrl } from '@/lib/spotify';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuario = searchParams.get('usuario') || 'default';
  redirect(getSpotifyAuthUrl(usuario));
}
