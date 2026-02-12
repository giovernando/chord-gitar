import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navigation } from '@/components/navigation/BottomNav';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'GuitarChords - chords and songs for guitar',
    template: '%s | GuitarChords',
  },
  description: 'Professional guitar chord and song platform with real API integration, transpose features, and offline support.',
  keywords: ['guitar', 'chords', 'songs', 'tabs', 'lyrics', 'music'],
  authors: [{ name: 'GuitarChords' }],
  creator: 'GuitarChords',
  publisher: 'GuitarChords',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://guitarchords.app',
    siteName: 'GuitarChords',
    title: 'GuitarChords - Professional Guitar Platform',
    description: 'Professional guitar chord and song platform with transpose and offline support.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'GuitarChords',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GuitarChords',
    description: 'Professional guitar chord and song platform',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    shortcut: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inter.variable}>
      <head>
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='black-translucent' />
        <meta name='apple-mobile-web-app-title' content='GuitarChords' />
        <link rel='preconnect' href='https://api.genius.com' />
        <link rel='dns-prefetch' href='https://api.genius.com' />
      </head>
      <body className='min-h-screen bg-background text-foreground'>
        {/* Skip to main content for accessibility */}
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-500 focus:text-white focus:rounded-lg'
        >
          Skip to main content
        </a>

        {/* Main Navigation */}
        <Navigation />

        {/* Main Content */}
        <main id='main-content' className='min-h-screen pb-nav-height md:pb-0 md:pt-16'>
          {children}
        </main>

        {/* PWA Install prompt (hidden by default, shown via JS) */}
        <div id='pwa-install-prompt' className='hidden fixed bottom-20 left-4 right-4 z-40' />
      </body>
    </html>
  );
}

