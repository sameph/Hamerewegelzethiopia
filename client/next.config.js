const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export is required for this project deployment mode.
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  webpack(config, { dev }) {
    // Keep dev fast; apply memory-safe settings only for production builds.
    if (!dev) {
      config.parallelism = 1;
      config.cache = false;
    }
    return config;
  },
};

module.exports = withNextIntl(nextConfig);
