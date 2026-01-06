import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'images.alg.tw1.ru',
      },
    ],
  },
};

export default nextConfig;
