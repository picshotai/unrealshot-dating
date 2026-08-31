'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Loader2, CheckCircle2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AutoLaunchShoot() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const [isCheckingManual, setIsCheckingManual] = useState(false);
  const pollCount = useRef(0);
  const isNavigating = useRef(false);

  const checkPackStatus = useCallback(async () => {
    if (isNavigating.current) return;
    pollCount.current += 1;

    try {
      const res = await fetch('/api/dating-shoot/pack-status', {
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.hasPack && !isNavigating.current) {
          isNavigating.current = true;
          setIsRedirecting(true);
          router.push('/dating-shoot?resume=auto-start');
          return true;
        }
      }
    } catch (err) {
      console.warn('Pack check error while waiting for webhook:', err);
    }

    if (pollCount.current >= 15) {
      setIsDelayed(true);
    }
    return false;
  }, [router]);

  useEffect(() => {
    let isMounted = true;

    // Run initial check
    checkPackStatus();

    // Poll every 1 second
    const interval = setInterval(() => {
      if (isMounted) {
        checkPackStatus();
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [checkPackStatus]);

  const handleManualCheck = async () => {
    setIsCheckingManual(true);
    const success = await checkPackStatus();
    if (!success) {
      setTimeout(() => setIsCheckingManual(false), 800);
    }
  };

  const handleReviewSettings = () => {
    isNavigating.current = true;
    setIsRedirecting(true);
    router.push('/dating-shoot?resume=checkout');
  };

  return (
    <div className="w-full space-y-4 pt-2">
      <div className="p-5 rounded-2xl bg-zinc-900/80 border border-emerald-500/30 text-zinc-200 text-center space-y-3 shadow-xl">
        <div className="flex items-center justify-center gap-2 font-oxanium font-bold text-base text-emerald-400">
          {isRedirecting ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          ) : (
            <Sparkles className="w-5 h-5 animate-pulse text-emerald-400" />
          )}
          {isRedirecting
            ? 'Photoshoot Pack Confirmed'
            : 'Payment Successful. Preparing your shoot…'}
        </div>

        <p className="text-xs text-zinc-300 flex items-center justify-center gap-2">
          {isRedirecting ? (
            <span className="flex items-center gap-2 text-white font-medium">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              Opening your photoshoot studio...
            </span>
          ) : (
            <span className="flex items-center gap-2 text-zinc-300">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              Syncing credits with your wallet…
            </span>
          )}
        </p>

        {isDelayed && !isRedirecting && (
          <div className="pt-2 text-[11px] text-zinc-400 leading-relaxed border-t border-zinc-800/80">
            Credits are taking a few extra seconds to synchronize with the payment processor.
          </div>
        )}
      </div>

      {isDelayed && !isRedirecting && (
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          <Button
            onClick={handleManualCheck}
            disabled={isCheckingManual || isRedirecting}
            className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold h-11 rounded-xl flex items-center justify-center gap-2 font-oxanium transition-all shadow-md active:scale-95 cursor-pointer"
          >
            <RotateCw
              className={`w-4 h-4 ${isCheckingManual ? 'animate-spin' : ''}`}
            />
            {isCheckingManual ? 'Checking Wallet...' : 'Check Again'}
          </Button>

          <Button
            onClick={handleReviewSettings}
            variant="outline"
            disabled={isRedirecting}
            className="sm:w-auto border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium h-11 px-5 rounded-xl font-oxanium cursor-pointer"
          >
            Review Setup
          </Button>
        </div>
      )}
    </div>
  );
}

