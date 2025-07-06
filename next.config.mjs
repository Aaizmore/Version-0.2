/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove output: 'standalone' for better compatibility
  
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

  // Webpack configuration for better compatibility
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

export default nextConfig;
