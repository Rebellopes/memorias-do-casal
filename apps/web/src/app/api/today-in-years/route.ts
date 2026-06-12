import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';

export async function GET() {
  const now = new Date();
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const pad = (n: number) => n.toString().padStart(2, '0');
  const mmdd = `${pad(month)}-${pad(day)}`;

  const [events, photos, dedications] = await Promise.all([
    supabaseAdmin
      .from('events')
      .select('*')
      .filter('data_evento', 'like', `%-${mmdd}`),

    supabaseAdmin
      .from('photos')
      .select('*')
      .filter('data_foto', 'like', `%-${mmdd}`)
      .order('data_foto', { ascending: false }),

    supabaseAdmin
      .from('dedications')
      .select('*')
      .filter('created_at', 'like', `%-${mmdd}T%`)
      .order('created_at', { ascending: false }),
  ]);

  const timeline = [
    ...(events.data ?? []).map((e) => ({ ...e, tipo: 'evento' as const })),
    ...(photos.data ?? []).map((p) => ({ ...p, tipo: 'foto' as const })),
    ...(dedications.data ?? []).map((d) => ({ ...d, tipo: 'dedicatoria' as const })),
  ];

  timeline.sort((a, b) => {
    const getDate = (item: typeof timeline[number]) => {
      if ('data_evento' in item) return item.data_evento ?? '';
      if ('data_foto' in item) return item.data_foto ?? '';
      return item.created_at ?? '';
    };
    return getDate(b).localeCompare(getDate(a));
  });

  return NextResponse.json(timeline);
}
