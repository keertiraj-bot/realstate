import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface AdminSession {
  userId: string;
  email: string;
  role: string;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  try {
    // @ts-ignore - Supabase auth-helpers type mismatch
    const supabase = createServerComponentClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session) {
      return null;
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const userMetadata = user.user_metadata || {};
    const role = (userMetadata.role as string) || '';

    return {
      userId: user.id,
      email: user.email || '',
      role: role,
    };
  } catch {
    return null;
  }
}

export async function requireAdminAuth(): Promise<AdminSession> {
  const session = await getAdminSession();

  if (!session) {
    redirect('/admin/login');
  }

  return session;
}

export async function requireAdminRole(): Promise<AdminSession> {
  const session = await requireAdminAuth();

  if (session.role !== 'admin') {
    redirect('/admin/login');
  }

  return session;
}

export async function isAuthenticatedAdmin(): Promise<boolean> {
  const session = await getAdminSession();
  return session !== null && session.role === 'admin';
}
