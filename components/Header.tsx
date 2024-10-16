'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { SignInButton } from '@clerk/nextjs';
import { SignedOut } from '@clerk/nextjs';
import { SignedIn } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

const Header: React.FC = () => {
  const pathname = usePathname();

  return (
    <header className="bg-background border-b">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-foreground">
          AI Drafting
        </Link>
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className={`text-muted-foreground hover:text-foreground ${
              pathname === '/' ? 'font-semibold text-foreground' : ''
            }`}
          >
            Home
          </Link>
          <Link
            href="/draft"
            className={`text-muted-foreground hover:text-foreground ${
              pathname === '/draft' ? 'font-semibold text-foreground' : ''
            }`}
          >
            Draft
          </Link>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
