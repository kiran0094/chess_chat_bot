import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable React Strict Mode for better development experience
  reactStrictMode: true,
  
  // Improved caching for faster builds and page loads
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // Increased from 25s to 60s
    pagesBufferLength: 5, // Increased from 2 to 5 for better caching
  },
  
  // Enable compression for better performance
  compress: true,
  
  // Optimize image loading
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 86400, // Increased to 24 hours for better performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  
  // Improved production builds
  swcMinify: true,
  
  // Experimental features for better performance
  experimental: {
    serverActions: true,
    optimizeCss: true, // Add CSS optimization
    scrollRestoration: true, // Improve scroll behavior
    optimizeFonts: true, // Font optimization
  },
  
  // Add HTTP response headers for better performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
