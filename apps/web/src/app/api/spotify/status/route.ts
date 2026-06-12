import { NextResponse } from 'next/server';
import { fetchSpotifyStatus } from '@/lib/spotify';

export async function GET() {
  const pessoas = ['Pessoa A', 'Pessoa B'];

  const results = await Promise.allSettled(
    pessoas.map(async (usuario) => {
      const status = await fetchSpotifyStatus(usuario);
      return { usuario, status };
    }),
  );

  const data = results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => (r as PromiseFulfilledResult<{ usuario: string; status: unknown }>).value);

  return NextResponse.json(data);
}
