// Sign In API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, handleAuthError } from '@neet/auth';

// Basic validation function
function validateSignInData(data: any) {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();

    // Parse request body
    const body = await request.json();

    // Validate input
    const validationErrors = validateSignInData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    const { email, password } = body;

    // Sign in with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error('Sign in error:', authError);
      
      // Return generic error for security (don't reveal if email exists)
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Sign in failed' },
        { status: 401 }
      );
    }

    // Get additional user profile data
    const { data: coachProfile } = await (supabase as any)
      .from('coach_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    const { data: userProfile } = await (supabase as any)
      .from('comprehensive_user_profiles')
      .select('*')
      .eq('student_id', authData.user.id)
      .single();

    // Check if email is verified
    if (!authData.user.email_confirmed_at) {
      return NextResponse.json(
        { 
          error: 'Email not verified',
          message: 'Please check your email and click the verification link before signing in.',
          requiresVerification: true
        },
        { status: 403 }
      );
    }

    // Return success response with user data
    return NextResponse.json(
      {
        message: 'Sign in successful',
        user: {
          id: authData.user.id,
          email: authData.user.email,
          full_name: coachProfile ? coachProfile.full_name || authData.user.user_metadata?.full_name || 'User' : authData.user.user_metadata?.full_name || 'User',
          role: coachProfile ? coachProfile.role || 'student' : 'student',
          avatar_url: coachProfile ? coachProfile.avatar_url || null : null,
          institute_id: coachProfile ? coachProfile.institute_id || null : null,
          profile: userProfile || null,
          created_at: authData.user.created_at,
          updated_at: authData.user.updated_at,
        },
        session: {
          access_token: authData.session?.access_token,
          refresh_token: authData.session?.refresh_token,
          expires_at: authData.session?.expires_at,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('SignIn API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
