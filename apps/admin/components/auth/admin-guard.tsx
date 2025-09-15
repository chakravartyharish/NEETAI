'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, type AuthState } from '@neet/auth';

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/auth/login');
        return;
      }

      // Check if user has admin role or is authorized for admin access
      const userRole = user.user_metadata?.role || user.app_metadata?.role;
      const isAdmin = userRole === 'admin' || userRole === 'super_admin';

      // For development, you might want to allow certain email domains
      const isDevelopmentAdmin = process.env.NODE_ENV === 'development' &&
        user.email?.endsWith('@neetai.dev');

      if (isAdmin || isDevelopmentAdmin) {
        setIsAuthorized(true);
        setChecking(false);
      } else {
        // User is authenticated but not authorized for admin access
        router.replace('/auth/unauthorized');
        return;
      }
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

  // If we get here, user is authenticated and authorized for admin access
  if (isAuthorized) {
    return <>{children}</>;
  }

  // This should not be reached due to redirects above, but just in case
  return null;
}