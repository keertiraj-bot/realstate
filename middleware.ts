import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const protectedRoutes = ['/admin/dashboard', '/admin/properties', '/admin/leads'];
  const currentPath = request.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some(route => currentPath.startsWith(route));
  const isLoginPage = currentPath === '/admin/login';

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isLoginPage && session) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
