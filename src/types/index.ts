// ============================================
// Core Types for Guitar Chord & Song Platform
// ============================================

import React from 'react'

// ----------------------
// Song & Lyrics Types
// ----------------------

export interface SongMetadata {
  id: number; // Genius ID
  title: string;
  artist: string;
  album?: string;
  releaseDate?: string;
  headerImageUrl?: string;
  coverArtUrl?: string;
  url: string;
}

export interface LyricsResponse {
  lyrics: string;
  source: 'genius' | 'fallback';
  validated: boolean;
  validationErrors?: string[];
}

export interface SongSection {
  type: 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'bridge' | 'outro' | 'other';
  content: string;
  chords?: string[];
  isChorus?: boolean;
}

export interface ParsedSong {
  metadata: SongMetadata;
  sections: SongSection[];
  originalKey?: string;
  detectedChords: string[];
}

// ----------------------
// Chord Types
// ----------------------

export interface ChordFingering {
  string: number; // 1-6 (high E to low E)
  fret: number;
  finger?: number;
}

export interface ChordDiagram {
  chord: string;
  positions: ChordFingering[];
  baseFret: number;
  barred?: boolean;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface ChordLibraryEntry {
  name: string;
  family: 'major' | 'minor' | '7' | 'maj7' | 'm7' | 'sus' | 'dim' | 'aug' | 'add' | 'slash';
  intervals: number[];
  diagrams: ChordDiagram[];
  beginnerFriendly: boolean;
}

// ----------------------
// Transposition Types
// ----------------------

export type SemitoneShift = -12 | -11 | -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export interface TranspositionState {
  semitones: SemitoneShift;
  originalKey?: string;
  targetKey?: string;
}

export interface EasyModeKey {
  key: string;
  difficulty: number;
  reason: string;
}

// ----------------------
// User & Auth Types
// ----------------------

export interface User {
  id: string;
  email: string;
  createdAt: Date;
  lastSignInAt?: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  songId: string; // Genius ID
  songTitle: string;
  songArtist: string;
  createdAt: Date;
}

// ----------------------
// Search Types
// ----------------------

export interface SearchResult {
  id: number;
  title: string;
  artist: string;
  headerImageUrl?: string;
  url: string;
  type: 'song' | 'artist' | 'album';
}

export interface SearchFilters {
  query: string;
  page?: number;
  perPage?: number;
  type?: 'songs' | 'artists' | 'all';
}

// ----------------------
// API Response Types
// ----------------------

export interface ApiResponse<T> {
  data?: T;
  error?: ApiError;
  success: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// ----------------------
// Auto-Scroll Types
// ----------------------

export interface AutoScrollState {
  isPlaying: boolean;
  speed: number; // 0.5 to 3.0
  currentPosition: number;
}

// ----------------------
// Cache Types
// ----------------------

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // milliseconds
}

export interface SongCacheEntry extends CacheEntry<ParsedSong> {
  key: `song:${number}`;
}

export interface SearchCacheEntry extends CacheEntry<SearchResult[]> {
  key: `search:${string}:page:${number}`;
}

// ----------------------
// Validation Types
// ----------------------

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'critical' | 'major' | 'minor';
}

export interface ValidationWarning {
  field: string;
  message: string;
}

// ----------------------
// Component Props Types
// ----------------------

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

// ----------------------
// Navigation Types
// ----------------------

export type NavRoute = '/' | '/chords' | '/songs' | '/favorites' | '/profile';

export interface NavItem {
  label: string;
  href: NavRoute;
  icon: React.ReactNode;
}

// ----------------------
// Store Types (Zustand)
// ----------------------

export interface AppState {
  // Transposition
  transposition: TranspositionState;
  setTransposition: (state: Partial<TranspositionState>) => void;
  resetTransposition: () => void;
  
  // Auto-scroll
  autoScroll: AutoScrollState;
  setAutoScroll: (state: Partial<AutoScrollState>) => void;
  
  // Favorites
  favorites: Favorite[];
  addFavorite: (favorite: Favorite) => void;
  removeFavorite: (songId: string) => void;
  toggleFavorite: (songId: string, title: string, artist: string) => void;
  isFavorite: (songId: string) => boolean;
  
  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

