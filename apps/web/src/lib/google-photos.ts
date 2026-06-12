import { supabaseAdmin } from './supabase-admin';

interface ImageInfo {
  uid: string;
  url: string;
  width: number;
  height: number;
  imageUpdateDate: number;
  albumAddDate: number;
}

async function fetchSharedAlbumHtml(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      },
    });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

function parsePhase1(html: string): string | null {
  const re = /(?<=AF_initDataCallback\()(?=.*data)(\{[\s\S]*?)(\);<\/script>)/g;
  const matches = [...html.matchAll(re)];
  if (matches.length === 0) return null;
  let longest = '';
  for (const m of matches) {
    const s = m[1];
    if (s && s.length > longest.length) longest = s;
  }
  return longest;
}

async function parsePhase2(input: string): Promise<unknown | null> {
  try {
    const mod = await import('json5');
    const parse = mod.default?.parse ?? mod.parse;
    return parse(input);
  } catch {
    return null;
  }
}

function parsePhase3(input: unknown): ImageInfo[] {
  if (typeof input !== 'object' || input === null || !('data' in input)) return [];

  const d = (input as { data: unknown }).data;
  if (!Array.isArray(d) || d.length < 1) return [];

  const arr = d[1];
  if (!Array.isArray(arr)) return [];

  return arr
    .map((e: unknown) => {
      if (!Array.isArray(e) || e.length < 6) return null;
      const uid = e[0];
      const imageUpdateDate = e[2];
      const albumAddDate = e[5];
      if (typeof uid !== 'string' || typeof imageUpdateDate !== 'number' || typeof albumAddDate !== 'number') return null;
      const detail = e[1];
      if (!Array.isArray(detail) || detail.length < 3) return null;
      const url = detail[0];
      const width = detail[1];
      const height = detail[2];
      if (typeof url !== 'string' || typeof width !== 'number' || typeof height !== 'number') return null;
      return { uid, url, width, height, imageUpdateDate, albumAddDate };
    })
    .filter((e): e is ImageInfo => e !== null);
}

export async function fetchAlbumImages(
  albumUrl: string,
): Promise<{ images: ImageInfo[]; error?: string }> {
  const html = await fetchSharedAlbumHtml(albumUrl);
  if (!html) {
    return { images: [], error: 'Não foi possível acessar o álbum. Verifique se o link é válido.' };
  }

  const ph1 = parsePhase1(html);
  if (!ph1) {
    return { images: [], error: 'Nenhuma foto encontrada. Verifique se o álbum é público (compartilhado com link).' };
  }

  const ph2 = await parsePhase2(ph1);
  if (!ph2) {
    return { images: [], error: 'Erro ao processar dados do álbum.' };
  }

  const images = parsePhase3(ph2);
  if (images.length === 0) {
    return { images: [], error: 'Nenhuma foto encontrada no álbum.' };
  }

  return { images };
}

export async function syncGooglePhotos(
  albumUrl: string,
): Promise<{ synced: number; error?: string }> {
  if (!albumUrl) {
    return { synced: 0, error: 'URL do álbum não fornecida' };
  }

  const { images, error } = await fetchAlbumImages(albumUrl);
  if (error) return { synced: 0, error };
  if (images.length === 0) return { synced: 0 };

  const { data: existing } = await supabaseAdmin
    .from('photos')
    .select('image_url')
    .eq('source', 'google_photos');

  const existingUrls = new Set(existing?.map((p) => p.image_url) ?? []);

  const newPhotos = images
    .filter((img) => {
      const fullUrl = `${img.url}=w${img.width}-h${img.height}`;
      return !existingUrls.has(fullUrl);
    })
    .map((img) => ({
      image_url: `${img.url}=w${img.width}-h${img.height}`,
      data_foto:
        new Date(img.imageUpdateDate).toISOString().slice(0, 10) ||
        new Date().toISOString().slice(0, 10),
      source: 'google_photos' as const,
      descricao: null,
    }));

  if (newPhotos.length === 0) return { synced: 0 };

  const { error: insertError } = await supabaseAdmin
    .from('photos')
    .insert(newPhotos);

  if (insertError) {
    return { synced: 0, error: `Erro ao salvar fotos: ${insertError.message}` };
  }

  return { synced: newPhotos.length };
}
