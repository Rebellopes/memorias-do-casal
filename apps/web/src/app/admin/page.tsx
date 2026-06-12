'use client';

import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/components/auth/AuthProvider';
import { useRouter } from 'next/navigation';

function AdminContent() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-3xl font-semibold text-stone-900">Administração</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-stone-500">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="rounded-lg border border-stone-200 px-3 py-1.5 text-sm text-stone-600 transition-colors hover:border-stone-300 hover:text-stone-900"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AdminCard title="Perfis" description="Editar Sobre Nós" href="/admin/perfis" />
        <AdminCard title="História" description="Editar capítulos" href="/admin/historia" />
        <AdminCard title="Galeria" description="Gerenciar fotos" href="/admin/galeria" />
        <AdminCard title="Dedicatórias" description="Criar e editar" href="/admin/dedicatorias" />
        <AdminCard title="Eventos" description="Datas especiais" href="/admin/eventos" />
        <AdminCard title="Recados" description="Recado do Dia" href="/admin/recados" />
        <AdminCard title="Integrações" description="Spotify + Google Fotos" href="/admin/integracoes" />
      </div>
    </div>
  );
}

function AdminCard({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a
      href={href}
      className="group rounded-xl border border-stone-200 p-5 transition-colors hover:border-rose-200 hover:bg-rose-50/30"
    >
      <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-rose-700">
        {title}
      </h3>
      <p className="mt-1 text-sm text-stone-500">{description}</p>
    </a>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}
