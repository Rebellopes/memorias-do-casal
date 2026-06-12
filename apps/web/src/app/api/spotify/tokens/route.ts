import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const usuario = searchParams.get('usuario');

  if (!usuario) {
    return NextResponse.json({ error: 'Missing usuario' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('integration_tokens')
    .delete()
    .eq('provider', 'spotify')
    .eq('usuario', usuario);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
