import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const contentSecurityPolicy = [
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://c.ecompin.com https://*.ecompin.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
  "script-src-elem 'self' 'unsafe-inline' https://c.ecompin.com https://*.ecompin.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com",
  "connect-src 'self' https://c.ecompin.com https://*.ecompin.com https://www.clarity.ms https://*.clarity.ms https://challenges.cloudflare.com https://*.supabase.co wss://*.supabase.co https://*.fal.ai https://*.fal.media https://*.dodopayments.com",
].join('; ')

/** @type {import('next').NextConfig} */
const nextConfig = {
  agentRules: false,
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'blog.unrealshot.com',
        pathname: '/wp-content/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'fal.ai',
      },
      {
        protocol: 'https',
        hostname: 'fal.media',
      },
      {
        protocol: 'https',
        hostname: 'v3.fal.media',
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version",
          },
        ],
      },
    ];
  },
}

export default withNextIntl(nextConfig)
