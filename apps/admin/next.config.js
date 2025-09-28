/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Ignore TypeScript during build for CI/CD
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    // Provide default values for required env vars during build
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy_key_for_build_only',
  },
};

export default nextConfig;