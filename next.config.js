/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: false,
  },
  images: {
    remotePatterns: [
      // 기존 외부 이미지 직접 접근 (fallback)
      // {
      //   protocol: 'https',
      //   hostname: 'i.ytimg.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'yt3.ggpht.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'pbs.twimg.com',
      //   pathname: '/**',
      // },
      // {
      //   protocol: 'https',
      //   hostname: 'abs.twimg.com',
      //   pathname: '/**',
      // },
      // mypick-server 프록시 (로컬 개발) - 포트 8200
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/api/proxy/image',
      },
      // mypick-server 프록시 (로컬 개발) - 포트 8300
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8300',
        pathname: '/api/proxy/image',
      },
      // mypick-server 프록시 (프로덕션 - 필요 시 주석 해제)
      // {
      //   protocol: 'https',
      //   hostname: 'api.mypick.com',
      //   pathname: '/api/proxy/image',
      // },
    ],
  },
};

export default nextConfig;
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   // Next.js 15에서 App Router는 기본값이므로 experimental 설정 제거
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'i.ytimg.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'yt3.ggpht.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'pbs.twimg.com',
//         pathname: '/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'abs.twimg.com',
//         pathname: '/**',
//       },
//     ],
//   },
//   env: {
//     NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000',
//     NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
//   },
//   // Production 빌드 최적화
//   output: 'standalone',
//   poweredByHeader: false,
//   compress: true,

//   // Next.js 15 새로운 최적화 기능
//   experimental: {
//     optimizePackageImports: ['lucide-react', 'framer-motion'],
//     turbo: {
//       rules: {
//         '*.svg': {
//           loaders: ['@svgr/webpack'],
//           as: '*.js',
//         },
//       },
//     },
//   },

//   // 개발 환경 설정
//   webpack: (config, { dev, isServer }) => {
//     if (dev && !isServer) {
//       config.watchOptions = {
//         poll: 1000,
//         aggregateTimeout: 300,
//       }
//     }
//     return config
//   },

//   // TypeScript 에러 무시 (개발 시에만)
//   typescript: {
//     ignoreBuildErrors: process.env.NODE_ENV === 'development',
//   },
//   eslint: {
//     ignoreDuringBuilds: process.env.NODE_ENV === 'development',
//   },
// }

// export default nextConfig;
