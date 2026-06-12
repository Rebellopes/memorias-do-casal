import type { Metadata } from 'next';
import { DedicatoriasContent } from './DedicatoriasContent';

export const metadata: Metadata = {
  title: 'Dedicatórias',
  description: 'Mensagens especiais do casal',
  openGraph: { title: 'Dedicatórias', description: 'Mensagens especiais do casal' },
};

export default function DedicatoriasPage() {
  return <DedicatoriasContent />;
}
