/** @type {import('next').NextConfig} */
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return process.env.NODE_ENV === "production" ? [] : [
      { source: '/api/:path*', destination: 'http://localhost:3000/:path*' },
    ];
  },
};

module.exports = nextConfig;

