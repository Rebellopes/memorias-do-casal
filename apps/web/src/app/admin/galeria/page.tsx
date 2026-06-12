'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Photo {
  id: string;
  image_url: string;
  data_foto: string;
  descricao: string | null;
  favorita: boolean;
}

function GaleriaAdmin() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dataFoto, setDataFoto] = useState(new Date().toISOString().slice(0, 10));
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/photos').then((r) => r.json()).then(setPhotos);
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('data_foto', dataFoto || new Date().toISOString().slice(0, 10));

    const res = await fetch('/api/upload', { method: 'POST', body: form });
    if (res.ok) {
      const photo = await res.json();
      setPhotos((prev) => [photo, ...prev]);
      if (fileRef.current) fileRef.current.value = '';
    }
    setUploading(false);
  };

  const toggleFavorita = async (photo: Photo) => {
    const res = await fetch(`/api/photos/${photo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ favorita: !photo.favorita }),
    });
    if (res.ok) {
      setPhotos((prev) =>
        prev.map((p) => (p.id === photo.id ? { ...p, favorita: !p.favorita } : p)),
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esta foto?')) return;
    await fetch(`/api/photos/${id}`, { method: 'DELETE' });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-stone-900">Galeria</h1>

      <form onSubmit={handleUpload} className="mb-12 flex flex-wrap items-end gap-4 rounded-xl border border-stone-200 p-6">
        <div>
          <label className="block text-sm font-medium text-stone-700">Foto</label>
          <input ref={fileRef} type="file" accept="image/*" className="mt-1 text-sm" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700">Data</label>
          <input
            type="date"
            value={dataFoto}
            onChange={(e) => setDataFoto(e.target.value)}
            className="mt-1 block rounded-lg border border-stone-200 px-3 py-2 text-sm outline-none focus:border-rose-400"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="rounded-lg bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {uploading ? 'Enviando...' : 'Upload'}
        </button>
      </form>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div key={photo.id} className="group relative aspect-square overflow-hidden rounded-xl bg-stone-100">
            <Image
              src={photo.image_url}
              alt={photo.descricao || ''}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/40 p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="text-xs text-white">{new Date(photo.data_foto).toLocaleDateString('pt-BR')}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleFavorita(photo)}
                  className={`text-sm ${photo.favorita ? 'text-yellow-400' : 'text-white/70 hover:text-yellow-400'}`}
                >
                  {photo.favorita ? '★' : '☆'}
                </button>
                <button
                  onClick={() => handleDelete(photo.id)}
                  className="text-sm text-white/70 hover:text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {photos.length === 0 && (
        <p className="text-center text-sm text-stone-400">Nenhuma foto na galeria</p>
      )}
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><GaleriaAdmin /></ProtectedRoute>;
}
