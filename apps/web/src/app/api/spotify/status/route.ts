import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { fetchSpotifyStatus } from '@/lib/spotify';

export async function GET() {
  const { data: tokens } = await supabaseAdmin
    .from('integration_tokens')
    .select('usuario')
    .eq('provider', 'spotify');

  const pessoas = tokens?.map((t) => t.usuario) ?? [];

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
