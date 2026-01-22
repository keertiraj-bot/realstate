import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        cookiesToSet.forEach((cookie) => {
          request.cookies.set(cookie.name, cookie.value);
          response.cookies.set(cookie.name, cookie.value, cookie.options);
        });
      },
    },
  });

  const { data: { session } } = await supabase.auth.getSession();

  const currentPath = request.nextUrl.pathname;
  const isAdminRoute = currentPath.startsWith('/admin');
  const isLoginRoute = currentPath === '/admin/login';

  // Allow access to login page
  if (isLoginRoute) {
    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      const userMetadata = user?.user_metadata || {};
      const role = (userMetadata.role as string) || '';

      if (role === 'admin') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return response;
  }

  // Protect all admin routes
  if (isAdminRoute && !isLoginRoute) {
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { data: { user } } = await supabase.auth.getUser();
    const userMetadata = user?.user_metadata || {};
    const role = (userMetadata.role as string) || '';

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ['/admin/:path*'],
};
