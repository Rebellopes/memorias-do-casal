'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Event {
  id: string;
  titulo: string;
  descricao: string | null;
  data_evento: string;
  imagem: string | null;
}

function EventosAdmin() {
  const [events, setEvents] = useState<Event[]>([]);
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dataEvento, setDataEvento] = useState('');

  useEffect(() => {
    fetch('/api/events').then((r) => r.json()).then(setEvents);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titulo, descricao, data_evento: dataEvento }),
    });
    if (res.ok) {
      const newEvent = await res.json();
      setEvents((prev) => [newEvent, ...prev]);
      setTitulo('');
      setDescricao('');
      setDataEvento('');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir evento?')) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-stone-900">Eventos</h1>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4 rounded-xl border border-stone-200 p-6">
        <input
          placeholder="Título do evento"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <textarea
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
        />
        <input
          type="date"
          value={dataEvento}
          onChange={(e) => setDataEvento(e.target.value)}
          className="block rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Criar Evento
        </button>
      </form>

      <div className="space-y-3">
        {events.map((e) => (
          <div key={e.id} className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-4">
            <div>
              <h3 className="font-medium text-stone-900">{e.titulo}</h3>
              {e.descricao && <p className="mt-1 text-sm text-stone-500">{e.descricao}</p>}
              <p className="mt-1 text-xs text-stone-400">
                {new Date(e.data_evento).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <button onClick={() => handleDelete(e.id)} className="text-sm text-red-400 hover:text-red-600">
              Excluir
            </button>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-center text-sm text-stone-400">Nenhum evento cadastrado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><EventosAdmin /></ProtectedRoute>;
}
