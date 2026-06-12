'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

function IntegracoesAdmin() {
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleGoogleSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    const res = await fetch('/api/google/sync', { method: 'POST' });
    const data = await res.json();
    setSyncResult(`Sincronizado: ${data.synced} novas fotos`);
    setSyncing(false);
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
              <p className="text-sm text-stone-500">Sincronize fotos do álbum compartilhado</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/api/google/auth"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Conectar Google Fotos
            </a>
            <button
              onClick={handleGoogleSync}
              disabled={syncing}
              className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50"
            >
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </button>
          </div>
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
