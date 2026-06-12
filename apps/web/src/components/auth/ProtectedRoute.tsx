'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/admin', { method: 'POST', body: '{}' })
      .then((r) => r.json())
      .then((data) => {
        if (!data.success) router.push('/auth');
        else setChecked(true);
      });
  }, [router]);

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-rose-500" />
      </div>
    );
  }

  return <>{children}</>;
}
