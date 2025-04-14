/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    // Exclude PDF.js worker and WASM modules from the build
    config.module.rules.push({
      test: /pdf\.worker\.(min\.)?js|\.wasm$/,
      loader: 'ignore-loader',
    });
    
    return config;
  },
};

export default nextConfig;
