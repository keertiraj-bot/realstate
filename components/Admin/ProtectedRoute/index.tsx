'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/admin/login');
        return;
      }

      // Check admin role
      const { data: { user } } = await supabase.auth.getUser();
      const userMetadata = user?.user_metadata || {};
      const role = (userMetadata.role as string) || '';

      if (role !== 'admin') {
        router.push('/');
        return;
      }

      setIsAdmin(true);
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/admin/login');
      } else {
        // Re-check admin role on session change
        checkAuth();
      }
    });

    return () => subscription.unsubscribe();
  }, [router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return <>{children}</>;
}
