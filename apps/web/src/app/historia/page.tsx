import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nossa História',
  description: 'A história do nosso relacionamento',
  openGraph: { title: 'Nossa História', description: 'A história do nosso relacionamento' },
};

export default function HistoriaPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="mb-8 font-serif text-4xl font-bold text-stone-900">Nossa História</h1>
      <div className="prose prose-stone mx-auto">
        <p className="text-stone-400">
          A história de como tudo começou será escrita aqui em breve...
        </p>
      </div>
    </div>
  );
}
