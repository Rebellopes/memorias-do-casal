'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Dedication {
  id: string;
  titulo: string;
  texto: string;
  imagem: string | null;
  autor: string;
  created_at: string;
}

export function DedicatoriasContent() {
  const [dedications, setDedications] = useState<Dedication[]>([]);

  useEffect(() => {
    fetch('/api/dedications').then((r) => r.json()).then(setDedications);
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-12 text-center font-serif text-4xl font-bold text-stone-900 dark:text-stone-100">
        Dedicatórias
      </h1>

      <div className="space-y-8">
        {dedications.map((d) => (
          <Link
            key={d.id}
            href={`/dedicatorias/${d.id}`}
            className="group block rounded-xl border border-stone-100 p-6 transition-colors hover:border-rose-100 hover:bg-rose-50/20 dark:border-stone-800 dark:hover:border-rose-900 dark:hover:bg-rose-950/20"
          >
            <h2 className="font-serif text-2xl font-medium text-stone-900 group-hover:text-rose-700 dark:text-stone-100 dark:group-hover:text-rose-400">
              {d.titulo}
            </h2>
            <p className="mt-2 text-sm text-stone-500">
              {d.autor} · {new Date(d.created_at).toLocaleDateString('pt-BR')}
            </p>
            <p className="mt-3 text-stone-600 line-clamp-3 dark:text-stone-400">{d.texto}</p>
          </Link>
        ))}
        {dedications.length === 0 && (
          <p className="text-center text-stone-400">
            Nenhuma dedicatória publicada ainda...
          </p>
        )}
      </div>
    </div>
  );
}
