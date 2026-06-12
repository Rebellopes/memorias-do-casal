'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Album {
  id: string;
  title: string;
  mediaItemsCount: string;
  coverPhotoBaseUrl?: string;
}

function IntegracoesAdmin() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  const handleGoogleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await fetch('/api/google/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ albumId: selectedAlbumId || undefined }),
    });
    const data = await res.json();
    setSyncResult(`Sincronizado: ${data.synced} novas fotos`);
    setSyncing(false);
  };

  const handleListAlbums = async () => {
    setLoadingAlbums(true);
    const res = await fetch('/api/google/albums');
    const data = await res.json();
    setAlbums(data.albums || []);
    setLoadingAlbums(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-stone-900">Integrações</h1>

      <div className="space-y-6">
        <div className="rounded-xl border border-stone-200 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]/10 text-lg">
              🎵
            </div>
            <div>
              <h2 className="font-medium text-stone-900">Spotify</h2>
              <p className="text-sm text-stone-500">Compartilhe sua atividade musical</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="/api/spotify/auth?usuario=Pessoa A"
              className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
            >
              Conectar Pessoa A
            </a>
            <a
              href="/api/spotify/auth?usuario=Pessoa B"
              className="rounded-lg border border-[#1DB954] px-4 py-2 text-sm font-medium text-[#1DB954] hover:bg-[#1DB954]/5"
            >
              Conectar Pessoa B
            </a>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 p-6">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">
              📸
            </div>
            <div>
              <h2 className="font-medium text-stone-900">Google Fotos</h2>
              <p className="text-sm text-stone-500">Sincronize fotos de um álbum específico</p>
            </div>
          </div>

          <div className="mb-4 flex items-center gap-3">
            <a
              href="/api/google/auth"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Conectar Google Fotos
            </a>
            <button
              onClick={handleListAlbums}
              disabled={loadingAlbums}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {loadingAlbums ? 'Carregando...' : 'Listar Álbuns'}
            </button>
          </div>

          {albums.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-stone-700">Álbum</label>
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
              >
                <option value="">Usar GOOGLE_ALBUM_ID do .env</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title} ({album.mediaItemsCount || '0'} fotos)
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-stone-400">
                Selecione um álbum para sincronizar apenas as fotos dele.
              </p>
            </div>
          )}

          <button
            onClick={handleGoogleSync}
            disabled={syncing}
            className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
          >
            {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
          </button>

          {syncResult && (
            <p className="mt-3 text-sm text-stone-600">{syncResult}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><IntegracoesAdmin /></ProtectedRoute>;
}
