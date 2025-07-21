/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: [
      'i.ytimg.com',
      'yt3.ggpht.com',
      'pbs.twimg.com',
      'abs.twimg.com'
    ],
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // Production 빌드 최적화
  output: 'standalone',
  poweredByHeader: false,
  compress: true,
  
  // SSR 설정
  reactStrictMode: true,
  swcMinify: true,
  
  // 개발 환경 설정
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    return config
  },
  
  // TypeScript 에러 무시 (개발 시에만)
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
}

module.exports = nextConfig
