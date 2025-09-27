// Email Verification Page for NEET Prep AI Platform
// Story 1.1: User Authentication System

'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
// import { createClientSupabase } from '@neet/auth';

// Temporary mock for Supabase client
const createClientSupabase = () => ({
  auth: {
    getSession: async () => ({ data: null, error: 'Not implemented' }),
    resend: async () => ({ error: 'Not implemented' })
  }
});

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const supabase = createClientSupabase();

  // Check if this is an email confirmation callback
  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const hashFragment = window.location.hash;
      
      if (hashFragment.includes('access_token')) {
        setLoading(true);
        
        try {
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            setError('Email verification failed. The link may be expired or invalid.');
            return;
          }

          if (data.session) {
            setMessage('Email verified successfully! Redirecting to dashboard...');
            
            // Redirect to dashboard after successful verification
            setTimeout(() => {
              window.location.href = '/dashboard';
            }, 2000);
          }
        } catch (error) {
          setError('Email verification failed. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    };

    handleEmailConfirmation();
  }, [supabase.auth]);

  const handleResendEmail = async () => {
    if (!email) {
      setError('No email address provided');
      return;
    }

    setLoading(true);
    setError('');
    setMessage('');

    try {
      const { error } = await supabase.auth.resend();

      if (error) {
        setError('Failed to resend verification email. Please try again.');
      } else {
        setMessage('Verification email sent! Please check your inbox.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            {/* Email Icon */}
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h2 className="mt-6 text-xl font-bold text-gray-900">
              Verify Your Email
            </h2>

            {/* Success Message */}
            {message && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-md p-3">
                <p className="text-sm text-green-600">{message}</p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            {/* Default Instructions */}
            {!message && !error && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  {email ? (
                    <>
                      We've sent a verification email to <strong>{email}</strong>. 
                      Please check your inbox and click the verification link to activate your account.
                    </>
                  ) : (
                    'Please check your email for a verification link to activate your account.'
                  )}
                </p>
                
                <p className="mt-2 text-xs text-gray-500">
                  Didn't receive the email? Check your spam folder or click below to resend.
                </p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {/* Resend Email Button */}
              {email && (
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
                    loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Resend Verification Email'
                  )}
                </button>
              )}

              {/* Navigation Buttons */}
              <div className="flex space-x-3">
                <a
                  href="/login"
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Sign In
                </a>
                <a
                  href="/"
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors text-center"
                >
                  Home
                </a>
              </div>
            </div>

            {/* Help Text */}
            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-gray-500">
                Having trouble verifying your email?{' '}
                <a href="/auth/help" className="text-blue-600 hover:underline">
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Email Tips */}
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">
            Email not arriving?
          </h3>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Check your spam or junk mail folder</li>
            <li>• Ensure you entered the correct email address</li>
            <li>• Wait a few minutes - emails can take time to deliver</li>
            <li>• Try adding noreply@neetai.com to your contacts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
