'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface DodoCheckoutButtonProps {
  planId: string;
  userId: string;
  amount: number;
  credits: number;
  planName?: string;
  className?: string;
  children?: React.ReactNode;
}

export default function DodoCheckoutButton({
  planId,
  userId,
  amount,
  credits,
  planName,
  className = '',
  children
}: DodoCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleCheckout = async () => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to purchase credits',
        variant: 'destructive'
      });
      router.push('/login');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/dodopayments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId,
          userId,
          returnUrl: `${window.location.origin}/payment-success?amount=${amount}&credits=${credits}&plan_name=${encodeURIComponent(planName || 'Credit Package')}`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      if (data.success && data.checkout_url) {
        // Redirect to dodopayments checkout
        window.location.href = data.checkout_url;
      } else {
        throw new Error('Invalid response from checkout API');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: 'Checkout Error',
        description: error instanceof Error ? error.message : 'Failed to start checkout process',
        variant: 'destructive'
      });

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`w-full ${className}`}
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        children || `Get your pack — $${amount}`
      )}
    </Button>
  );
}

// Alternative component for inline checkout (if dodopayments supports embedded checkout)
export function DodoInlineCheckout({
  planId,
  userId,
  onSuccess,
  onError
}: {
  planId: string;
  userId: string;
  onSuccess?: (sessionId: string) => void;
  onError?: (error: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);

  const createCheckoutSession = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/dodopayments/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId,
          userId,
          returnUrl: `${window.location.origin}/dating-shoot?payment=success`
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create checkout session');
      }

      if (data.success && data.checkout_url) {
        setCheckoutUrl(data.checkout_url);
        onSuccess?.(data.session_id);
      } else {
        throw new Error('Invalid response from checkout API');
      }

    } catch (error) {
      console.error('Checkout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create checkout session';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (checkoutUrl) {
    return (
      <div className="w-full h-96 border rounded-lg">
        <iframe
          src={checkoutUrl}
          className="w-full h-full rounded-lg"
          title="Dodopayments Checkout"
        />
      </div>
    );
  }

  return (
    <Button
      onClick={createCheckoutSession}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading Checkout...
        </>
      ) : (
        'Start Checkout'
      )}
    </Button>
  );
}
