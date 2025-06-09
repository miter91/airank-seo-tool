'use client'

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading } = useAuth();
  
  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-bold text-xl">
              AIRank Pro
            </Link>
            
            <nav className="flex items-center gap-4">
              {isLoading ? (
                <span className="text-sm text-gray-500">Loading...</span>
              ) : isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="hover:text-blue-600">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      {user?.email?.[0]?.toUpperCase()}
                    </div>
                    {user?.email}
                  </div>
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/analyze">
                    <button className="px-4 py-2 text-sm hover:text-blue-600">
                      Try Free
                    </button>
                  </Link>
                  <Link href="/auth/signin">
                    <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
                      Sign In
                    </button>
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </header>
      
      <main>{children}</main>
    </>
  );
}