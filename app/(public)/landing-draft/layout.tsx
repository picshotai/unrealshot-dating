import type { Metadata } from 'next';

/**
 * Draft layout — keeps the work-in-progress landing out of search results.
 *
 * The page itself is a client component and cannot export `metadata`, so the
 * robots directive lives here. `/landing-draft` is also listed in
 * `robotsConfig.disallow` (config/seo.ts); this tag is the half that still
 * works once someone has the URL, since disallow only stops well-behaved
 * crawlers from fetching it.
 */
export const metadata: Metadata = {
  title: 'Landing draft',
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function LandingDraftLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
