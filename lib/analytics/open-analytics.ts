'use client';

export type AnalyticsProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export type AnalyticsEventName =
  | 'signup_cta_clicked'
  | 'auth_started'
  | 'auth_link_sent'
  | 'auth_completed'
  | 'model_creation_started'
  | 'model_created'
  | 'model_creation_failed'
  | 'checkout_started'
  | 'checkout_failed'
  | 'purchase_completed'
  | 'purchase_failed'
  | 'shoot_started'
  | 'shoot_completed'
  | 'shoot_failed'
  | 'shoot_retry_requested'
  | 'photo_retake_requested'
  | 'photos_downloaded';

type OpenAnalyticsMethod = 'track' | 'conversion' | 'identify';
type OpenAnalyticsCommand = [OpenAnalyticsMethod, ...unknown[]];

type OpenAnalyticsTracker = {
  track: (name: string, properties?: AnalyticsProperties) => void;
  conversion: (name: string, properties?: AnalyticsProperties) => void;
  identify: (externalUserId: string) => void;
};

type OpenAnalyticsStub = ((...command: OpenAnalyticsCommand) => void) & {
  q: OpenAnalyticsCommand[];
};

declare global {
  interface Window {
    oa?: OpenAnalyticsTracker | OpenAnalyticsStub;
    openanalytics?: OpenAnalyticsTracker;
  }
}

const DEDUPE_PREFIX = 'unrealshot:oa:';

function tracker(): OpenAnalyticsTracker | OpenAnalyticsStub | null {
  if (typeof window === 'undefined') return null;
  if (window.openanalytics) return window.openanalytics;
  if (window.oa) return window.oa;

  const stub = ((...command: OpenAnalyticsCommand) => {
    stub.q.push(command);
  }) as OpenAnalyticsStub;
  stub.q = [];
  window.oa = stub;
  return stub;
}

function invoke(method: OpenAnalyticsMethod, ...args: unknown[]) {
  const instance = tracker();
  if (!instance) return;

  if (typeof instance === 'function') {
    instance(method, ...args);
    return;
  }

  if (method === 'identify') {
    instance.identify(args[0] as string);
    return;
  }

  const name = args[0] as string;
  const properties = args[1] as AnalyticsProperties | undefined;
  if (method === 'conversion') {
    instance.conversion(name, properties);
  } else {
    instance.track(name, properties);
  }
}

function claimOnce(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storageKey = `${DEDUPE_PREFIX}${key}`;
    if (window.localStorage.getItem(storageKey)) return false;
    window.localStorage.setItem(storageKey, '1');
    return true;
  } catch {
    return true;
  }
}

export function trackEvent(
  name: AnalyticsEventName,
  properties?: AnalyticsProperties
) {
  invoke('track', name, properties);
}

export function trackEventOnce(
  name: AnalyticsEventName,
  key: string,
  properties?: AnalyticsProperties
) {
  if (!claimOnce(`${name}:${key}`)) return;
  trackEvent(name, properties);
}

export function trackConversionOnce(
  name: AnalyticsEventName,
  key: string,
  properties?: AnalyticsProperties
) {
  if (!claimOnce(`${name}:${key}`)) return;
  invoke('conversion', name, properties);
}
