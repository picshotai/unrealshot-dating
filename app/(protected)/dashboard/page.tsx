import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { commonPageMetadata } from '@/lib/seo';

export const metadata: Metadata = commonPageMetadata.dashboard();

/**
 * Legacy entry point.
 *
 * This page used to query `models` and fan out to the studio or to onboarding,
 * which cost an extra navigation on every login and — because a failed query is
 * indistinguishable from an empty one — silently stranded users who already had
 * a model in the onboarding flow.
 *
 * That decision now happens at the edge in `proxy.ts`, which rewrites
 * `/dashboard` before this ever renders. The route is kept only for old links
 * and bookmarks; reaching it at all means the proxy let it through, so send the
 * user to the studio and let the gate sort it out.
 */
export default async function DashboardPage() {
  redirect('/dating-shoot');
}
