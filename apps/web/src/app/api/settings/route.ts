import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('key, value')
    .in('key', ['home_photo']);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings: Record<string, string> = {};
  data?.forEach((s) => { settings[s.key] = s.value; });

  return NextResponse.json(settings);
}

export async function PUT(req: Request) {
  const body = await req.json();
  const { key, value } = body;

  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'key and value are required' }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ [key]: value });
}
