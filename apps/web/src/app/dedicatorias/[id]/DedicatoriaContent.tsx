'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface Dedication {
  id: string;
  titulo: string;
  texto: string;
  imagem: string | null;
  autor: string;
  created_at: string;
}

export function DedicatoriaContent() {
  const { id } = useParams<{ id: string }>();
  const [dedication, setDedication] = useState<Dedication | null>(null);

  useEffect(() => {
    fetch(`/api/dedications/${id}`)
      .then((r) => r.json())
      .then(setDedication);
  }, [id]);

  const handleShare = async () => {
    if (!dedication) return;
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: dedication.titulo, text: dedication.texto, url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  if (!dedication) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-rose-500" />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Link
        href="/dedicatorias"
        className="mb-8 inline-block text-sm text-stone-400 hover:text-stone-600 dark:text-stone-500"
      >
        ← Todas as dedicatórias
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold text-stone-900 dark:text-stone-100">
            {dedication.titulo}
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            {dedication.autor} · {new Date(dedication.created_at).toLocaleDateString('pt-BR')}
          </p>
        </div>
        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 rounded-lg border border-stone-200 px-3 py-1.5 text-xs text-stone-500 transition-colors hover:border-rose-200 hover:text-rose-600 dark:border-stone-700"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          Compartilhar
        </button>
      </div>

      {dedication.imagem && (
        <div className="mt-8 overflow-hidden rounded-xl bg-stone-100">
          <Image src={dedication.imagem} alt={dedication.titulo} width={800} height={600} className="w-full object-cover" />
        </div>
      )}

      <div className="mt-8 whitespace-pre-wrap font-serif text-lg leading-relaxed text-stone-700 dark:text-stone-300">
        {dedication.texto}
      </div>
    </article>
  );
}
