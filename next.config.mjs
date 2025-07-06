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
    // Allow the build to succeed even if ESLint errors are present.
    // You’ll still see the warnings in the deploy logs.
    ignoreDuringBuilds: true,
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
