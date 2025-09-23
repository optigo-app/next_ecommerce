/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'http',
          hostname: '**',
        },
        {
          protocol: 'https',
          hostname: '**',
        },
      ],
    },
    eslint: {
      ignoreDuringBuilds: true, // Skip ESLint errors/warnings on build
    },
  };
  
  export default nextConfig;
  