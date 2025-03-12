/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  i18n: {
    locales: ['en', 'de'],
    defaultLocale: 'en',
  },
  experimental: {
    optimizeCss: false,
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    
    // Add browser-tools-mcp to externals to prevent it from being processed
    config.externals = [...(config.externals || []), 'browser-tools-mcp'];
    
    return config;
  },
  // Explicitly ignore TypeScript errors during build for now
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 