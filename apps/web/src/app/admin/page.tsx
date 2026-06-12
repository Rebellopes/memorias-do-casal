'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Album {
  id: string;
  title: string;
  mediaItemsCount: string;
}

function AdminDashboard() {
  const [homePhoto, setHomePhoto] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<string | null>(null);

  const [googleConnected, setGoogleConnected] = useState(false);
  const [spotifyConnected, setSpotifyConnected] = useState(false);

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loadingAlbums, setLoadingAlbums] = useState(false);
  const [selectedAlbumId, setSelectedAlbumId] = useState('');

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      if (d.home_photo) setHomePhoto(d.home_photo);
    });

    fetch('/api/spotify/status').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) setSpotifyConnected(data.some((p: { status: unknown }) => p.status));
    });

    fetch('/api/google/albums').then((r) => r.json()).then((data) => {
      if (data.albums) { setGoogleConnected(true); setAlbums(data.albums); }
    }).catch(() => {});
  }, []);

  const saveHomePhoto = async () => {
    setSavingPhoto(true);
    setPhotoMsg(null);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'home_photo', value: homePhoto }),
    });
    if (res.ok) setPhotoMsg('Salvo!');
    else setPhotoMsg('Erro ao salvar');
    setSavingPhoto(false);
  };

  const handleListAlbums = async () => {
    setLoadingAlbums(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/google/albums');
      const data = await res.json();
      if (data.error) { setSyncMsg(data.error); setAlbums([]); }
      else { setAlbums(data.albums || []); setGoogleConnected(true); }
    } catch { setSyncMsg('Erro de conexão'); }
    setLoadingAlbums(false);
  };

  const handleGoogleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumId: selectedAlbumId || undefined }),
      });
      const data = await res.json();
      if (data.error) setSyncMsg(data.error);
      else setSyncMsg(`Sincronizado: ${data.synced} novas fotos`);
    } catch { setSyncMsg('Erro ao sincronizar'); }
    setSyncing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-10 font-serif text-3xl font-semibold text-stone-900 dark:text-stone-100">Admin</h1>

      <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/dedicatorias" className="rounded-xl border border-stone-200 p-5 transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">Dedicatórias</h3>
          <p className="mt-1 text-sm text-stone-400">Gerenciar mensagens</p>
        </Link>
        <Link href="/admin/galeria" className="rounded-xl border border-stone-200 p-5 transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">Galeria</h3>
          <p className="mt-1 text-sm text-stone-400">Upload de fotos</p>
        </Link>
        <Link href="/admin/eventos" className="rounded-xl border border-stone-200 p-5 transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">Eventos</h3>
          <p className="mt-1 text-sm text-stone-400">Linha do tempo</p>
        </Link>
        <Link href="/admin/recados" className="rounded-xl border border-stone-200 p-5 transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="font-serif text-lg font-medium text-stone-800 dark:text-stone-200">Recados</h3>
          <p className="mt-1 text-sm text-stone-400">Mensagem diária</p>
        </Link>
      </div>

      <div className="space-y-8">
        <div className="rounded-xl border border-stone-200 p-6 dark:border-stone-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">📸</div>
            <div>
              <h2 className="font-medium text-stone-900 dark:text-stone-200">Foto Principal da Home</h2>
              <p className="text-sm text-stone-500">URL da foto que aparece no círculo central</p>
            </div>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="flex-1">
              <input
                type="url"
                value={homePhoto}
                onChange={(e) => setHomePhoto(e.target.value)}
                placeholder="https://..."
                className="block w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
              />
            </div>
            <button
              onClick={saveHomePhoto}
              disabled={savingPhoto}
              className="rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {savingPhoto ? 'Salvando...' : 'Salvar'}
            </button>
            {photoMsg && <span className="text-sm text-stone-500">{photoMsg}</span>}
          </div>
          {homePhoto && (
            <div className="mt-4 flex items-center gap-3">
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-full bg-stone-100">
                <img src={homePhoto} alt="" className="h-full w-full object-cover" />
              </div>
              <span className="truncate text-xs text-stone-400">{homePhoto}</span>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-stone-200 p-6 dark:border-stone-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]/10 text-lg">🎵</div>
            <div>
              <h2 className="font-medium text-stone-900 dark:text-stone-200">Spotify</h2>
              <p className="text-sm text-stone-500">Compartilhe a atividade musical de cada um</p>
            </div>
            {spotifyConnected && <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Conectado</span>}
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="/api/spotify/auth?usuario=Pessoa A" className="rounded-lg bg-[#1DB954] px-4 py-2 text-sm font-medium text-white hover:opacity-90">
              Conectar Pessoa A
            </a>
            <a href="/api/spotify/auth?usuario=Pessoa B" className="rounded-lg border border-[#1DB954] px-4 py-2 text-sm font-medium text-[#1DB954] hover:bg-[#1DB954]/5">
              Conectar Pessoa B
            </a>
          </div>
          {!spotifyConnected && <p className="mt-3 text-xs text-stone-400">Clique em um dos botões acima para autorizar o Spotify. Você será redirecionado ao Spotify e depois voltará para cá.</p>}
        </div>

        <div className="rounded-xl border border-stone-200 p-6 dark:border-stone-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">📸</div>
            <div>
              <h2 className="font-medium text-stone-900 dark:text-stone-200">Google Fotos</h2>
              <p className="text-sm text-stone-500">Sincronize fotos de um álbum</p>
            </div>
            {googleConnected && <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">Conectado</span>}
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-3">
            <a href="/api/google/auth" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Conectar Google Fotos
            </a>
            <button
              onClick={handleListAlbums}
              disabled={loadingAlbums}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:text-stone-300"
            >
              {loadingAlbums ? 'Carregando...' : 'Listar Álbuns'}
            </button>
          </div>

          {!googleConnected && <p className="mb-3 text-xs text-stone-400">Clique em "Conectar Google Fotos" para autorizar. Você será redirecionado ao Google e depois voltará para cá.</p>}

          {albums.length > 0 && (
            <div className="mb-4">
              <select
                value={selectedAlbumId}
                onChange={(e) => setSelectedAlbumId(e.target.value)}
                className="block w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
              >
                <option value="">Usar GOOGLE_ALBUM_ID do .env</option>
                {albums.map((album) => (
                  <option key={album.id} value={album.id}>
                    {album.title} ({album.mediaItemsCount || '0'} fotos)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex items-center gap-3">
            <button
              onClick={handleGoogleSync}
              disabled={syncing}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:text-stone-300"
            >
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
            {syncMsg && <span className="text-sm text-stone-500">{syncMsg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><AdminDashboard /></ProtectedRoute>;
}
