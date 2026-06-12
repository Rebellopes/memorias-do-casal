'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
  const isAdmin = pathname?.startsWith('/admin') || pathname?.startsWith('/auth');

  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-100 bg-white/80 backdrop-blur-md transition-colors dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight text-stone-900 dark:text-stone-100">
          Nossas Memórias
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm transition-colors ${
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

        <div className="flex items-center gap-3">
          <TimeCounter startDate={START_DATE} compact />
          <MusicBadge />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
