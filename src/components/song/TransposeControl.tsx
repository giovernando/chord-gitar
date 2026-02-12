'use client';

// ============================================
// Transpose Control Component
// Professional chord transposition UI
// ============================================

import React from 'react';
import { useTranspose } from '@/hooks/useTranspose';
import { cn } from '@/lib/utils';
import { ChevronUp, ChevronDown, RotateCcw, Music } from 'lucide-react';

interface TransposeControlProps {
  originalKey?: string;
  className?: string;
  showEasyMode?: boolean;
}

export function TransposeControl({
  originalKey,
  className,
  showEasyMode = true,
}: TransposeControlProps) {
  const {
    semitones,
    targetKey,
    setSemitones,
    incrementSemitones,
    decrementSemitones,
    setTargetKey,
    reset,
    easyModeKeys,
    allKeys,
  } = useTranspose({ originalKey });

  // Format semitones display
  const semitoneDisplay = semitones > 0 
    ? `+${semitones}` 
    : semitones.toString();

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-2 p-3 rounded-xl',
        'bg-surface-200 border border-surface-300',
        className
      )}
      role='group'
      aria-label='Chord transposition controls'
    >
      {/* Label */}
      <span className='text-sm font-medium text-gray-400 mr-2'>
        Transpose
      </span>

      {/* Decrease Button */}
      <button
        onClick={decrementSemitones}
        disabled={semitones <= -12}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-surface-300 text-white',
          'hover:bg-surface-400 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
        aria-label='Decrease transpose by one semitone'
      >
        <ChevronDown size={20} />
      </button>

      {/* Current Semitones Display */}
      <div
        className='flex items-center justify-center min-w-[4rem] px-3 py-2 rounded-lg bg-primary-500/20 text-primary-400 font-mono font-semibold text-lg'
      >
        {semitoneDisplay}
      </div>

      {/* Increase Button */}
      <button
        onClick={incrementSemitones}
        disabled={semitones >= 12}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-surface-300 text-white',
          'hover:bg-surface-400 active:scale-95',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
        aria-label='Increase transpose by one semitone'
      >
        <ChevronUp size={20} />
      </button>

      {/* Target Key Dropdown */}
      <div className='relative'>
        <select
          value={targetKey || ''}
          onChange={(e) => setTargetKey(e.target.value)}
          className={cn(
            'h-10 px-3 pr-8 rounded-lg appearance-none',
            'bg-surface-300 text-white',
            'border border-transparent',
            'focus:border-primary-500 focus:outline-none',
            'cursor-pointer',
            'text-sm font-medium'
          )}
          aria-label='Select target key'
        >
          <option value=''>Original</option>
          {allKeys.map((key) => (
            <option key={key} value={key}>
              {key}
            </option>
          ))}
        </select>
        <Music
          size={16}
          className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none'
          aria-hidden='true'
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        disabled={semitones === 0 && !targetKey}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-surface-300 text-gray-300',
          'hover:bg-surface-400 hover:text-white',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all duration-200'
        )}
        aria-label='Reset transposition'
      >
        <RotateCcw size={18} />
      </button>

      {/* Easy Mode Suggestions */}
      {showEasyMode && easyModeKeys.length > 0 && (
        <div className='w-full mt-2 pt-2 border-t border-surface-300'>
          <span className='text-xs text-gray-500 block mb-2'>
            Easy Mode Keys
          </span>
          <div className='flex flex-wrap gap-2'>
            {easyModeKeys.map(({ key, difficulty, reason }) => (
              <button
                key={key}
                onClick={() => setTargetKey(key)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 rounded-full',
                  'bg-chord-beginner/20 text-chord-beginner',
                  'hover:bg-chord-beginner/30',
                  'transition-all duration-200'
                )}
                aria-label={`Transpose to ${key}: ${reason}`}
              >
                <span className='font-semibold'>{key}</span>
                <span className='text-xs opacity-75'>{difficulty} semitones</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TransposeControl;

