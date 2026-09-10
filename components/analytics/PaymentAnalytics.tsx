'use client';

import { useEffect } from 'react';
import {
  trackConversionOnce,
  trackEventOnce,
} from '@/lib/analytics/open-analytics';

type PaymentAnalyticsProps = {
  status: 'completed' | 'failed' | 'pending' | string;
  transactionReference?: string;
  amount: number;
  credits: number;
  plan: string;
};

export function PaymentAnalytics({
  status,
  transactionReference,
  amount,
  credits,
  plan,
}: PaymentAnalyticsProps) {
  useEffect(() => {
    if (!transactionReference) return;

    const properties = {
      order_id: transactionReference,
      amount,
      credits,
      plan,
    };

    if (status === 'completed') {
      trackConversionOnce(
        'purchase_completed',
        transactionReference,
        properties
      );
    } else if (status === 'failed') {
      trackEventOnce('purchase_failed', transactionReference, {
        credits,
        plan,
      });
    }
  }, [amount, credits, plan, status, transactionReference]);

  return null;
}
