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
    webpack: (config) => {
      config.infrastructureLogging = { level: "error" }; // hides warnings
      return config;
    },
    eslint: {
      ignoreDuringBuilds: true, // Skip ESLint errors/warnings on build
    },
  };
  
  export default nextConfig;
  