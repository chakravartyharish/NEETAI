// Session API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@neet/auth';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
      console.error('Session error:', sessionError);
      return NextResponse.json(
        { error: 'Failed to get session', user: null },
        { status: 401 }
      );
    }

    if (!session || !session.user) {
      return NextResponse.json(
        { user: null, session: null },
        { status: 200 }
      );
    }

    // Get complete user data
    const { data: student, error: studentError } = await (supabase as any)
      .from('students')
      .select(`
        *,
        user_profiles (*)
      `)
      .eq('id', session.user.id)
      .single();

    if (studentError) {
      console.error('Error fetching user data:', studentError);
      return NextResponse.json(
        { error: 'Failed to fetch user data', user: null },
        { status: 500 }
      );
    }

    // Return user data and session info
    return NextResponse.json(
      {
        user: student ? {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          phone: student.phone,
          role: student.role,
          tier: student.tier,
          onboarding_completed: student.onboarding_completed,
          preferences: student.preferences,
          profile: student.user_profiles?.[0] || null,
          created_at: student.created_at,
          updated_at: student.updated_at,
        } : null,
        session: {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: session.expires_at,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', user: null },
      { status: 500 }
    );
  }
}

// Handle session refresh
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();
    
    const { refresh_token } = await request.json();

    if (!refresh_token) {
      return NextResponse.json(
        { error: 'Refresh token is required' },
        { status: 400 }
      );
    }

    // Refresh the session
    const { data, error } = await supabase.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      console.error('Session refresh error:', error);
      return NextResponse.json(
        { error: 'Failed to refresh session' },
        { status: 401 }
      );
    }

    if (!data.session) {
      return NextResponse.json(
        { error: 'Invalid refresh token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at,
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Session refresh API error:', error);
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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
