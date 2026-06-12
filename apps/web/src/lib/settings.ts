import { supabaseAdmin } from './supabase-admin';

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabaseAdmin
    .from('site_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();

  if (error || !data) return null;
  return data.value;
}
