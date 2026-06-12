import type { Metadata } from 'next';
import { MusicaContent } from './MusicaContent';

export const metadata: Metadata = {
  title: 'Música',
  description: 'Atividade musical do casal',
  openGraph: { title: 'Música', description: 'Atividade musical do casal' },
};

export default function MusicaPage() {
  return <MusicaContent />;
}
