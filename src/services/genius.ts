// ============================================
// Genius API Service
// Handles all interactions with the Genius API
// ============================================

import { SongMetadata, SearchResult, LyricsResponse } from '@/types';

// ----------------------
// Configuration
// ----------------------

const GENIUS_API_BASE = 'https://api.genius.com';
const GENIUS_ACCESS_TOKEN = process.env.GENIUS_API_TOKEN || '';

// ----------------------
// Types
// ----------------------

interface GeniusSearchResponse {
  response: {
    hits: Array<{
      result: {
        id: number;
        title: string;
        primary_artist: {
          name: string;
        };
        header_image_thumbnail_url?: string;
        header_image_url?: string;
        url: string;
        language: string;
        lyrics_state: string;
      };
    }>;
  };
}

interface GeniusSongResponse {
  response: {
    song: {
      id: number;
      title: string;
      full_title: string;
      primary_artist: {
        id: number;
        name: string;
        url: string;
      };
      album?: {
        name: string;
        cover_art_url?: string;
        release_date?: string;
      };
      release_date?: string;
      header_image_thumbnail_url?: string;
      header_image_url?: string;
      url: string;
      lyrics_state: string;
      language: string;
    };
  };
}

// ----------------------
// API Functions
// ----------------------

/**
 * Search for songs on Genius
 */
export async function searchSongs(
  query: string,
  options?: {
    page?: number;
    perPage?: number;
  }
): Promise<SearchResult[]> {
  const page = options?.page || 1;
  const perPage = options?.perPage || 10;
  
  const params = new URLSearchParams({
    q: query,
    page: page.toString(),
    per_page: perPage.toString(),
  });
  
  const response = await fetch(
    `${GENIUS_API_BASE}/search?${params}`,
    {
      headers: {
        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Genius API error: ${response.status}`);
  }
  
  const data: GeniusSearchResponse = await response.json();
  
  return data.response.hits
    .filter(hit => hit.result.lyrics_state === 'complete')
    .map(hit => ({
      id: hit.result.id,
      title: hit.result.title,
      artist: hit.result.primary_artist.name,
      headerImageUrl: hit.result.header_image_thumbnail_url,
      url: hit.result.url,
      type: 'song' as const,
    }));
}

/**
 * Get song metadata from Genius
 */
export async function getSongMetadata(songId: number): Promise<SongMetadata> {
  const response = await fetch(
    `${GENIUS_API_BASE}/songs/${songId}`,
    {
      headers: {
        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Genius API error: ${response.status}`);
  }
  
  const data: GeniusSongResponse = await response.json();
  const song = data.response.song;
  
  return {
    id: song.id,
    title: song.full_title.replace(/ lyrics$/i, '').replace(/ by .+$/i, ''),
    artist: song.primary_artist.name,
    album: song.album?.name,
    releaseDate: song.album?.release_date || song.release_date,
    headerImageUrl: song.header_image_url,
    coverArtUrl: song.album?.cover_art_url,
    url: song.url,
  };
}

/**
 * Get song lyrics from Genius
 * Note: This fetches from the song page, not the API
 */
export async function getSongLyrics(songUrl: string): Promise<LyricsResponse> {
  try {
    const response = await fetch(songUrl, {
      next: {
        revalidate: 3600, // Cache for 1 hour
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch lyrics page: ${response.status}`);
    }
    
    const html = await response.text();
    
    // Extract lyrics from the page
    // Genius stores lyrics in a specific data attribute
    const lyricsMatch = html.match(
      /data-lyrics-container="true"[^>]*>([^<]+)<\/div>/g
    );
    
    if (!lyricsMatch) {
      return {
        lyrics: '',
        source: 'fallback',
        validated: false,
        validationErrors: ['No lyrics found on page'],
      };
    }
    
    // Clean and join the lyrics
    const lyrics = lyricsMatch
      .map(match => {
        // Remove HTML tags and clean up
        return match
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/data-lyrics-container="true"[^>]*>/gi, '')
          .replace(/<\/div>/gi, '')
          .replace(/<[^>]+>/gi, '')
          .replace(/&amp;/g, '&')
          .replace(/</g, '<')
          .replace(/>/g, '>')
          .replace(/"/g, '"')
          .trim();
      })
      .filter(line => line.length > 0)
      .join('\n');
    
    return {
      lyrics,
      source: 'genius',
      validated: false, // Will be validated by validation pipeline
    };
  } catch (error) {
    return {
      lyrics: '',
      source: 'fallback',
      validated: false,
      validationErrors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Get song by ID (metadata + lyrics)
 */
export async function getSongById(songId: number): Promise<{
  metadata: SongMetadata;
  lyrics: LyricsResponse;
}> {
  const [metadata, lyricsResponse] = await Promise.all([
    getSongMetadata(songId),
    getSongLyrics(`https://genius.com/songs/${songId}`),
  ]);
  
  return {
    metadata,
    lyrics: lyricsResponse,
  };
}

/**
 * Get related songs by artist
 */
export async function getArtistTopSongs(
  artistId: number,
  options?: {
    page?: number;
    perPage?: number;
  }
): Promise<SearchResult[]> {
  const page = options?.page || 1;
  const perPage = options?.perPage || 10;
  
  const params = new URLSearchParams({
    page: page.toString(),
    per_page: perPage.toString(),
  });
  
  const response = await fetch(
    `${GENIUS_API_BASE}/artists/${artistId}/songs?${params}`,
    {
      headers: {
        Authorization: `Bearer ${GENIUS_ACCESS_TOKEN}`,
      },
      next: {
        revalidate: 86400, // Cache for 24 hours
      },
    }
  );
  
  if (!response.ok) {
    throw new Error(`Genius API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.response.songs
    .filter((song: { lyrics_state: string }) => song.lyrics_state === 'complete')
    .map((song: { 
      id: number; 
      title: string; 
      primary_artist: { name: string }; 
      header_image_thumbnail_url?: string; 
      url: string; 
    }) => ({
      id: song.id,
      title: song.title,
      artist: song.primary_artist.name,
      headerImageUrl: song.header_image_thumbnail_url,
      url: song.url,
      type: 'song' as const,
    }));
}

// ----------------------
// Export
// ----------------------

export default {
  searchSongs,
  getSongMetadata,
  getSongLyrics,
  getSongById,
  getArtistTopSongs,
};

