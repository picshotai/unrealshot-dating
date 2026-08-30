import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

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
  async redirects() {
    // Old landing pages that should redirect to homepage (301 permanent)
    const oldLandingPages = [
      'ai-botanic-photoshoot',
      'ai-chef-headshots',
      'ai-christmas-photoshoot',
      'ai-dating-photoshoot',
      'ai-fantasy-photoshoot',
      'ai-glamour-photoshoot',
      'ai-halloween-photoshoot',
      'ai-influencer-generator',
      'ai-instagram-photoshoot',
      'ai-maternity-photoshoot',
      'ai-real-estate-headshots',
      'ai-speaker-photoshoot',
      'ai-yearbook',
      'black-swan-photoshoot',
      'corporate-headshots',
      'denim-wear-photoshoot',
      'doctor-headshots',
      'founder-headshots',
      'lawyer-headshots',
      'linkedin-headshots',
      'natural-looks-photoshoot',
      'neutral-muse-photoshoot',
      'office-outfit-photoshoot',
      'personal-branding-photoshoot',
      'professional-headshots',
      'resume-headshots',
      'street-style-photoshoot',
      'stylish-ai-portraits',
      'vintage-photoshoot',
    ];

    return oldLandingPages.map(page => ({
      source: `/${page}`,
      destination: '/',
      permanent: true, // 301 redirect
    }));
  },
}

export default withNextIntl(nextConfig)
