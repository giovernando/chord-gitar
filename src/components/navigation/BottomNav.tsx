'use client';

// ============================================
// Bottom Navigation (Mobile)
// ============================================

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Music, Search, Heart, User } from 'lucide-react';

interface BottomNavProps {
  className?: string;
}

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/chords', label: 'Chords', icon: Music },
  { href: '/songs', label: 'Songs', icon: Search },
  { href: '/favorites', label: 'Favorites', icon: Heart },
  { href: '/profile', label: 'Profile', icon: User },
] as const;

export function BottomNav({ className }: BottomNavProps) {
  const pathname = usePathname();
  
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'h-nav-height min-h-touch',
        'bg-background/95 backdrop-blur-md',
        'border-t border-surface-300',
        'md:hidden',
        className
      )}
      aria-label='Bottom navigation'
    >
      <ul className='flex h-full items-center justify-around'>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <li key={item.href} className='flex-1 h-full'>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center h-full',
                  'min-h-touch px-2',
                  'transition-colors duration-200',
                  isActive
                    ? 'text-primary-500'
                    : 'text-gray-400 hover:text-white'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  size={24}
                  className={cn(
                    'mb-1 transition-transform',
                    isActive && 'scale-110'
                  )}
                  aria-hidden='true'
                />
                <span className='text-xs font-medium truncate max-w-full'>
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// ============================================
// Top Navigation (Desktop)
// ============================================

interface TopNavProps {
  className?: string;
}

export function TopNav({ className }: TopNavProps) {
  const pathname = usePathname();
  
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16',
        'bg-background/95 backdrop-blur-md',
        'border-b border-surface-300',
        'hidden md:flex',
        className
      )}
    >
      <nav
        className='flex items-center justify-between w-full max-w-7xl mx-auto px-4 lg:px-8'
        aria-label='Top navigation'
      >
        {/* Logo */}
        <Link href='/' className='flex items-center gap-2'>
          <Music className='w-8 h-8 text-primary-500' aria-hidden='true' />
          <span className='text-xl font-bold text-white'>
            GuitarChords
          </span>
        </Link>
        
        {/* Navigation Links */}
        <ul className='flex items-center gap-1'>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg',
                    'min-h-touch transition-colors duration-200',
                    isActive
                      ? 'bg-primary-500/10 text-primary-500'
                      : 'text-gray-400 hover:text-white hover:bg-surface-300'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon size={20} aria-hidden='true' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        
        {/* Search Button (optional) */}
        <Link
          href='/songs'
          className='flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-300 text-gray-300 hover:bg-surface-400 transition-colors'
        >
          <Search size={20} aria-hidden='true' />
          <span className='text-sm'>Search...</span>
        </Link>
      </nav>
    </header>
  );
}

// ============================================
// Main Navigation Wrapper
// ============================================

export function Navigation() {
  return (
    <>
      <TopNav />
      <BottomNav />
    </>
  );
}

export default Navigation;

