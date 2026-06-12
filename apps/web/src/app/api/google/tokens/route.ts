import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function DELETE() {
  const { error } = await supabaseAdmin
    .from('integration_tokens')
    .delete()
    .eq('provider', 'google_photos');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
