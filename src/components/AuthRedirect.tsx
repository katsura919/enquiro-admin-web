'use client';

import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * Component that redirects authenticated users away from auth pages (login/register)
 * Use this on login and register pages to prevent authenticated users from accessing them
 */
export default function AuthRedirect({ children }: AuthRedirectProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If user is authenticated, redirect to home page
    if (!isLoading && user) {
      router.replace('/dashboard'); // Use replace instead of push to prevent back navigation to auth page
    }
  }, [user, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated, don't render the auth page content
  if (user) {
    return null;
  }

  // If user is not authenticated, render the auth page content
  return <>{children}</>;
}
