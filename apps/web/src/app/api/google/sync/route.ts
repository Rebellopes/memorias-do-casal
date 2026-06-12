import { NextResponse } from 'next/server';
import { syncGooglePhotos } from '@/lib/google-photos';
import { getSetting } from '@/lib/settings';
import { supabaseAdmin } from '@/lib/supabase-admin';

const MIN_INTERVAL_MS = 60 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));

  const albumId = body.albumId || process.env.GOOGLE_ALBUM_ID || undefined;
  const albumUrl = body.albumUrl || await getSetting('google_album_url') || undefined;

  if (!body.force) {
    const lastSync = await getSetting('google_last_sync_at');
    if (lastSync) {
      const elapsed = Date.now() - new Date(lastSync).getTime();
      if (elapsed < MIN_INTERVAL_MS) {
        return NextResponse.json({ synced: 0, skipped: true });
      }
    }
  }

  const result = await syncGooglePhotos(albumId, albumUrl);

  if (!result.error) {
    await supabaseAdmin
      .from('site_settings')
      .upsert({ key: 'google_last_sync_at', value: new Date().toISOString() }, { onConflict: 'key' });
  }

  return NextResponse.json(result);
}
