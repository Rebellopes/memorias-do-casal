import { supabaseAdmin } from './supabase-admin';

export interface SharedAlbumImage {
  uid: string;
  url: string;
  width: number;
  height: number;
  imageUpdateDate: number;
  albumAddDate: number;
}

export async function fetchAlbumImages(
  albumUrl: string,
): Promise<{ images: SharedAlbumImage[]; error?: string }> {
  try {
    const { fetchImageUrls } = await import('google-photos-album-image-url-fetch');
    const images = await fetchImageUrls(albumUrl);

    if (!images || images.length === 0) {
      return {
        images: [],
        error:
          'Nenhuma foto encontrada. Verifique se o álbum é público (compartilhado com link).',
      };
    }

    return { images: images as SharedAlbumImage[] };
  } catch (err) {
    return {
      images: [],
      error: `Erro ao buscar fotos: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
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
