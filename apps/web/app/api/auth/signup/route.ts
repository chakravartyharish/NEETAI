// Sign Up API Route for NEET Prep AI Platform
// Story 1.1: User Authentication System

import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase, handleAuthError } from '@neet/auth';

// Basic validation function
function validateSignUpData(data: any) {
  const errors: string[] = [];

  if (!data.email || typeof data.email !== 'string') {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('Password is required');
  } else {
    if (data.password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }
    if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one number');
    }
  }

  if (!data.full_name || typeof data.full_name !== 'string' || data.full_name.length < 2) {
    errors.push('Full name must be at least 2 characters');
  }

  if (data.role && !['student', 'coach', 'parent', 'admin'].includes(data.role)) {
    errors.push('Invalid role specified');
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase();

    // Parse request body
    const body = await request.json();

    // Validate input
    const validationErrors = validateSignUpData(body);
    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validationErrors
        },
        { status: 400 }
      );
    }

    const { email, password, full_name, role = 'student', phone } = body;

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('students')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 409 }
      );
    }

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role,
        },
      },
    });

    if (authError) {
      console.error('Auth signup error:', authError);
      return NextResponse.json(
        { error: handleAuthError(authError) },
        { status: 400 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user account' },
        { status: 500 }
      );
    }

    // Create student record
    const { data: student, error: studentError } = await (supabase as any)
      .from('students')
      .insert({
        id: authData.user.id,
        email,
        full_name,
        phone: phone || null,
        role,
        tier: 'free' as const,
        onboarding_completed: false,
        preferences: {},
      })
      .select()
      .single();

    if (studentError) {
      console.error('Student creation error:', studentError);
      
      // Try to clean up auth user if student creation fails
      try {
        await supabase.auth.admin.deleteUser(authData.user.id);
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError);
      }

      return NextResponse.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      );
    }

    // Create user profile
    const { error: profileError } = await (supabase as any)
      .from('user_profiles')
      .insert({
        student_id: authData.user.id,
        study_hours_per_day: 2,
        preferred_subjects: [],
        weak_areas: [],
        timezone: 'Asia/Kolkata',
      });

    if (profileError) {
      console.error('Profile creation error:', profileError);
      // Don't fail the entire signup if profile creation fails
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'Account created successfully. Please check your email to verify your account.',
        user: student ? {
          id: student.id,
          email: student.email,
          full_name: student.full_name,
          role: student.role,
          tier: student.tier,
          onboarding_completed: student.onboarding_completed,
        } : null
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Signup API error:', error);
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
