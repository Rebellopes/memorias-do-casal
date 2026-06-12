import type { Metadata } from 'next';
import { GaleriaContent } from './GaleriaContent';

export const metadata: Metadata = {
  title: 'Galeria',
  description: 'Galeria de memórias do casal',
  openGraph: { title: 'Galeria', description: 'Galeria de memórias do casal' },
};

export default function GaleriaPage() {
  return <GaleriaContent />;
}
