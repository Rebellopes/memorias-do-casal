'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { TimeCounter } from './TimeCounter';

const START_DATE = new Date('2023-06-15');

interface Dedication {
  id: string;
  titulo: string;
  autor: string;
  created_at: string;
}

interface DailyMessage {
  id: string;
  mensagem: string;
  autor: string;
  destinatario: string;
  created_at: string;
}

interface TimelineItem {
  id: string;
  titulo?: string;
  texto?: string;
  descricao?: string;
  image_url?: string;
  data_foto?: string;
  created_at?: string;
  data_evento?: string;
  tipo: 'evento' | 'foto' | 'dedicatoria';
}

interface SpotifyStatus {
  musica: string;
  artista: string;
  album: string;
  capa: string;
  url: string;
  reproduzindo_agora: boolean;
  ultima_reproducao: string | null;
}

interface SpotifyPerson {
  usuario: string;
  status: SpotifyStatus | null;
}

export function HomeContent() {
  const [latestDedication, setLatestDedication] = useState<Dedication | null>(null);
  const [dailyMessage, setDailyMessage] = useState<DailyMessage | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [homePhoto, setHomePhoto] = useState('');
  const [spotify, setSpotify] = useState<SpotifyPerson[]>([]);

  useEffect(() => {
    fetch('/api/dedications')
      .then((r) => r.json())
      .then((data: Dedication[]) => {
        if (data.length > 0) setLatestDedication(data[0] ?? null);
      });

    fetch('/api/daily-messages')
      .then((r) => r.json())
      .then((data: DailyMessage | null) => setDailyMessage(data));

    fetch('/api/today-in-years')
      .then((r) => r.json())
      .then(setTimeline);

    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => { if (d.home_photo) setHomePhoto(d.home_photo); });

    const fetchSpotify = () =>
      fetch('/api/spotify/status')
        .then((r) => r.json())
        .then(setSpotify);

    fetchSpotify();
    const spotifyInterval = setInterval(fetchSpotify, 30000);

    fetch('/api/google/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {});

    return () => clearInterval(spotifyInterval);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <section className="mb-20 text-center">
        <div className={`mx-auto mb-8 overflow-hidden rounded-full bg-stone-100 shadow-inner ${homePhoto ? 'h-48 w-48 sm:h-72 sm:w-72' : 'h-32 w-32 sm:h-48 sm:w-48'}`}>
          {homePhoto ? (
            <img src={homePhoto} alt="Nossas Memórias" className="h-full w-full object-cover" />
          ) : null}
        </div>
        <h1 className="mb-2 font-serif text-3xl sm:text-5xl font-bold tracking-tight text-stone-900">
          Nossas Memórias
        </h1>
        <p className="mb-6 font-serif text-lg sm:text-xl text-stone-400">Desde 15 de Junho de 2023</p>
        <TimeCounter startDate={START_DATE} />

        {dailyMessage && (
          <div className="mx-auto mt-10 max-w-lg rounded-2xl border border-rose-100 bg-rose-50/50 p-6">
            <p className="font-serif text-lg italic text-stone-700">&ldquo;{dailyMessage.mensagem}&rdquo;</p>
            <p className="mt-3 text-xs text-stone-400">
              {dailyMessage.autor} &rarr; {dailyMessage.destinatario}
            </p>
          </div>
        )}
      </section>

      {timeline.length > 0 && (
        <section className="mb-20">
          <h2 className="mb-8 text-center font-serif text-3xl font-bold text-stone-800">
            Hoje em Outros Anos
          </h2>
          <div className="space-y-4">
            {timeline.map((item) => (
              <div
                key={`${item.tipo}-${item.id}`}
                className="rounded-xl border border-stone-100 bg-stone-50 p-4"
              >
                <div className="flex items-start gap-4">
                  <span className="mt-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">
                    {item.tipo === 'evento' ? 'Evento' : item.tipo === 'foto' ? 'Foto' : 'Dedicação'}
                  </span>
                  <div className="min-w-0 flex-1">
                    {item.tipo === 'evento' && (
                      <>
                        <p className="font-medium text-stone-900">{item.titulo}</p>
                        {item.descricao && (
                          <p className="text-stone-500">{item.descricao}</p>
                        )}
                        <p className="mt-1 text-xs text-stone-400">
                          {item.data_evento && new Date(item.data_evento).toLocaleDateString('pt-BR')}
                        </p>
                      </>
                    )}
                    {item.tipo === 'foto' && (
                      <div className="flex items-center gap-3">
                        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-stone-200">
                          {item.image_url && (
                            <Image src={item.image_url} alt="" fill className="object-cover" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-stone-600">Foto</p>
                          <p className="text-xs text-stone-400">
                            {item.data_foto && new Date(item.data_foto).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                      </div>
                    )}
                    {item.tipo === 'dedicatoria' && (
                      <>
                        <p className="font-medium text-stone-900">{item.titulo}</p>
                        {item.texto && (
                          <p className="mt-1 text-stone-600 line-clamp-2">{item.texto}</p>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-8 sm:grid-cols-3">
        <Link
          href="/dedicatorias"
          className="group rounded-xl border border-stone-100 bg-stone-50 p-6 transition-colors hover:border-rose-100 hover:bg-rose-50/30"
        >
          <h3 className="mb-2 font-serif text-xl font-bold text-stone-700 group-hover:text-rose-700">
            Última Dedicatória
          </h3>
          {latestDedication ? (
            <>
              <p className="font-medium text-stone-900">{latestDedication.titulo}</p>
              <p className="mt-1 text-xs text-stone-400">
                {latestDedication.autor} ·{' '}
                {new Date(latestDedication.created_at).toLocaleDateString('pt-BR')}
              </p>
            </>
          ) : (
            <p className="text-sm text-stone-400">Nenhuma ainda</p>
          )}
        </Link>

        <Link
          href="/galeria"
          className="group rounded-xl border border-stone-100 bg-stone-50 p-6 transition-colors hover:border-rose-100 hover:bg-rose-50/30"
        >
          <h3 className="mb-2 font-serif text-xl font-bold text-stone-700 group-hover:text-rose-700">
            Última Foto
          </h3>
          <p className="text-sm text-stone-400">Galeria de memórias</p>
        </Link>

        <Link
          href="/musica"
          className="group rounded-xl border border-stone-100 bg-stone-50 p-6 transition-colors hover:border-rose-100 hover:bg-rose-50/30"
        >
          <h3 className="mb-2 font-serif text-xl font-bold text-stone-700 group-hover:text-rose-700">
            Atividade Musical
          </h3>
          <p className="text-sm text-stone-400">Conecte o Spotify</p>
        </Link>
      </section>
    </div>
  );
}
