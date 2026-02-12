// ============================================
// Supabase Client Configuration
// ============================================

import { createBrowserClient } from '@supabase/ssr';

// ----------------------
// Environment Variables
// ----------------------

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// ----------------------
// Browser Client
// ----------------------

export function createClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

// ----------------------
// Types for Database
// ----------------------

export interface Database {
  public: {
    Tables: {
      favorites: {
        Row: {
          id: string;
          user_id: string;
          song_id: string;
          song_title: string;
          song_artist: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          song_id: string;
          song_title: string;
          song_artist: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          song_id?: string;
          song_title?: string;
          song_artist?: string;
          created_at?: string;
        };
      };
    };
  };
}

// Export for convenience
export const supabase = createClient();

