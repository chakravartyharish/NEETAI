'use client';

import { usePathname } from 'next/navigation';
import { AdminGuard } from './admin-guard';

interface ConditionalGuardProps {
  children: React.ReactNode;
}

export function ConditionalGuard({ children }: ConditionalGuardProps) {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </AdminGuard>
  );
}