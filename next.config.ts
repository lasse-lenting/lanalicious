import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Allow local fonts
  images: {
    domains: ["localhost"],
  },
  // Enable experimental features for better font handling
  experimental: {
    optimizeCss: true,
  },
  // Configure asset handling
  webpack: (config, { isServer }) => {
    // Allow loading of font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
