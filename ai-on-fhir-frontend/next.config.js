// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/query',
        destination: 'http://backend:5000/query', // IMPORTANT
      },
    ];
  },
};

module.exports = nextConfig;
