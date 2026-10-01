"use client"

import Link from 'next/link';
import { Link as PublicLink } from '@/i18n/navigation';
import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import { isPublishedBlogLocale } from '@/i18n/config';
import { publicNavigationCopy } from '@/lib/public-navigation-copy';

type FooterLink = { href: string; label: string; englishOnly?: boolean; private?: boolean }

export default function Footer() {
  const t = useTranslations('Common');
  const locale = useLocale();
  const copy = publicNavigationCopy[locale as keyof typeof publicNavigationCopy] || publicNavigationCopy.en;

  const companyLinks: FooterLink[] = [
    { href: '/about', label: t('footer.about') },
    ...(isPublishedBlogLocale(locale) ? [{ href: '/blog', label: t('footer.datingPhotoGuides'), englishOnly: true }] : []),
    { href: '/contact', label: copy.contact },
    { href: '/pricing', label: t('navigation.pricing') },
    { href: '/privacy-policy', label: t('footer.privacyPolicy') },
    { href: '/terms', label: t('footer.terms') },
    { href: '/refund-policy', label: t('footer.refundPolicy') },
  ];

  const datingFeatures: FooterLink[] = [
    { href: '/dating-photos', label: t('navigation.datingPhotos') },
    { href: '/dating-photos/examples', label: t('navigation.examples') },
    { href: '/how-it-works', label: t('navigation.howItWorks') },
    { href: '/realistic-ai-dating-photos', label: copy.realisticDatingPhotos },
    { href: '/login', label: t('footer.startYourShoot'), private: true },
  ];

  const datingApps: FooterLink[] = [
    { href: '/dating-photos/tinder', label: copy.aiTinderPhotos },
    { href: '/dating-photos/hinge', label: copy.aiHingePhotos },
    { href: '/dating-photos/bumble', label: copy.aiBumblePhotos },
    { href: '/guides/tinder-photos', label: copy.tinderGuide },
    { href: '/guides/hinge-photos', label: copy.hingeGuide },
    { href: '/guides/bumble-photos', label: copy.bumbleGuide },
    { href: '/dating-photos/activity', label: copy.activityPhotos },
  ];

  return (
    <footer className="w-full py-12 px-6 mt-auto bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-10 border-b border-gray-200">
          <div>
            <PublicLink href="/" className="flex items-center gap-2.5">
              <Image
                src="/site-logo.png"
                alt={t('footer.logoAlt')}
                width={28}
                height={28}
                className="w-7 h-7 rounded"
              />
              <span className="text-2xl font-semibold tracking-tight text-gray-900 hover:text-[#ff6f00] transition-colors">
                {t('brandName')}
              </span>
            </PublicLink>
            <p className="text-gray-600 text-sm mt-2 max-w-md">
              {t('footer.description')}
            </p>
          </div>

          {/* Social Links */}
          <div className="flex gap-3">
            <a
              href="https://x.com/unrealshotai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="w-10 h-10 hover:bg-gray-100 bg-[#ff6f00] rounded-full flex items-center justify-center transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:text-gray-600 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            
          </div>
        </div>

        {/* Links Grid */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {/* Product & Features */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{t('footer.datingPhotoshoot')}</h3>
            <ul className="mt-4 space-y-2.5">
              {datingFeatures.map((link) => (
                <li key={link.label}>
                  {link.private ? (
                    <Link href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">{link.label}</Link>
                  ) : link.englishOnly ? (
                    <Link href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">{link.label}</Link>
                  ) : (
                    <PublicLink href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">{link.label}</PublicLink>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Dating App Optimization */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{t('footer.appOptimization')}</h3>
            <ul className="mt-4 space-y-2.5">
              {datingApps.map((link) => (
                <li key={link.label}>
                  <PublicLink href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">
                    {link.label}
                  </PublicLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Company & Legal */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">{t('footer.company')}</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  {link.englishOnly ? <Link href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">{link.label}</Link> : <PublicLink href={link.href} className="text-gray-600 hover:text-[#ff6f00] transition-colors text-sm">{link.label}</PublicLink>}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-200 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs">
            {t('footer.copyright', { year: new Date().getFullYear() })}
          </p>
          <p className="text-gray-500 text-xs">
            {t('footer.tagline')}
          </p>
        </div>
      </div>
    </footer>
  );
}
