'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@neet/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/auth/login');
        return;
      }

      if (user.role !== 'admin') {
        // Not an admin, redirect to unauthorized page
        router.replace('/auth/unauthorized');
        return;
      }

      // User is authenticated and is an admin
      setChecking(false);
    }
  }, [user, loading, router]);

  // Show loading spinner while checking authentication
  if (loading || checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If we get here, user is authenticated and is an admin
  return <>{children}</>;
}