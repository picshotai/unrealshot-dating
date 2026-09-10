'use client';

import { useEffect } from 'react';
import { trackEvent } from '@/lib/analytics/open-analytics';

const AUTH_COOKIE = 'oa_auth_completed';

function readCookie(name: string) {
  const prefix = `${name}=`;
  return document.cookie
    .split('; ')
    .find((item) => item.startsWith(prefix))
    ?.slice(prefix.length);
}

export function OpenAnalyticsBridge() {
  useEffect(() => {
    const method = readCookie(AUTH_COOKIE);
    if (method) {
      trackEvent('auth_completed', { method: decodeURIComponent(method) });
      document.cookie = `${AUTH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
    }

    const trackLoginCta = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const link = target.closest<HTMLAnchorElement>('a[href]');
      if (!link) return;

      const destination = new URL(link.href, window.location.href);
      if (
        destination.origin !== window.location.origin ||
        destination.pathname !== '/login' ||
        window.location.pathname === '/login'
      ) {
        return;
      }

      trackEvent('signup_cta_clicked', {
        source_path: window.location.pathname,
      });
    };

    document.addEventListener('click', trackLoginCta, { capture: true });
    document.addEventListener('auxclick', trackLoginCta, { capture: true });
    return () => {
      document.removeEventListener('click', trackLoginCta, { capture: true });
      document.removeEventListener('auxclick', trackLoginCta, { capture: true });
    };
  }, []);

  return null;
}
