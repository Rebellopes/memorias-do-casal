import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Nossas Memórias',
    template: '%s — Nossas Memórias',
  },
  description: 'Uma cápsula do tempo digital do nosso amor',
  openGraph: {
    title: 'Nossas Memórias',
    description: 'Uma cápsula do tempo digital do nosso amor',
    siteName: 'Nossas Memórias',
    type: 'website',
    locale: 'pt_BR',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-white text-stone-900 antialiased transition-colors dark:bg-stone-950 dark:text-stone-100">
        <ThemeProvider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
