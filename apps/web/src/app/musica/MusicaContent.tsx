'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface SpotifyStatus {
  musica: string;
  artista: string;
  album: string;
  capa: string;
  reproduzindo_agora: boolean;
  ultima_reproducao: string | null;
}

interface SpotifyPerson {
  usuario: string;
  status: SpotifyStatus | null;
}

export function MusicaContent() {
  const [persons, setPersons] = useState<SpotifyPerson[]>([]);

  useEffect(() => {
    fetch('/api/spotify/status')
      .then((r) => r.json())
      .then(setPersons);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-4 text-center font-serif text-4xl font-bold text-stone-900 dark:text-stone-100">
        Música
      </h1>
      <p className="mb-12 text-center text-stone-400">
        Conecte sua conta Spotify para compartilhar sua atividade musical
      </p>

      <div className="grid gap-8 sm:grid-cols-2">
        {persons.map((person) => (
          <div
            key={person.usuario}
            className="rounded-xl border border-stone-100 bg-stone-50 p-6 dark:border-stone-800 dark:bg-stone-900/50"
          >
            <h3 className="mb-4 font-serif text-xl font-medium text-stone-700 dark:text-stone-300">
              {person.usuario}
            </h3>

            {person.status ? (
              <div className="flex gap-4">
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl bg-stone-200 dark:bg-stone-800">
                  {person.status.capa && (
                    <Image
                      src={person.status.capa}
                      alt={person.status.album}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-lg font-medium text-stone-900 dark:text-stone-100">{person.status.musica}</p>
                  <p className="text-stone-500 dark:text-stone-400">{person.status.artista}</p>
                  <p className="mt-1 text-sm text-stone-400">{person.status.album}</p>

                  {person.status.reproduzindo_agora ? (
                    <span className="mt-3 inline-block rounded-full bg-rose-100 px-3 py-1 text-sm text-rose-600 dark:bg-rose-900/30 dark:text-rose-400">
                      Ouvindo Agora
                    </span>
                  ) : person.status.ultima_reproducao ? (
                    <p className="mt-3 text-xs text-stone-400">
                      Última reprodução:{' '}
                      {new Date(person.status.ultima_reproducao).toLocaleString('pt-BR')}
                    </p>
                  ) : null}
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="mb-4 text-sm text-stone-400">
                  Conecte sua conta Spotify para compartilhar sua atividade musical
                </p>
                <a
                  href={`/api/spotify/auth?usuario=${encodeURIComponent(person.usuario)}`}
                  className="inline-block rounded-full bg-[#1DB954] px-6 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
                >
                  Conectar Spotify
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
