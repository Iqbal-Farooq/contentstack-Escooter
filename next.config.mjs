/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.contentstack.io',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.contentstack.com',
        pathname: '/**',
      },
    ],
  },
  assetPrefix: process.env.BASE_PATH || '',
  basePath: process.env.BASE_PATH || '',
};

export default nextConfig;
