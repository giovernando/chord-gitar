'use client';

// ============================================
// Auto Scroll Hook
// Performance-friendly smooth auto-scroll using requestAnimationFrame
// ============================================

import { useState, useRef, useCallback, useEffect } from 'react';
import { AutoScrollState } from '@/types';

interface UseAutoScrollOptions {
  speed?: number; // Initial speed (0.5 - 3.0)
  onComplete?: () => void;
  onPause?: () => void;
}

interface UseAutoScrollReturn extends AutoScrollState {
  start: () => void;
  pause: () => void;
  toggle: () => void;
  setSpeed: (speed: number) => void;
  reset: () => void;
  scrollToPosition: (position: number) => void;
  scrollByAmount: (amount: number) => void;
}

export function useAutoScroll(
  options: UseAutoScrollOptions = {}
): UseAutoScrollReturn {
  const { speed: initialSpeed = 1, onComplete, onPause } = options;
  
  const [state, setState] = useState<AutoScrollState>({
    isPlaying: false,
    speed: initialSpeed,
    currentPosition: 0,
  });
  
  const animationFrameRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);
  const lastTimeRef = useRef<number>(0);
  const positionRef = useRef<number>(0);
  
  // Get scroll container
  const getScrollContainer = useCallback((): HTMLElement | null => {
    if (containerRef.current) return containerRef.current;
    
    // Try to find a scrollable container
    const container = document.querySelector('[data-autoscroll-container]');
    if (container instanceof HTMLElement) {
      containerRef.current = container;
      return container;
    }
    
    // Fallback to window
    return window.document.documentElement;
  }, []);
  
  // Calculate scroll amount based on speed and time delta
  const calculateScrollAmount = useCallback((
    currentTime: number,
    baseSpeed: number
  ): number => {
    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;
    
    // Base scroll: 1px per frame at 1x speed
    // Scale: speed * deltaTime factor
    const scrollFactor = baseSpeed * (deltaTime / 16.67); // Normalize to 60fps
    
    return Math.max(0.5, scrollFactor);
  }, []);
  
  // Animation loop
  const animate = useCallback((currentTime: number) => {
    const container = getScrollContainer();
    if (!container) return;
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      pause();
      return;
    }
    
    const scrollAmount = calculateScrollAmount(currentTime, state.speed);
    const newPosition = positionRef.current + scrollAmount;
    
    // Check if we've reached the end
    const maxScroll = container.scrollHeight - container.clientHeight;
    
    if (newPosition >= maxScroll) {
      positionRef.current = maxScroll;
      setState(prev => ({ ...prev, currentPosition: maxScroll }));
      pause();
      onComplete?.();
      return;
    }
    
    // Scroll
    positionRef.current = newPosition;
    container.scrollTop = newPosition;
    setState(prev => ({ ...prev, currentPosition: newPosition }));
    
    // Continue animation
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.speed, calculateScrollAmount, getScrollContainer, onComplete]);
  
  // Start scrolling
  const start = useCallback(() => {
    if (state.isPlaying) return;
    
    const container = getScrollContainer();
    if (!container) return;
    
    // Sync current position
    positionRef.current = container.scrollTop;
    lastTimeRef.current = performance.now();
    
    setState(prev => ({ ...prev, isPlaying: true }));
    
    animationFrameRef.current = requestAnimationFrame(animate);
  }, [state.isPlaying, getScrollContainer, animate]);
  
  // Pause scrolling
  const pause = useCallback(() => {
    if (!state.isPlaying) return;
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    
    setState(prev => ({ ...prev, isPlaying: false }));
    onPause?.();
  }, [state.isPlaying, onPause]);
  
  // Toggle play/pause
  const toggle = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else {
      start();
    }
  }, [state.isPlaying, pause, start]);
  
  // Set speed
  const setSpeed = useCallback((speed: number) => {
    const clampedSpeed = Math.max(0.5, Math.min(3.0, speed));
    setState(prev => ({ ...prev, speed: clampedSpeed }));
  }, []);
  
  // Reset to beginning
  const reset = useCallback(() => {
    pause();
    
    const container = getScrollContainer();
    if (!container) return;
    
    container.scrollTo({ top: 0, behavior: 'smooth' });
    positionRef.current = 0;
    setState(prev => ({ ...prev, currentPosition: 0 }));
  }, [pause, getScrollContainer]);
  
  // Scroll to specific position
  const scrollToPosition = useCallback((position: number) => {
    const container = getScrollContainer();
    if (!container) return;
    
    const maxScroll = container.scrollHeight - container.clientHeight;
    const clampedPosition = Math.max(0, Math.min(position, maxScroll));
    
    container.scrollTo({ top: clampedPosition, behavior: 'smooth' });
    positionRef.current = clampedPosition;
    setState(prev => ({ ...prev, currentPosition: clampedPosition }));
  }, [getScrollContainer]);
  
  // Scroll by amount
  const scrollByAmount = useCallback((amount: number) => {
    scrollToPosition(positionRef.current + amount);
  }, [scrollToPosition]);
  
  // Handle manual scroll (pause auto-scroll)
  useEffect(() => {
    const handleScroll = () => {
      if (state.isPlaying) {
        pause();
      }
    };
    
    const container = getScrollContainer();
    if (container instanceof HTMLElement) {
      container.addEventListener('scroll', handleScroll, { passive: true });
      return () => container.removeEventListener('scroll', handleScroll);
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [state.isPlaying, pause, getScrollContainer]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return {
    ...state,
    start,
    pause,
    toggle,
    setSpeed,
    reset,
    scrollToPosition,
    scrollByAmount,
  };
}

// Helper function to check reduced motion
export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

