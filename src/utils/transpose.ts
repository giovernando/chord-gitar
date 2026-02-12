// ============================================
// Chord Transposition Engine
// Professional-grade chord transposition utility
// Supports: Major, minor, 7, maj7, m7, sus, dim, aug, add, slash chords
// Range: -12 to +12 semitones
// ============================================

// ----------------------
// Constants
// ----------------------

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const FLAT_NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
const SHARP_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Major key signatures
const MAJOR_KEYS = [
  { name: 'C', index: 0, flats: 0, sharps: 0 },
  { name: 'G', index: 7, flats: 0, sharps: 1 },
  { name: 'D', index: 2, flats: 0, sharps: 2 },
  { name: 'A', index: 9, flats: 0, sharps: 3 },
  { name: 'E', index: 4, flats: 0, sharps: 4 },
  { name: 'B', index: 11, flats: 0, sharps: 5 },
  { name: 'F#', index: 6, flats: 1, sharps: 6 },
  { name: 'Db', index: 1, flats: 5, sharps: 0 },
  { name: 'Ab', index: 8, flats: 4, sharps: 0 },
  { name: 'Eb', index: 3, flats: 3, sharps: 0 },
  { name: 'Bb', index: 10, flats: 2, sharps: 0 },
  { name: 'F', index: 5, flats: 1, sharps: 0 },
];

// Minor key signatures (relative to major)
const MINOR_KEYS = MAJOR_KEYS.map((major, i) => ({
  name: `${NOTES[(major.index + 9) % 12]}m`,
  index: (major.index + 9) % 12,
  flats: major.flats,
  sharps: major.sharps,
}));

// Beginner-friendly keys (G, C, D, A, E and their minors)
const BEGINNER_KEYS = ['G', 'C', 'D', 'A', 'E', 'Am', 'Em', 'Dm'];

// ----------------------
// Type Definitions
// ----------------------

export type SemitoneShift = number; // -12 to 12

export interface TransposeResult {
  originalChord: string;
  transposedChord: string;
  semitones: SemitoneShift;
}

export interface KeyDetectionResult {
  detectedKey: string;
  confidence: 'high' | 'medium' | 'low';
  possibleKeys: string[];
}

// ----------------------
// Helper Functions
// ----------------------

/**
 * Normalize note name to sharp format
 */
function normalizeToSharp(note: string): string {
  const lowerNote = note.toLowerCase();
  const flatMap: Record<string, string> = {
    'db': 'c#', 'eb': 'd#', 'gb': 'f#', 'ab': 'g#', 'bb': 'a#',
    'cb': 'b', 'fb': 'e', 'cb': 'b',
  };
  return flatMap[lowerNote] || note.charAt(0).toUpperCase() + note.slice(1).replace('#', '#');
}

/**
 * Normalize note name to flat format
 */
function normalizeToFlat(note: string): string {
  const sharpMap: Record<string, string> = {
    'c#': 'db', 'd#': 'eb', 'f#': 'gb', 'g#': 'ab', 'a#': 'bb',
  };
  const normalized = normalizeToSharp(note);
  return sharpMap[normalized] || normalized;
}

/**
 * Get note index (0-11)
 */
function getNoteIndex(note: string): number {
  const normalized = normalizeToSharp(note);
  const index = NOTES.indexOf(normalized);
  if (index === -1) {
    throw new Error(`Invalid note: ${note}`);
  }
  return index;
}

/**
 * Transpose a single note by semitones
 */
function transposeNote(note: string, semitones: SemitoneShift, useFlats = false): string {
  const currentIndex = getNoteIndex(note);
  const newIndex = ((currentIndex + semitones) % 12 + 12) % 12;
  const notes = useFlats ? FLAT_NOTES : SHARP_NOTES;
  return notes[newIndex];
}

// ----------------------
// Chord Parsing
// ----------------------

/**
 * Parse a chord into its root and quality
 */
export function parseChord(chord: string): { root: string; quality: string; bass?: string } {
  const chordRegex = /^([A-G][#b]?)(.*?)(\/[A-G][#b]?)?$/;
  const match = chord.trim().match(chordRegex);
  
  if (!match) {
    return { root: chord, quality: '' };
  }
  
  return {
    root: match[1],
    quality: match[2] || '',
    bass: match[3]?.slice(1), // Remove the slash
  };
}

/**
 * Check if a string looks like a chord
 */
export function isChord(text: string): boolean {
  const chordPatterns = [
    /^[A-G][#b]?(m|maj|dim|aug|sus|add| maj7| m7| 7| maj9| m9| 9| 11| 13)?$/i,
    /^[A-G][#b]?\/(A-G][#b]?)?$/i,
  ];
  return chordPatterns.some(pattern => pattern.test(text.trim()));
}

// ----------------------
// Core Transposition
// ----------------------

/**
 * Transpose a chord by semitones
 */
export function transposeChord(chord: string, semitones: SemitoneShift, useFlats = false): string {
  if (semitones === 0 || !chord.trim()) {
    return chord;
  }
  
  const parsed = parseChord(chord);
  
  // Transpose root
  const newRoot = transposeNote(parsed.root, semitones, useFlats);
  
  // Transpose bass if present
  const newBass = parsed.bass 
    ? transposeNote(parsed.bass, semitones, useFlats)
    : undefined;
  
  // Reconstruct chord
  if (newBass) {
    return `${newRoot}${parsed.quality}/${newBass}`;
  }
  return `${newRoot}${parsed.quality}`;
}

/**
 * Transpose multiple chords (optimized for performance)
 */
export function transposeChords(chords: string[], semitones: SemitoneShift): string[] {
  if (semitones === 0) {
    return chords;
  }
  
  return chords.map(chord => transposeChord(chord, semitones));
}

/**
 * Transpose song lyrics with inline chords
 */
export function transposeLyrics(
  lyrics: string, 
  semitones: SemitoneShift
): string {
  if (semitones === 0) {
    return lyrics;
  }
  
  const lines = lyrics.split('\n');
  const transposedLines = lines.map(line => {
    // Match chords at the start of lines (above-lyrics format)
    const aboveFormat = /^(\[[^\]]+\]\s*)*(\[[A-G][#b]?(maj|m|dim|aug|sus|add|7| maj7| m7| 9| 11| 13)?(,?\s*[A-G][#b]?(maj|m|dim|aug|sus|add|7| maj7| m7| 9| 11| 13)?)*\])\s*$/;
    
    // Match inline chords in brackets
    const inlineFormat = /\[([A-G][#b]?(?:maj|m|dim|aug|sus|add|7| maj7| m7| 9| 11| 13)?(?:\/[A-G][#b]?)?)\]/g;
    
    if (aboveFormat.test(line)) {
      // Above-lyrics format: [Am] [G] [F]
      return line.replace(/\[([A-G][#b]?[^\]]*)\]/g, (_, chord) => {
        return `[${transposeChord(chord, semitones)}]`;
      });
    } else if (inlineFormat.test(line)) {
      // Inline format: Love [Am]me [G]tender
      return line.replace(inlineFormat, (_, chord) => {
        return `[${transposeChord(chord, semitones)}]`;
      });
    }
    
    return line;
  });
  
  return transposedLines.join('\n');
}

// ----------------------
// Key Detection
// ----------------------

/**
 * Detect the likely key of a song from its chords
 */
export function detectKey(chords: string[]): KeyDetectionResult {
  if (chords.length === 0) {
    return {
      detectedKey: 'C',
      confidence: 'low',
      possibleKeys: MAJOR_KEYS.map(k => k.name),
    };
  }
  
  // Count chord frequencies
  const chordCounts: Record<string, number> = {};
  chords.forEach(chord => {
    const parsed = parseChord(chord);
    chordCounts[parsed.root] = (chordCounts[parsed.root] || 0) + 1;
  });
  
  // Find most common root notes
    const sortedRoots = Object.entries(chordCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([root]) => root);
  
  // Attempt to identify major/minor
  const hasMinor = chords.some(c => c.toLowerCase().includes('m') && !c.toLowerCase().includes('maj'));
  const hasMajor = chords.some(c => !c.toLowerCase().includes('m') || c.toLowerCase().includes('maj'));
  
  // Check for primary chords (I, IV, V, vi)
  const possibleKeys = sortedRoots.flatMap(root => {
    const rootIndex = getNoteIndex(root);
    return [
      ...MAJOR_KEYS.filter(k => k.index === rootIndex).map(k => k.name),
      ...MINOR_KEYS.filter(k => k.index === rootIndex).map(k => k.name),
    ];
  });
  
  // Best guess
  let detectedKey = possibleKeys[0] || 'C';
  if (hasMinor && !hasMajor) {
    detectedKey = detectedKey.replace(/^(?!.*m)/, ''); // Ensure minor
    if (!detectedKey.endsWith('m')) {
      const minorVersion = MINOR_KEYS.find(k => k.name.replace('m', '') === possibleKeys[0]);
      if (minorVersion) detectedKey = minorVersion.name;
    }
  }
  
  // Determine confidence based on data quality
  const confidence: 'high' | 'medium' | 'low' = 
    chords.length > 10 ? 'high' :
    chords.length > 5 ? 'medium' : 'low';
  
  // Deduplicate possible keys
  const uniqueKeys: string[] = [];
  const seen = new Set<string>();
  for (const key of possibleKeys) {
    if (!seen.has(key)) {
      seen.add(key);
      uniqueKeys.push(key);
    }
  }
  
  return {
    detectedKey,
    confidence,
    possibleKeys: uniqueKeys.slice(0, 5),
  };
}

// ----------------------
// Key Transposition
// ----------------------

/**
 * Get the semitone distance between two keys
 */
export function getSemitoneDistance(fromKey: string, toKey: string): number {
  const fromIndex = getNoteIndex(fromKey.replace('m', '').replace('#', '#'));
  const toIndex = getNoteIndex(toKey.replace('m', '').replace('#', '#'));
  
  let distance = toIndex - fromIndex;
  if (distance > 6) distance -= 12;
  if (distance < -6) distance += 12;
  
  return distance;
}

/**
 * Transpose from one key to another
 */
export function transposeKey(fromKey: string, toKey: string): SemitoneShift {
  return getSemitoneDistance(fromKey, toKey);
}

// ----------------------
// Easy Mode
// ----------------------

/**
 * Suggest beginner-friendly keys
 */
export function suggestEasyModeKeys(currentKey: string): Array<{ key: string; distance: SemitoneShift }> {
  return BEGINNER_KEYS.map(key => ({
    key,
    distance: transposeKey(currentKey, key),
  })).sort((a, b) => Math.abs(a.distance) - Math.abs(b.distance));
}

/**
 * Check if a chord is beginner-friendly
 */
export function isBeginnerFriendly(chord: string): boolean {
  const beginnerChords = [
    'C', 'G', 'D', 'A', 'E',
    'Am', 'Em', 'Dm',
    'G7', 'D7', 'A7', 'E7',
    'Cadd9', 'Gadd9', 'Dsus4', 'Asus2',
  ];
  
  const parsed = parseChord(chord);
  return beginnerChords.some(c => 
    c.toLowerCase() === chord.toLowerCase() ||
    c.toLowerCase() === parsed.root.toLowerCase()
  );
}

// ----------------------
// Key Name Formatting
// ----------------------

/**
 * Get all valid key names
 */
export function getAllKeys(): string[] {
  return [
    ...MAJOR_KEYS.map(k => k.name),
    ...MINOR_KEYS.map(k => k.name),
  ];
}

/**
 * Get relative minor of a major key
 */
export function getRelativeMinor(majorKey: string): string {
  const major = MAJOR_KEYS.find(k => k.name === majorKey);
  if (!major) return `${majorKey}m`;
  const minorIndex = (major.index + 9) % 12;
  return `${NOTES[minorIndex]}m`;
}

/**
 * Get relative major of a minor key
 */
export function getRelativeMajor(minorKey: string): string {
  const minor = MINOR_KEYS.find(k => k.name === minorKey);
  if (!minor) return minorKey.replace('m', '');
  const majorIndex = (minor.index + 3) % 12;
  return NOTES[majorIndex];
}

// ----------------------
// Chord Family Detection
// ----------------------

export type ChordFamily = 'major' | 'minor' | '7' | 'maj7' | 'm7' | 'sus' | 'dim' | 'aug' | 'add' | 'slash';

/**
 * Detect chord family
 */
export function getChordFamily(chord: string): ChordFamily {
  const lower = chord.toLowerCase();
  const parsed = parseChord(chord);
  
  if (parsed.bass) return 'slash';
  if (lower.includes('add')) return 'add';
  if (lower.includes('dim')) return 'dim';
  if (lower.includes('aug')) return 'aug';
  if (lower.includes('sus')) return 'sus';
  if (lower === 'm7' || lower.includes('min7')) return 'm7';
  if (lower === 'maj7' || lower.includes('maj7')) return 'maj7';
  if (lower.includes('m') && lower.includes('7')) return 'm7';
  if (lower.includes('7')) return '7';
  if (lower === 'm' || lower.includes('min')) return 'minor';
  return 'major';
}

// ----------------------
// Export Default with Memoized Functions
// ----------------------

export default {
  transposeChord,
  transposeChords,
  transposeLyrics,
  detectKey,
  transposeKey,
  suggestEasyModeKeys,
  isBeginnerFriendly,
  getAllKeys,
  parseChord,
  isChord,
  getChordFamily,
};

