'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function AdminDashboard() {
  const [homePhoto, setHomePhoto] = useState('');
  const [savingPhoto, setSavingPhoto] = useState(false);
  const [photoMsg, setPhotoMsg] = useState<string | null>(null);

  const [googleAlbumUrl, setGoogleAlbumUrl] = useState('');
  const [savingAlbumUrl, setSavingAlbumUrl] = useState(false);
  const [albumUrlMsg, setAlbumUrlMsg] = useState<string | null>(null);

  const [spotifyPersons, setSpotifyPersons] = useState<string[]>([]);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState<string | null>(null);
  const [spotifyAuthUrls, setSpotifyAuthUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/settings').then((r) => r.json()).then((d) => {
      if (d.home_photo) setHomePhoto(d.home_photo);
      if (d.google_album_url) setGoogleAlbumUrl(d.google_album_url);
    });

    const slots = ['Pessoa A', 'Pessoa B'];
    Promise.all(
      slots.map((s) =>
        fetch('/api/spotify/auth?usuario=' + encodeURIComponent(s)).then((r) => r.json())
      )
    ).then((results) => {
      const urls: Record<string, string> = {};
      results.forEach((r, i) => { urls[slots[i]!] = r.url; });
      setSpotifyAuthUrls(urls);
    });

    fetch('/api/spotify/status').then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) {
        const connected = data.filter((p: { status: unknown }) => p.status);
        setSpotifyPersons(connected.map((p: { usuario: string }) => p.usuario));
      }
    });
  }, []);

  const saveHomePhoto = async () => {
    setSavingPhoto(true);
    setPhotoMsg(null);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'home_photo', value: homePhoto }),
    });
    setPhotoMsg(res.ok ? 'Salvo!' : 'Erro ao salvar');
    setSavingPhoto(false);
  };

  const saveAlbumUrl = async () => {
    setSavingAlbumUrl(true);
    setAlbumUrlMsg(null);
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'google_album_url', value: googleAlbumUrl }),
    });
    setAlbumUrlMsg(res.ok ? 'Salvo!' : 'Erro ao salvar');
    setSavingAlbumUrl(false);
  };

  const disconnectSpotify = async (usuario: string) => {
    setDisconnecting(usuario);
    await fetch(`/api/spotify/tokens?usuario=${encodeURIComponent(usuario)}`, { method: 'DELETE' });
    setSpotifyPersons((prev) => prev.filter((p) => p !== usuario));
    setDisconnecting(null);
  };

  const handleGoogleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      const res = await fetch('/api/google/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ albumUrl: googleAlbumUrl || undefined, force: true }),
      });
      const data = await res.json();
      setSyncMsg(data.error ? `Erro: ${data.error}` : `${data.synced} novas fotos sincronizadas`);
    } catch { setSyncMsg('Erro de conexão'); }
    setSyncing(false);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:py-16">
      <h1 className="mb-8 sm:mb-12 text-3xl sm:text-4xl font-bold text-stone-900 dark:text-stone-100">Admin</h1>

      <div className="mb-8 sm:mb-12 grid gap-4 sm:gap-5 grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/dedicatorias" className="rounded-xl border border-stone-200 p-4 sm:p-6 font-medium transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200">Dedicatórias</h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-400">Gerenciar mensagens</p>
        </Link>
        <Link href="/admin/galeria" className="rounded-xl border border-stone-200 p-4 sm:p-6 font-medium transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200">Galeria</h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-400">Upload de fotos</p>
        </Link>
        <Link href="/admin/eventos" className="rounded-xl border border-stone-200 p-4 sm:p-6 font-medium transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200">Eventos</h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-400">Linha do tempo</p>
        </Link>
        <Link href="/admin/recados" className="rounded-xl border border-stone-200 p-4 sm:p-6 font-medium transition-colors hover:border-rose-200 dark:border-stone-700">
          <h3 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200">Recados</h3>
          <p className="mt-1 text-xs sm:text-sm text-stone-400">Mensagem diária</p>
        </Link>
      </div>

      <div className="space-y-6 sm:space-y-8">
        <div className="rounded-xl border border-stone-200 p-4 sm:p-6 dark:border-stone-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">🖼️</div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-200">Foto Principal da Home</h2>
              <p className="text-xs sm:text-sm text-stone-500">URL da foto que aparece no círculo central</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3">
            <div className="w-full sm:flex-1">
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
              className="w-full sm:w-auto rounded-lg bg-rose-500 px-5 py-2 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {savingPhoto ? 'Salvando...' : 'Salvar'}
            </button>
            {photoMsg && <span className="text-sm font-medium text-stone-500">{photoMsg}</span>}
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

          <div className="rounded-xl border border-stone-200 p-4 sm:p-6 dark:border-stone-700">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#1DB954]/10 text-lg">🎵</div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-200">Spotify</h2>
                <p className="text-xs sm:text-sm text-stone-500">Compartilhe a atividade musical de cada um</p>
              </div>
              {spotifyPersons.length > 0 && <span className="ml-auto rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Conectado</span>}
            </div>
            <div className="flex flex-wrap gap-3">
              {spotifyPersons.map((p) => (
                <button
                  key={p}
                  onClick={() => disconnectSpotify(p)}
                  disabled={disconnecting === p}
                  className="rounded-lg border border-red-300 px-5 py-2 text-sm font-bold text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  {disconnecting === p ? 'Desconectando...' : `Desconectar ${p}`}
                </button>
              ))}
              {spotifyPersons.length < 2 &&
                Array.from({ length: 2 - spotifyPersons.length }).map((_, i) => {
                  const slot = `Pessoa ${i === 0 ? 'A' : 'B'}`;
                  return (
                    <a
                      key={slot}
                      href={spotifyAuthUrls[slot] || '#'}
                      className="inline-block rounded-lg bg-[#1DB954] px-5 py-2 text-sm font-bold text-white hover:opacity-90"
                    >
                      Conectar {slot}
                    </a>
                  );
                })}
            </div>
            {spotifyPersons.length === 0 && <p className="mt-3 text-xs text-stone-400">Clique em um dos botões para autorizar o Spotify. Você será redirecionado e depois voltará para cá.</p>}
          </div>

        <div className="rounded-xl border border-stone-200 p-4 sm:p-6 dark:border-stone-700">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-lg">📸</div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900 dark:text-stone-200">Google Fotos</h2>
              <p className="text-xs sm:text-sm text-stone-500">Busca fotos de um álbum público (sem OAuth)</p>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-stone-700 dark:text-stone-300 mb-1">
              Link do álbum compartilhado (photos.app.goo.gl/...)
            </label>
            <div className="flex flex-col sm:flex-row flex-wrap items-end gap-3">
              <div className="w-full sm:flex-1">
                <input
                  type="url"
                  value={googleAlbumUrl}
                  onChange={(e) => setGoogleAlbumUrl(e.target.value)}
                  placeholder="https://photos.app.goo.gl/..."
                  className="block w-full rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-stone-600 dark:bg-stone-900 dark:text-stone-200"
                />
              </div>
              <button
                onClick={saveAlbumUrl}
                disabled={savingAlbumUrl}
                className="w-full sm:w-auto rounded-lg border border-stone-300 px-4 py-2 text-sm font-bold text-stone-700 hover:bg-stone-50 disabled:opacity-50 dark:border-stone-600 dark:text-stone-300"
              >
                {savingAlbumUrl ? 'Salvando...' : 'Salvar'}
              </button>
              {albumUrlMsg && <span className="text-sm font-medium text-stone-500">{albumUrlMsg}</span>}
            </div>
            <p className="mt-1 text-xs text-stone-400">
              O álbum precisa estar público (compartilhado com link). Nenhuma autenticação necessária.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <button
              onClick={handleGoogleSync}
              disabled={syncing}
              className="w-full sm:w-auto rounded-lg bg-rose-500 px-5 py-2 text-sm font-bold text-white hover:bg-rose-600 disabled:opacity-50"
            >
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
            {syncMsg && <span className="text-sm font-medium text-stone-500">{syncMsg}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><AdminDashboard /></ProtectedRoute>;
}
