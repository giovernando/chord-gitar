import { Metadata } from 'next';
import Link from 'next/link';
import { Music, Search, Heart, Zap, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Professional guitar chord and song platform',
};

const features = [
  {
    icon: Music,
    title: 'Complete Chord Library',
    description: 'Major, minor, 7, sus, dim, aug, and advanced jazz chords',
    href: '/chords',
    color: 'text-chord-default',
  },
  {
    icon: Search,
    title: 'Song Search',
    description: 'Search millions of songs with accurate lyrics and chords',
    href: '/songs',
    color: 'text-primary-400',
  },
  {
    icon: Heart,
    title: 'Favorites Sync',
    description: 'Save your favorite songs and sync across devices',
    href: '/favorites',
    color: 'text-red-500',
  },
  {
    icon: Zap,
    title: 'Auto-Scroll',
    description: 'Smooth auto-scroll with adjustable speed for practicing',
    href: '/songs',
    color: 'text-yellow-500',
  },
];

const popularChords = [
  'C', 'G', 'D', 'A', 'E',
  'Am', 'Em', 'Dm',
  'G7', 'D7', 'A7', 'E7',
];

export default function HomePage() {
  return (
    <div className='min-h-screen pb-20 md:pb-0'>
      {/* Hero Section */}
      <section className='relative overflow-hidden bg-gradient-to-b from-surface-200 to-background px-4 py-12 md:py-20'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500/20 mb-6'>
            <Music className='w-10 h-10 text-primary-500' />
          </div>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            GuitarChords
          </h1>
          <p className='text-xl text-gray-400 mb-8 max-w-2xl mx-auto'>
            Professional guitar platform with accurate chords, lyrics, and powerful tools 
            for musicians of all levels.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Link
              href='/songs'
              className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors'
            >
              <Search size={20} />
              Search Songs
            </Link>
            <Link
              href='/chords'
              className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-surface-200 text-white font-semibold rounded-xl hover:bg-surface-300 transition-colors'
            >
              <BookOpen size={20} />
              Browse Chords
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className='px-4 py-12 max-w-6xl mx-auto'>
        <h2 className='text-2xl font-bold text-white mb-8'>Features</h2>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.href}
                href={feature.href}
                className='group p-6 rounded-xl bg-surface-200 border border-surface-300 hover:border-primary-500/50 transition-all duration-200'
              >
                <div className={`w-12 h-12 rounded-lg bg-surface-300 flex items-center justify-center mb-4 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={24} />
                </div>
                <h3 className='font-semibold text-white mb-2'>{feature.title}</h3>
                <p className='text-sm text-gray-400'>{feature.description}</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Popular Chords Section */}
      <section className='px-4 py-12 max-w-6xl mx-auto'>
        <div className='flex items-center justify-between mb-8'>
          <h2 className='text-2xl font-bold text-white'>Popular Chords</h2>
          <Link
            href='/chords'
            className='text-primary-400 hover:text-primary-300 font-medium text-sm'
          >
            View All →
          </Link>
        </div>
        <div className='flex flex-wrap gap-3'>
          {popularChords.map((chord) => (
            <Link
              key={chord}
              href={`/chords/${chord.toLowerCase()}`}
              className='inline-flex items-center justify-center w-16 h-16 rounded-xl bg-surface-200 border border-surface-300 font-mono font-bold text-white text-xl hover:border-primary-500/50 hover:bg-surface-100 transition-all duration-200'
            >
              {chord}
            </Link>
          ))}
        </div>
      </section>

      {/* Transpose Feature Highlight */}
      <section className='px-4 py-12 max-w-6xl mx-auto'>
        <div className='rounded-2xl bg-gradient-to-br from-primary-500/20 to-purple-500/20 p-8 border border-primary-500/30'>
          <div className='flex flex-col md:flex-row items-center gap-8'>
            <div className='flex-1'>
              <h2 className='text-2xl font-bold text-white mb-4'>
                Professional Transposition
              </h2>
              <p className='text-gray-300 mb-6'>
                Instantly transpose any song to any key. Perfect for matching your 
                vocal range or playing along with other instruments.
              </p>
              <ul className='space-y-3 text-gray-300'>
                <li className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-primary-500' />
                  -12 to +12 semitone range
                </li>
                <li className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-primary-500' />
                  Easy Mode key suggestions
                </li>
                <li className='flex items-center gap-2'>
                  <span className='w-2 h-2 rounded-full bg-primary-500' />
                  Works with all chord types
                </li>
              </ul>
            </div>
            <div className='flex-1 w-full max-w-sm'>
              <div className='p-6 rounded-xl bg-surface-200/80 border border-surface-300'>
                <p className='text-sm text-gray-400 mb-4'>Try transposing:</p>
                <div className='space-y-3 font-mono text-lg'>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>Original:</span>
                    <span className='chord'>Am</span> - <span className='chord'>F</span> - <span className='chord'>C</span> - <span className='chord'>G</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>+2 semitones:</span>
                    <span className='chord'>Bm</span> - <span className='chord'>G</span> - <span className='chord'>D</span> - <span className='chord'>A</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='text-gray-400'>+5 semitones:</span>
                    <span className='chord'>Dm</span> - <span className='chord'>Bb</span> - <span className='chord'>F</span> - <span className='chord'>C</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='px-4 py-16 max-w-4xl mx-auto text-center'>
        <h2 className='text-3xl font-bold text-white mb-4'>
          Ready to Play?
        </h2>
        <p className='text-gray-400 mb-8 max-w-xl mx-auto'>
          Start exploring our comprehensive chord library and song catalog. 
          Sign up to sync your favorites across all devices.
        </p>
        <Link
          href='/songs'
          className='inline-flex items-center gap-2 px-8 py-4 bg-primary-500 text-white font-semibold rounded-xl hover:bg-primary-600 transition-colors'
        >
          <Search size={20} />
          Start Searching
        </Link>
      </section>
    </div>
  );
}

