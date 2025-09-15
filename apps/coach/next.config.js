/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'supabase.com'],
  },
  transpilePackages: ['@neetai/ui', '@neetai/database'],
}

module.exports = nextConfig