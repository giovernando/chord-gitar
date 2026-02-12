'use client';

// ============================================
// Transpose Hook
// Manages chord transposition state and logic
// ============================================

import { useState, useCallback, useMemo } from 'react';
import { TranspositionState, SemitoneShift, EasyModeKey } from '@/types';
import { 
  transposeChord, 
  transposeLyrics, 
  detectKey, 
  transposeKey,
  suggestEasyModeKeys,
  getAllKeys 
} from '@/utils/transpose';

interface UseTransposeOptions {
  originalKey?: string;
  onKeyDetected?: (key: string) => void;
}

interface UseTransposeReturn extends TranspositionState {
  setSemitones: (semitones: SemitoneShift) => void;
  incrementSemitones: () => void;
  decrementSemitones: () => void;
  setTargetKey: (key: string) => void;
  transpose: (chord: string) => string;
  transposeLyrics: (lyrics: string) => string;
  reset: () => void;
  easyModeKeys: EasyModeKey[];
  allKeys: string[];
}

export function useTranspose(options: UseTransposeOptions = {}): UseTransposeReturn {
  const { originalKey, onKeyDetected } = options;
  
  const [semitones, setSemitonesState] = useState<SemitoneShift>(0);
  const [targetKey, setTargetKey] = useState<string | undefined>(undefined);
  
  // Auto-detect key from chords and notify
  const detectAndNotify = useCallback((chords: string[]) => {
    if (!originalKey) {
      const detection = detectKey(chords);
      if (detection.confidence !== 'low' && onKeyDetected) {
        onKeyDetected(detection.detectedKey);
      }
    }
  }, [originalKey, onKeyDetected]);
  
  // Set semitones with bounds checking
  const setSemitones = useCallback((newSemitones: SemitoneShift) => {
    const clamped = Math.max(-12, Math.min(12, newSemitones)) as SemitoneShift;
    setSemitonesState(clamped);
    
    // Update target key
    if (originalKey) {
      const newKey = transposeKey(originalKey, clamped);
      setTargetKey(newKey);
    }
  }, [originalKey]);
  
  // Increment/decrement semitones
  const incrementSemitones = useCallback(() => {
    setSemitonesState(prev => Math.min(12, prev + 1) as SemitoneShift);
  }, []);
  
  const decrementSemitones = useCallback(() => {
    setSemitonesState(prev => Math.max(-12, prev - 1) as SemitoneShift);
  }, []);
  
  // Set target key (calculates semitones needed)
  const setTargetKeyCallback = useCallback((key: string) => {
    if (originalKey) {
      const shift = transposeKey(originalKey, key);
      setSemitonesState(shift);
    }
    setTargetKey(key);
  }, [originalKey]);
  
  // Transpose a single chord
  const transpose = useCallback((chord: string): string => {
    return transposeChord(chord, semitones);
  }, [semitones]);
  
  // Transpose lyrics with inline chords
  const transposeLyricsCallback = useCallback((lyrics: string): string => {
    return transposeLyrics(lyrics, semitones);
  }, [semitones]);
  
  // Reset to original
  const reset = useCallback(() => {
    setSemitonesState(0);
    setTargetKey(undefined);
  }, []);
  
  // Easy mode key suggestions
  const easyModeKeys = useMemo((): EasyModeKey[] => {
    const currentKey = originalKey || 'C';
    const suggestions = suggestEasyModeKeys(currentKey);
    
    return suggestions.slice(0, 5).map(({ key, distance }) => ({
      key,
      difficulty: Math.abs(distance),
      reason: getEasyModeReason(key),
    }));
  }, [originalKey]);
  
  // All available keys
  const allKeys = useMemo(() => getAllKeys(), []);
  
  return {
    semitones,
    originalKey,
    targetKey,
    setSemitones,
    incrementSemitones,
    decrementSemitones,
    setTargetKey: setTargetKeyCallback,
    transpose,
    transposeLyrics: transposeLyricsCallback,
    reset,
    easyModeKeys,
    allKeys,
  };
}

// Helper function for easy mode reasons
function getEasyModeReason(key: string): string {
  const easyKeys: Record<string, string> = {
    'G': 'Open position, common chords',
    'C': 'Open position, beginner friendly',
    'D': 'Simple fingerings',
    'A': 'Easy barre chords',
    'E': 'Open position',
    'Am': 'Simple minor chord',
    'Em': 'Two-finger chord',
    'Dm': 'Common progression chord',
  };
  return easyKeys[key] || 'Good for beginners';
}


