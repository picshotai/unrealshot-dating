/**
 * SEO Configuration for Next.js Application
 * 
 * This file contains all SEO-related configurations that can be easily customized
 * by users of this boilerplate. All settings are centralized here for easy management.
 * 
 * To customize SEO for your application:
 * 1. Update the defaultSEO object with your brand information
 * 2. Modify social media handles and URLs
 * 3. Update the organization schema with your company details
 * 4. Customize page-specific SEO in the pageSEO object
 */

import { getSiteUrl } from '@/lib/site-url';

export interface SEOConfig {
  title: string;
  description: string;
  author: string;
  siteUrl: string;
  siteName: string;
  locale: string;
  type: string;
  robots: string;
  googleSiteVerification?: string;
  bingSiteVerification?: string;
  yandexVerification?: string;
}

export interface SocialConfig {
  twitter: {
    handle: string;
    site: string;
    cardType: 'summary' | 'summary_large_image' | 'app' | 'player';
  };
  instagram: {
    handle?: string;
  };
}

export interface OrganizationSchema {
  '@type': string;
  '@id'?: string;
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    '@type': string;
    streetAddress?: string;
    addressLocality?: string;
    addressRegion?: string;
    postalCode?: string;
    addressCountry?: string;
  };
  contactPoint?: {
    '@type': string;
    telephone?: string;
    contactType?: string;
    email?: string;
  };
  sameAs?: string[];
  founder?: { '@type': 'Person'; '@id': string; name: string; url: string };
}

// Default SEO Configuration
export const defaultSEO: SEOConfig = {
  title: 'AI Dating Photos for Men | Realistic Profile Pictures | UnrealShot',
  description: 'Turn 4–6 selfies into 60 realistic dating photos across 15 coherent shoots. Built for Tinder, Hinge and Bumble. 15 Photo Retakes included. $39 once.',
  author: 'Harvansh Chaudhary',
  siteUrl: getSiteUrl(),
  siteName: 'UnrealShot',
  locale: 'en_US',
  type: 'website',
  robots: 'index, follow',
  // Add your verification codes here
  googleSiteVerification: 'Dr-QEYwpZdsKz8x0c03g4bq8B1Fmw8ts26FehVHy89g',
  yandexVerification: '47ba7543cebfc90b',
};
// Social Media Configuration
export const socialConfig: SocialConfig = {
  twitter: {
    handle: '@unrealshotai', // Replace with your actual Twitter handle
    site: '@unrealshotai', // Replace with your actual Twitter handle
    cardType: 'summary_large_image',
  },
  instagram: {
    handle: '@unrealshotai', // Replace with your actual Instagram handle
  },
};

// Organization Schema for Structured Data
export const organizationSchema: OrganizationSchema = {
  '@type': 'Organization',
  '@id': `${defaultSEO.siteUrl}/#organization`,
  name: 'UnrealShot',
  url: defaultSEO.siteUrl,
  logo: `${defaultSEO.siteUrl}/site-logo.png`,
  description: defaultSEO.description,
  sameAs: [
    'https://x.com/unrealshotai',
    'https://instagram.com/unrealshotai',
  ],
  founder: {
    '@type': 'Person',
    '@id': `${defaultSEO.siteUrl}/about#founder`,
    name: 'Harvansh Chaudhary',
    url: `${defaultSEO.siteUrl}/about`,
  },
};
// Robots.txt Configuration
export const robotsConfig = {
  rules: {
    userAgent: '*',
    allow: '/',
    disallow: [
      '/api/',
      '/dashboard',
      '/dashboard/',
      '/account',
      '/account/',
      '/settings',
      '/settings/',
      '/admin',
      '/admin/',
      '/landing-draft',
    ],
  },
  sitemap: `${defaultSEO.siteUrl}/sitemap.xml`,
};
