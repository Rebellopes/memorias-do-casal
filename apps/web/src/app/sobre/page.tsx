import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sobre Nós',
  description: 'Conheça um pouco mais sobre nós',
  openGraph: { title: 'Sobre Nós', description: 'Conheça um pouco mais sobre nós' },
};

export default function SobrePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-12 text-center font-serif text-4xl font-bold text-stone-900">Sobre Nós</h1>
      <div className="grid gap-12 sm:grid-cols-2">
        <div className="text-center">
          <div className="mx-auto mb-4 h-40 w-40 rounded-full bg-stone-100" />
          <h2 className="font-serif text-2xl font-medium text-stone-700">Pessoa A</h2>
          <p className="mt-2 text-sm text-stone-400">Biografia será adicionada em breve...</p>
        </div>
        <div className="text-center">
          <div className="mx-auto mb-4 h-40 w-40 rounded-full bg-stone-100" />
          <h2 className="font-serif text-2xl font-medium text-stone-700">Pessoa B</h2>
          <p className="mt-2 text-sm text-stone-400">Biografia será adicionada em breve...</p>
        </div>
      </div>
    </div>
  );
}
