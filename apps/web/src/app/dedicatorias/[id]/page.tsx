import type { Metadata } from 'next';
import { DedicatoriaContent } from './DedicatoriaContent';

export const metadata: Metadata = {
  title: 'Dedicatória',
  openGraph: { title: 'Dedicatória' },
};

export default function DedicatoriaPage() {
  return <DedicatoriaContent />;
}
