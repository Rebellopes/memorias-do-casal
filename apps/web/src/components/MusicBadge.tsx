'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface SpotifyPerson {
  usuario: string;
  status: {
    musica: string;
    artista: string;
    album: string;
    capa: string;
    reproduzindo_agora: boolean;
    ultima_reproducao: string | null;
  } | null;
}

export function MusicBadge() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState<SpotifyPerson[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    fetch('/api/spotify/status')
      .then((r) => r.json())
      .then((persons: SpotifyPerson[]) => {
        setData(persons);
        setConnected(persons.some((p) => p.status !== null));
      });
  }, []);

  const anyPlaying = data.some((p) => p.status?.reproduzindo_agora);
  const totalPlaying = data.filter((p) => p.status?.reproduzindo_agora).length;

  if (data.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-full border border-stone-200 px-3 py-1.5 text-xs text-stone-500 transition-colors hover:border-rose-300 hover:text-rose-600"
      >
        <span className="relative flex h-2 w-2">
          {anyPlaying && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
          )}
          <span
            className={`relative inline-flex h-2 w-2 rounded-full ${
              anyPlaying ? 'bg-rose-500' : 'bg-stone-300'
            }`}
          />
        </span>
        <span>
          {connected
            ? anyPlaying
              ? `${totalPlaying} ouvindo agora`
              : 'Nenhum tocando'
            : 'Spotify não conectado'}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-stone-200 bg-white p-4 shadow-lg">
            {data.map((person) => (
              <div key={person.usuario} className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                {person.status ? (
                  <>
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-stone-100">
                      {person.status.capa && (
                        <Image src={person.status.capa} alt="" fill className="object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-stone-400">{person.usuario}</p>
                      <p className="truncate text-sm font-medium text-stone-900">
                        {person.status.musica}
                      </p>
                      <p className="truncate text-xs text-stone-500">{person.status.artista}</p>
                      {person.status.reproduzindo_agora && (
                        <span className="mt-1 inline-block rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">
                          Ouvindo Agora
                        </span>
                      )}
                      {person.status.ultima_reproducao && (
                        <span className="mt-1 block text-xs text-stone-400">
                          Última: {new Date(person.status.ultima_reproducao).toLocaleString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-stone-400">{person.usuario}: não conectado</p>
                )}
              </div>
            ))}
            <Link
              href="/musica"
              className="mt-3 block text-center text-xs text-stone-400 underline underline-offset-2 hover:text-stone-600"
            >
              Ver detalhes
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
