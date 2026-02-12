// ============================================
// Data Validation Pipeline
// Production-grade validation for songs and metadata
// ============================================

import { 
  SongMetadata, 
  LyricsResponse, 
  ParsedSong, 
  ValidationResult, 
  ValidationError, 
  ValidationWarning,
  SongSection 
} from '@/types';

// ----------------------
// Constants
// ----------------------

const MIN_LYRICS_LENGTH = 100; // Minimum characters for valid lyrics
const MIN_SECTIONS = 2; // Minimum number of sections
const TITLE_SIMILARITY_THRESHOLD = 0.9;
const MAX_RETRIES = 2;

// ----------------------
// Validation Functions
// ----------------------

/**
 * Validate song metadata from Genius API
 */
export function validateMetadata(
  metadata: SongMetadata,
  expectedTitle?: string
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Check required fields
  if (!metadata.id) {
    errors.push({
      field: 'id',
      message: 'Song ID is missing',
      severity: 'critical',
    });
  }
  
  if (!metadata.title || metadata.title.trim() === '') {
    errors.push({
      field: 'title',
      message: 'Song title is missing or empty',
      severity: 'critical',
    });
  }
  
  if (!metadata.artist || metadata.artist.trim() === '') {
    errors.push({
      field: 'artist',
      message: 'Artist name is missing or empty',
      severity: 'critical',
    });
  }
  
  // Validate title similarity if expected title provided
  if (expectedTitle && metadata.title) {
    const similarity = calculateStringSimilarity(
      metadata.title.toLowerCase(), 
      expectedTitle.toLowerCase()
    );
    
    if (similarity < TITLE_SIMILARITY_THRESHOLD) {
      warnings.push({
        field: 'title',
        message: `Title mismatch: "${metadata.title}" vs "${expectedTitle}" (${Math.round(similarity * 100)}% similar)`,
      });
    }
  }
  
  // Check URL validity
  if (metadata.url && !isValidUrl(metadata.url)) {
    errors.push({
      field: 'url',
      message: 'Invalid song URL',
      severity: 'major',
    });
  }
  
  return {
    valid: errors.filter(e => e.severity === 'critical').length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate lyrics content
 */
export function validateLyrics(lyrics: string): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  if (!lyrics || lyrics.trim() === '') {
    errors.push({
      field: 'lyrics',
      message: 'Lyrics are empty',
      severity: 'critical',
    });
    return { valid: false, errors, warnings };
  }
  
  // Check minimum length
  if (lyrics.length < MIN_LYRICS_LENGTH) {
    errors.push({
      field: 'lyrics',
      message: `Lyrics too short (${lyrics.length} chars, minimum ${MIN_LYRICS_LENGTH})`,
      severity: 'critical',
    });
  }
  
  // Check for common truncated content indicators
  const truncatedIndicators = [
    /See\s+https?:\/\//i,
    /Full\s+lyrics\s+at/i,
    / Lyrics$/i,
    /Translations/i,
  ];
  
  for (const indicator of truncatedIndicators) {
    if (indicator.test(lyrics)) {
      warnings.push({
        field: 'lyrics',
        message: 'Possible truncated lyrics detected',
      });
    }
  }
  
  // Check for structural sections
  const sections = parseSections(lyrics);
  if (sections.length < MIN_SECTIONS) {
    warnings.push({
      field: 'lyrics',
      message: `Only ${sections.length} section(s) detected, expected at least ${MIN_SECTIONS}`,
    });
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate parsed song structure
 */
export function validateParsedSong(song: ParsedSong): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  
  // Validate metadata
  const metadataResult = validateMetadata(song.metadata);
  errors.push(...metadataResult.errors);
  warnings.push(...metadataResult.warnings);
  
  // Validate sections
  if (song.sections.length === 0) {
    errors.push({
      field: 'sections',
      message: 'No song sections found',
      severity: 'critical',
    });
  }
  
  // Check for content in each section
  const emptySections = song.sections.filter(s => !s.content || s.content.trim() === '');
  if (emptySections.length > 0) {
    warnings.push({
      field: 'sections',
      message: `${emptySections.length} empty section(s) found`,
    });
  }
  
  // Validate chord detection
  if (song.detectedChords.length > 0) {
    const invalidChords = song.detectedChords.filter(c => !isValidChord(c));
    if (invalidChords.length > 0) {
      warnings.push({
        field: 'chords',
        message: `${invalidChords.length} invalid chord(s) detected: ${invalidChords.join(', ')}`,
      });
    }
  }
  
  return {
    valid: errors.filter(e => e.severity === 'critical').length === 0,
    errors,
    warnings,
  };
}

/**
 * Full validation pipeline for a song
 */
export async function validateSong(
  metadata: SongMetadata,
  lyrics: string,
  options?: {
    expectedTitle?: string;
    retryCount?: number;
  }
): Promise<ValidationResult> {
  const retryCount = options?.retryCount ?? 0;
  
  // Step 1: Validate metadata
  const metadataResult = validateMetadata(metadata, options?.expectedTitle);
  if (!metadataResult.valid && retryCount >= MAX_RETRIES) {
    return metadataResult;
  }
  
  // Step 2: Validate lyrics
  const lyricsResult = validateLyrics(lyrics);
  if (!lyricsResult.valid && retryCount >= MAX_RETRIES) {
    return lyricsResult;
  }
  
  // Combine results
  const combinedErrors = [
    ...metadataResult.errors,
    ...lyricsResult.errors,
  ];
  
  const combinedWarnings = [
    ...metadataResult.warnings,
    ...lyricsResult.warnings,
  ];
  
  return {
    valid: combinedErrors.filter(e => e.severity === 'critical').length === 0,
    errors: combinedErrors,
    warnings: combinedWarnings,
  };
}

// ----------------------
// Helper Functions
// ----------------------

/**
 * Calculate string similarity using Levenshtein distance
 */
function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (!str1.length || !str2.length) return 0;
  
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  // Quick check for substrings
  if (s1.includes(s2) || s2.includes(s1)) {
    return 0.8;
  }
  
  // Levenshtein distance
  const matrix: number[][] = [];
  
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }
  
  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);
  return 1 - distance / maxLength;
}

/**
 * Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Basic chord validation
 */
function isValidChord(chord: string): boolean {
  const chordPattern = /^[A-G][#b]?(maj|m|dim|aug|sus|add|7| maj7| m7| 9| 11| 13)?(\/[A-G][#b]?)?$/i;
  return chordPattern.test(chord);
}

/**
 * Parse lyrics into sections
 */
function parseSections(lyrics: string): SongSection[] {
  const sectionPatterns = [
    { type: 'intro', pattern: /^Intro:?\s*/i },
    { type: 'verse', pattern: /^Verse\s*\d*:?\s*/i },
    { type: 'pre-chorus', pattern: /^Pre-Chorus:?\s*/i },
    { type: 'chorus', pattern: /^Chorus:?\s*/i },
    { type: 'bridge', pattern: /^Bridge:?\s*/i },
    { type: 'outro', pattern: /^Outro:?\s*/i },
  ];
  
  const sections: SongSection[] = [];
  const lines = lyrics.split('\n');
  
  let currentSection: SongSection = {
    type: 'other' as const,
    content: '',
  };
  
  for (const line of lines) {
    // Check if line is a section header
    let isSectionHeader = false;
    for (const { type, pattern } of sectionPatterns) {
      if (pattern.test(line)) {
        // Save previous section if it has content
        if (currentSection.content.trim()) {
          sections.push(currentSection);
        }
        currentSection = {
          type: type as 'intro' | 'verse' | 'pre-chorus' | 'chorus' | 'bridge' | 'outro',
          content: '',
          isChorus: type === 'chorus',
        };
        isSectionHeader = true;
        break;
      }
    }
    
    // Add non-header lines to current section
    if (!isSectionHeader && line.trim()) {
      currentSection.content += (currentSection.content ? '\n' : '') + line;
    }
  }
  
  // Save last section
  if (currentSection.content.trim()) {
    sections.push(currentSection);
  }
  
  return sections;
}

// ----------------------
// Export
// ----------------------

export default {
  validateMetadata,
  validateLyrics,
  validateParsedSong,
  validateSong,
};

