/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true, // Matches WordPress permalink structure to preserve SEO rankings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'soundnest.in',
        pathname: '/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/blog/:slug/',
        destination: '/:slug/',
      },
    ];
  },
};

export default nextConfig;
