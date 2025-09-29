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
      ignoreDuringBuilds: true,
      
    },
    experimental :{
      viewTransition: true,
      // esmExternals: 'loose', // faster dev builds
      turbo: true,            // experimental build speed improvements
    }
  };
  
  export default nextConfig;
  