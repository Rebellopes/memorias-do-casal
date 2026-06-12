'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TimeCounter } from '@/components/TimeCounter';
import { MusicBadge } from '@/components/MusicBadge';
import { ThemeToggle } from '@/components/ThemeToggle';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/historia', label: 'Nossa História' },
  { href: '/sobre', label: 'Sobre Nós' },
  { href: '/galeria', label: 'Galeria' },
  { href: '/musica', label: 'Música' },
  { href: '/dedicatorias', label: 'Dedicatórias' },
];

const START_DATE = new Date('2023-06-15');

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [admin, setAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/admin/check')
      .then((r) => r.json())
      .then((d) => setAdmin(d.authenticated));
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isAdminPage = pathname?.startsWith('/admin');
  const isAuthPage = pathname?.startsWith('/auth');

  if (isAuthPage) return null;

  const handleLogout = async () => {
    await fetch('/api/auth/admin', { method: 'DELETE' });
    setAdmin(false);
    if (isAdminPage) router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            Nossas Memórias
          </Link>
          {admin && (
            <Link
              href="/admin"
              className={`hidden sm:inline text-base transition-colors ${
                isAdminPage
                  ? 'font-medium text-rose-600 dark:text-rose-400'
                  : 'text-stone-400 hover:text-stone-600 dark:hover:text-stone-300'
              }`}
            >
              Admin
            </Link>
          )}
        </div>

        {!isAdminPage && (
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base transition-colors ${
                    isActive
                      ? 'font-medium text-rose-600 dark:text-rose-400'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="flex items-center gap-2 sm:gap-3">
          {!isAdminPage && <TimeCounter startDate={START_DATE} compact />}
          {!isAdminPage && <MusicBadge />}
          <ThemeToggle />
          {!isAdminPage && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex md:hidden items-center justify-center h-9 w-9 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
              aria-label="Menu"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
          {admin && isAdminPage && (
            <button onClick={handleLogout} className="text-sm text-stone-400 hover:text-stone-600">
              Sair
            </button>
          )}
        </div>
      </div>

      {menuOpen && !isAdminPage && (
        <nav className="border-t border-stone-100 bg-white px-4 py-4 md:hidden dark:border-stone-800 dark:bg-stone-950">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base transition-colors ${
                    isActive
                      ? 'font-medium text-rose-600 dark:text-rose-400'
                      : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            {admin && (
              <Link
                href="/admin"
                className={`text-base transition-colors ${
                  isAdminPage
                    ? 'font-medium text-rose-600 dark:text-rose-400'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
              >
                Admin
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
