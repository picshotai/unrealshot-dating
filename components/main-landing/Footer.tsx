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
    { href: '/dashboard', label: t('footer.startYourShoot'), private: true },
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
              <span className="text-2xl font-bold tracking-tight text-gray-900 hover:text-[#ff6f00] transition-colors">
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
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com/unrealshotai"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 hover:bg-gray-100 bg-[#ff6f00] rounded-full flex items-center justify-center transition-colors group"
            >
              <svg className="w-4 h-4 group-hover:text-gray-600 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
