import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="font-serif text-6xl font-bold text-stone-200">404</h1>
      <h2 className="mt-4 font-serif text-2xl text-stone-600">Página não encontrada</h2>
      <p className="mt-2 text-stone-400">
        Essa página não existe nas nossas memórias
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full border border-stone-200 px-6 py-2 text-sm text-stone-600 transition-colors hover:border-rose-300 hover:text-rose-600"
      >
        Voltar para Home
      </Link>
    </div>
  );
}
