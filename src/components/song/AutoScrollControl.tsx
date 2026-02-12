'use client';

// ============================================
// Auto Scroll Control Component
// Performance-friendly smooth auto-scroll controls
// ============================================

import React from 'react';
import { useAutoScroll } from '@/hooks/useAutoScroll';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';

interface AutoScrollControlProps {
  className?: string;
  showSpeedIndicator?: boolean;
}

export function AutoScrollControl({
  className,
  showSpeedIndicator = true,
}: AutoScrollControlProps) {
  const {
    isPlaying,
    speed,
    currentPosition,
    start,
    pause,
    toggle,
    setSpeed,
    reset,
  } = useAutoScroll();

  // Format speed display
  const speedDisplay = speed.toFixed(1);

  // Speed presets
  const speedPresets = [0.5, 1, 1.5, 2, 2.5, 3];

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 p-3 rounded-xl',
        'bg-surface-200 border border-surface-300',
        className
      )}
      role='group'
      aria-label='Auto-scroll controls'
    >
      {/* Play/Pause Button */}
      <button
        onClick={toggle}
        className={cn(
          'flex items-center justify-center w-12 h-12 rounded-full',
          isPlaying
            ? 'bg-red-500/20 text-red-500 hover:bg-red-500/30'
            : 'bg-primary-500 text-white hover:bg-primary-600',
          'transition-all duration-200 active:scale-95'
        )}
        aria-label={isPlaying ? 'Pause auto-scroll' : 'Start auto-scroll'}
      >
        {isPlaying ? <Pause size={24} /> : <Play size={24} />}
      </button>

      {/* Speed Slider */}
      <div className='flex items-center gap-3 flex-1 min-w-[150px]'>
        <span className='text-sm text-gray-400'>Speed:</span>
        <input
          type='range'
          min='0.5'
          max='3'
          step='0.1'
          value={speed}
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          className='flex-1 h-2 rounded-full appearance-none cursor-pointer bg-surface-300 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500/50'
          aria-label='Auto-scroll speed'
        />
        {showSpeedIndicator && (
          <span className='min-w-[3rem] text-right font-mono text-primary-400'>
            {speedDisplay}x
          </span>
        )}
      </div>

      {/* Speed Presets */}
      <div className='flex items-center gap-1'>
        {speedPresets.map((preset) => (
          <button
            key={preset}
            onClick={() => setSpeed(preset)}
            className={cn(
              'w-8 h-8 rounded-lg text-sm font-medium',
              speed === preset
                ? 'bg-primary-500 text-white'
                : 'bg-surface-300 text-gray-300 hover:bg-surface-400',
              'transition-all duration-200'
            )}
            aria-label={`Set speed to ${preset}x`}
          >
            {preset}x
          </button>
        ))}
      </div>

      {/* Reset Button */}
      <button
        onClick={reset}
        className={cn(
          'flex items-center justify-center w-10 h-10 rounded-lg',
          'bg-surface-300 text-gray-300',
          'hover:bg-surface-400 hover:text-white',
          'transition-all duration-200'
        )}
        aria-label='Reset scroll position'
      >
        <RotateCcw size={18} />
      </button>

      {/* Progress Indicator */}
      {showSpeedIndicator && (
        <div className='w-full mt-2 pt-2 border-t border-surface-300'>
          <div className='flex items-center gap-2 text-xs text-gray-500'>
            <span>Scroll Progress</span>
            <div className='flex-1 h-1 rounded-full bg-surface-300 overflow-hidden'>
              <div
                className='h-full bg-primary-500 transition-all duration-300'
                style={{ width: '50%' }} // Would need context for actual progress
              />
            </div>
            <span>End</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default AutoScrollControl;

