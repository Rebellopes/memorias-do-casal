'use client';

import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

interface Message {
  id: string;
  autor: string;
  destinatario: string;
  mensagem: string;
  created_at: string;
}

function RecadosAdmin() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [mensagem, setMensagem] = useState('');
  const [autor, setAutor] = useState('');
  const [destinatario, setDestinatario] = useState('');

  useEffect(() => {
    fetch('/api/daily-messages').then((r) => r.json()).then(setMessages);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/daily-messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem, autor, destinatario }),
    });
    if (res.ok) {
      setMensagem('');
      setAutor('');
      setDestinatario('');
      fetch('/api/daily-messages').then((r) => r.json()).then(setMessages);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-3xl font-semibold text-stone-900">Recado do Dia</h1>

      <form onSubmit={handleSubmit} className="mb-12 space-y-4 rounded-xl border border-stone-200 p-6">
        <input
          placeholder="De (autor)"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <input
          placeholder="Para (destinatário)"
          value={destinatario}
          onChange={(e) => setDestinatario(e.target.value)}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <textarea
          placeholder="Sua mensagem..."
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
          rows={3}
          className="block w-full rounded-lg border border-stone-200 px-4 py-2 text-sm outline-none focus:border-rose-400"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-500 px-6 py-2 text-sm font-medium text-white hover:bg-rose-600"
        >
          Enviar Recado
        </button>
      </form>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl border border-stone-100 bg-stone-50 p-4">
            <p className="text-sm text-stone-700">{m.mensagem}</p>
            <p className="mt-2 text-xs text-stone-400">
              {m.autor} → {m.destinatario} · {new Date(m.created_at).toLocaleDateString('pt-BR')}
            </p>
          </div>
        ))}
        {messages.length === 0 && (
          <p className="text-center text-sm text-stone-400">Nenhum recado enviado</p>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return <ProtectedRoute><RecadosAdmin /></ProtectedRoute>;
}
