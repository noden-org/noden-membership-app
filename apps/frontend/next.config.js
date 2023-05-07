const withPWA = require('next-pwa')({
  dest: 'public',
  register: false,
});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  distDir: 'dist',
  images: { unoptimized: true },
};

module.exports = withPWA(nextConfig);
