'use client';

import { Button } from '@repo/ui/button';
import { useAuth } from '@neet/auth';

export default function UnauthorizedPage() {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/auth/login';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
          <svg className="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Access Denied
        </h1>

        <p className="mt-4 text-lg text-gray-600">
          You don't have permission to access the admin dashboard.
        </p>

        <div className="mt-6 space-y-4">
          {user && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-sm text-yellow-700">
                Signed in as: <strong>{user.email}</strong>
              </p>
              <p className="text-sm text-yellow-600 mt-1">
                Role: <strong>{user.role}</strong>
              </p>
            </div>
          )}

          <div className="space-y-3">
            <p className="text-sm text-gray-500">
              Admin privileges are required to access this area.
            </p>

            <Button
              onClick={handleSignOut}
              variant="outline"
              className="w-full"
            >
              Sign out and try different account
            </Button>

            <p className="text-xs text-gray-400">
              Contact your system administrator if you believe this is an error.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}