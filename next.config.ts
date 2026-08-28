import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // Prevents image optimization failure for dynamic database URLs
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/contact',
        destination: '/contact-us',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        // Route any /uploads/:filename to our persistent API server
        source: '/uploads/:filename*',
        destination: '/api/uploads/:filename*',
      },
      {
        // Proxy /cdn-images/:path* → Cloudinary
        source: '/cdn-images/:path*',
        destination: 'https://res.cloudinary.com/dytytwyp6/image/upload/:path*',
      },
    ];
  },
};

export default nextConfig;