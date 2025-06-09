'use client'

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { signOut } from 'next-auth/react';
import { User, LogOut } from 'lucide-react';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated } = useAuth();
  
  return (
    <>
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="font-bold text-xl">
              AIRank Pro
            </Link>
            
            <nav className="flex items-center gap-4">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="hover:text-blue-600">
                    Dashboard
                  </Link>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <User className="h-4 w-4" />
                    {user?.email}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => signOut({ callbackUrl: '/' })}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/analyze">
                    <Button variant="ghost">Try Free</Button>
                  </Link>
                  <Link href="/auth/signin">
                    <Button>Sign In</Button>
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