'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Dedication {
  id: string;
  titulo: string;
  texto: string;
  imagem: string | null;
  autor: string;
  created_at: string;
}

function DedicatoriasAdmin() {
  const [dedications, setDedications] = useState<Dedication[]>([]);
  const [titulo, setTitulo] = useState('');
  const [texto, setTexto] = useState('');
  const [autor, setAutor] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/dedications').then((r) => r.json()).then(setDedications);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/dedications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, texto, autor }),
    });
    if (res.ok) {
      const newDedication = await res.json();
      setDedications((prev) => [newDedication, ...prev]);
      setTitulo('');
      setTexto('');
      setAutor('');
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza?')) return;
    await fetch(`/api/dedications/${id}`, { method: 'DELETE' });
    setDedications((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-stone-900">Dedicatórias</h1>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4 rounded-xl border border-stone-200 p-6">
        <h2 className="font-serif text-lg font-medium text-stone-700">Nova Dedicatória</h2>
        <input
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <textarea
          placeholder="Texto da dedicatória..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          rows={5}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <input
          placeholder="Autor"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600 disabled:opacity-50"
        >
          {loading ? 'Publicando...' : 'Publicar'}
        </button>
      </form>

      <div className="space-y-4">
        {dedications.map((d) => (
          <div key={d.id} className="rounded-xl border border-stone-100 bg-stone-50 p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">{d.titulo}</h3>
                <p className="mt-1 text-sm text-stone-500">
                  {d.autor} · {new Date(d.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              <button
                onClick={() => handleDelete(d.id)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Excluir
              </button>
            </div>
            <p className="mt-3 text-sm text-stone-600 line-clamp-3">{d.texto}</p>
          </div>
        ))}
        {dedications.length === 0 && (
          <p className="text-center text-sm text-stone-400">Nenhuma dedicatória ainda</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><DedicatoriasAdmin /></ProtectedRoute>;
}
