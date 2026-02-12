/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    pwa: {
      dest: 'public',
      register: true,
      skipWaiting: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig

