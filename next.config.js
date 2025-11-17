/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/src/api/:path*'
      }
    ];
  }
};

module.exports = nextConfig;
