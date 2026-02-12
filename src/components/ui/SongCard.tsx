'use client';

// ============================================
// Song Card Component
// Displays song information in a card format
// ============================================

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Heart, Music } from 'lucide-react';
import { SearchResult } from '@/types';

interface SongCardProps {
  song: SearchResult;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  className?: string;
}

export function SongCard({
  song,
  isFavorite = false,
  onFavoriteToggle,
  className,
}: SongCardProps) {
  return (
    <Link
      href={`/songs/${song.id}`}
      className={cn(
        'group flex items-start gap-4 p-4 rounded-xl',
        'bg-surface-200 border border-surface-300',
        'hover:border-primary-500/50 hover:bg-surface-100',
        'transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
    >
      {/* Thumbnail */}
      <div className='relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-surface-300'>
        {song.headerImageUrl ? (
          <Image
            src={song.headerImageUrl}
            alt={`${song.title} cover`}
            fill
            className='object-cover'
            sizes='64px'
          />
        ) : (
          <div className='flex items-center justify-center w-full h-full'>
            <Music className='w-8 h-8 text-gray-500' aria-hidden='true' />
          </div>
        )}
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <h3 className='font-semibold text-white truncate group-hover:text-primary-400 transition-colors'>
          {song.title}
        </h3>
        <p className='text-sm text-gray-400 truncate mt-1'>
          {song.artist}
        </p>
        <div className='flex items-center gap-2 mt-2'>
          <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-500/20 text-primary-400'>
            {song.type}
          </span>
        </div>
      </div>

      {/* Favorite Button */}
      {onFavoriteToggle && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onFavoriteToggle();
          }}
          className={cn(
            'flex-shrink-0 p-2 rounded-full',
            'transition-all duration-200',
            isFavorite
              ? 'text-red-500 bg-red-500/20'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-500/20'
          )}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          aria-pressed={isFavorite}
        >
          <Heart
            size={20}
            className={cn(isFavorite && 'fill-current')}
          />
        </button>
      )}
    </Link>
  );
}

// ============================================
// Chord Card Component
// ============================================

interface ChordCardProps {
  chord: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  onClick?: () => void;
  className?: string;
}

export function ChordCard({
  chord,
  difficulty = 'beginner',
  onClick,
  className,
}: ChordCardProps) {
  const difficultyColors = {
    beginner: 'bg-chord-beginner/20 text-chord-beginner border-chord-beginner/30',
    intermediate: 'bg-chord-default/20 text-chord-default border-chord-default/30',
    advanced: 'bg-chord-advanced/20 text-chord-advanced border-chord-advanced/30',
  };

  const Content = (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 rounded-xl',
        'bg-surface-200 border-2 border-surface-300',
        'hover:border-primary-500/50 hover:bg-surface-100',
        'transition-all duration-200',
        onClick && 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500',
        className
      )}
      onClick={onClick}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      aria-label={`Chord: ${chord}`}
    >
      <span className='text-4xl font-bold font-mono text-white'>
        {chord}
      </span>
      <span className={cn(
        'mt-2 px-2 py-1 rounded-full text-xs font-medium border',
        difficultyColors[difficulty]
      )}>
        {difficulty}
      </span>
    </div>
  );

  return Content;
}

export default SongCard;

