'use client';

import { useEffect, useState, useMemo } from 'react';
import Image from 'next/image';

interface Photo {
  id: string;
  image_url: string;
  data_foto: string;
  descricao: string | null;
  favorita: boolean;
}

const MONTHS = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

export function GaleriaContent() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selected, setSelected] = useState<Photo | null>(null);
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/photos').then((r) => r.json()).then(setPhotos);
  }, []);

  const years = useMemo(() => {
    const y = new Set<number>();
    photos.forEach((p) => y.add(new Date(p.data_foto).getFullYear()));
    return Array.from(y).sort((a, b) => b - a);
  }, [photos]);

  const filtered = useMemo(() => {
    return photos.filter((p) => {
      const d = new Date(p.data_foto);
      if (year && d.getFullYear() !== year) return false;
      if (month !== null && d.getMonth() !== month) return false;
      return true;
    });
  }, [photos, year, month]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="mb-8 font-serif text-4xl font-bold text-stone-900 dark:text-stone-100">Galeria</h1>

      <div className="mb-8 flex flex-wrap gap-3">
        <select
          value={year ?? ''}
          onChange={(e) => setYear(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          <option value="">Todos os anos</option>
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>

        <select
          value={month ?? ''}
          onChange={(e) => setMonth(e.target.value ? Number(e.target.value) : null)}
          className="rounded-lg border border-stone-200 bg-white px-3 py-2 text-sm outline-none focus:border-rose-400 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200"
        >
          <option value="">Todos os meses</option>
          {MONTHS.map((name, i) => (
            <option key={i} value={i}>{name}</option>
          ))}
        </select>

        {(year || month !== null) && (
          <button
            onClick={() => { setYear(null); setMonth(null); }}
            className="rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-500 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-400"
          >
            Limpar filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((photo) => (
          <button
            key={photo.id}
            onClick={() => setSelected(photo)}
            className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100 dark:bg-stone-800"
          >
            <Image
              src={photo.image_url}
              alt={photo.descricao || ''}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {photo.favorita && (
              <span className="absolute right-2 top-2 text-base text-yellow-400">★</span>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-sm text-white">
                {new Date(photo.data_foto).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-stone-400">Nenhuma foto encontrada</p>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setSelected(null)}>
          <button
            onClick={() => setSelected(null)}
            className="absolute right-4 top-4 text-2xl text-white/70 hover:text-white"
          >
            ✕
          </button>
          <div className="relative max-h-[90vh] max-w-[90vw] min-h-[300px] w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={selected.image_url}
              alt={selected.descricao || ''}
              fill
              className="rounded-xl object-contain"
              sizes="90vw"
            />
          </div>
          <div className="absolute bottom-4 text-center">
            <p className="text-white/80">
              {new Date(selected.data_foto).toLocaleDateString('pt-BR')}
            </p>
            {selected.descricao && (
              <p className="mt-1 text-white/60">{selected.descricao}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
