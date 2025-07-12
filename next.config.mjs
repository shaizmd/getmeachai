/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize CSS loading to reduce preload warnings
  experimental: {
    optimizeCss: true,
  },
  // Disable CSS preload warning in development
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  // Optimize bundle analyzer
  webpack: (config, { dev, isServer }) => {
    // Reduce CSS chunk splitting that can cause preload warnings
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups.styles = {
        name: 'styles',
        test: /\.(css|scss)$/,
        chunks: 'all',
        enforce: true,
      };
    }
    return config;
  },
};

export default nextConfig;
