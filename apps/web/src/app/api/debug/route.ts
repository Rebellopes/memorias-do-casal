import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const checks: Record<string, unknown> = {};

  checks.supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'missing';
  checks.serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ? 'set' : 'missing';
  checks.spotifyClientId = process.env.SPOTIFY_CLIENT_ID ? 'set' : 'missing';
  checks.spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET ? 'set' : 'missing';

  const { data: tokens, error: queryError } = await supabaseAdmin
    .from('integration_tokens')
    .select('*')
    .eq('provider', 'spotify');

  checks.tokens = tokens;
  checks.queryError = queryError;

  const { error: deleteBadError } = await supabaseAdmin
    .from('integration_tokens')
    .delete()
    .eq('provider', 'spotify')
    .in('usuario', ['Pessoa+A', 'Pessoa+B', 'default', '__test__']);

  checks.deletedBadTokens = !deleteBadError;
  checks.deleteBadError = deleteBadError;

  const { error: insertError } = await supabaseAdmin
    .from('integration_tokens')
    .upsert(
      {
        provider: 'spotify',
        usuario: '__test__',
        access_token: 'test',
        refresh_token: 'test',
        expires_at: new Date(Date.now() + 3600000).toISOString(),
      },
      { onConflict: 'provider,usuario' },
    );

  checks.insertError = insertError;

  if (!insertError) {
    await supabaseAdmin
      .from('integration_tokens')
      .delete()
      .eq('provider', 'spotify')
      .eq('usuario', '__test__');
  }

  return NextResponse.json(checks);
}
