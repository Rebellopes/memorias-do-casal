import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get('file') as File;
  const data_foto = formData.get('data_foto') as string;

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
    .from('photos')
    .upload(fileName, file, { contentType: file.type });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('photos')
    .getPublicUrl(fileName);

  const url = publicUrl ?? '';

  const { data, error } = await supabaseAdmin
    .from('photos')
    .insert({ image_url: url, data_foto: data_foto || new Date().toISOString().slice(0, 10) })
    .select()
    .single();

  if (error) {
    await supabaseAdmin.storage.from('photos').remove([fileName]);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
