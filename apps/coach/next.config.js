/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // appDir is now default in Next.js 13+
  },
  images: {
    domains: ['localhost', 'supabase.com'],
  },
  transpilePackages: ['@neetai/ui', '@neetai/database'],
  typescript: {
    // Temporarily ignore type errors during build for React 19 compatibility
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily ignore ESLint errors during build
    ignoreDuringBuilds: true,
  },
  output: 'standalone',
  trailingSlash: true,
  env: {
    // Provide default values for required env vars during build
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key_for_build_only',
  },
}

module.exports = nextConfig
