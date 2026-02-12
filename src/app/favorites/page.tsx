import { Metadata } from 'next';
import Link from 'next/link';
import { Heart, Music } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Favorites',
  description: 'Your saved favorite songs and chords',
};

export default function FavoritesPage() {
  return (
    <div className='min-h-screen px-4 py-6 max-w-4xl mx-auto'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold text-white mb-2'>Favorites</h1>
        <p className='text-gray-400'>
          Your saved songs and chords
        </p>
      </div>

      {/* Empty State */}
      <div className='text-center py-16'>
        <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-red-500/20 mb-6'>
          <Heart className='w-10 h-10 text-red-500' />
        </div>
        <h2 className='text-xl font-semibold text-white mb-2'>
          No favorites yet
        </h2>
        <p className='text-gray-400 mb-8 max-w-md mx-auto'>
          Start adding songs to your favorites to see them here. 
          Your favorites sync across all your devices.
        </p>
        <Link
          href='/songs'
          className='inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors'
        >
          <Music size={20} />
          Browse Songs
        </Link>
      </div>
    </div>
  );
}

