/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bpzmonsdihmvawtlurhl.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      }
    ],
    domains: [
      'bpzmonsdihmvawtlurhl.supabase.co'
    ],
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: false,
  },

  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: false,
  },

  // Experimental features for better compatibility
  experimental: {
    esmExternals: 'loose',
  },
};

export default nextConfig;
