import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(req: NextRequest): Promise<NextResponse> {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res });

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession();

  // If accessing auth routes while logged in, redirect to dashboard
  if (authRoutes.includes(pathname) && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // If accessing protected routes without session, redirect to login
  if (!publicRoutes.includes(pathname) && !session) {
    const redirectUrl = new URL('/login', req.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // Check user role and institute access for protected routes
  if (session && !publicRoutes.includes(pathname)) {
    try {
      const { data: user, error: userError } = await supabase
        .from('coach_users')
        .select(`
          id,
          role,
          institute_id,
          institutes!inner(
            id,
            name,
            status,
            subscription_tier
          )
        `)
        .eq('id', session.user.id)
        .single();

      if (userError || !user) {
        console.error('Error fetching user data:', userError);
        return NextResponse.redirect(new URL('/login', req.url));
      }

      // Check if institute is active
      if (user.institutes.status !== 'active') {
        return NextResponse.redirect(new URL('/institute/suspended', req.url));
      }

      // Role-based route protection
      const userRole = user.role;
      
      // Admin-only routes
      if (pathname.startsWith('/admin') && userRole !== 'institute_owner') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Teacher-restricted routes
      if (pathname.startsWith('/billing') && userRole === 'teacher') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Parent-only routes
      if (pathname.startsWith('/parent') && userRole !== 'parent') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }

      // Add user data to headers for use in components
      const response = NextResponse.next();
      response.headers.set('x-user-role', userRole);
      response.headers.set('x-institute-id', user.institute_id);
      response.headers.set('x-subscription-tier', user.institutes.subscription_tier);

      return response;
    } catch (error) {
      console.error('Middleware error:', error);
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};