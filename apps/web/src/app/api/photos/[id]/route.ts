import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const { data, error } = await supabaseAdmin
    .from('photos')
    .update(body)
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data: photo } = await supabaseAdmin
    .from('photos')
    .select('image_url')
    .eq('id', id)
    .single();

  if (photo?.image_url) {
    const path = photo.image_url.split('/photos/')[1];
    if (path) await supabaseAdmin.storage.from('photos').remove([decodeURIComponent(path)]);
  }

  const { error } = await supabaseAdmin.from('photos').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
