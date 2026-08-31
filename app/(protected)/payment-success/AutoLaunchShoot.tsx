'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AutoLaunchShoot() {
  const router = useRouter();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [isDelayed, setIsDelayed] = useState(false);
  const pollCount = useRef(0);
  const isNavigating = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const checkCreditsAndLaunch = async () => {
      if (isNavigating.current) return;
      pollCount.current += 1;

      try {
        const res = await fetch('/api/credits/check?requiredCredits=60');
        if (res.ok) {
          const data = await res.json();
          if (data.hasCredits && isMounted && !isNavigating.current) {
            isNavigating.current = true;
            setIsVerifying(false);
            setIsRedirecting(true);
            router.push('/dating-shoot?resume=auto-start');
            return;
          }
        }
      } catch (err) {
        console.warn('Credit check error while waiting for webhook:', err);
      }

      // If more than 15 attempts (~15 seconds), show fallback buttons
      if (pollCount.current >= 15 && isMounted) {
        setIsDelayed(true);
      }
    };

    // Run initial check immediately
    checkCreditsAndLaunch();

    // Poll every 1 second
    const interval = setInterval(checkCreditsAndLaunch, 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [router]);

  const handleInstantLaunch = () => {
    isNavigating.current = true;
    setIsRedirecting(true);
    router.push('/dating-shoot?resume=auto-start');
  };

  const handleReviewSettings = () => {
    isNavigating.current = true;
    setIsRedirecting(true);
    router.push('/dating-shoot?resume=checkout');
  };

  return (
    <div className="w-full space-y-4 pt-2">
      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-center space-y-2">
        <div className="flex items-center justify-center gap-2 font-oxanium font-bold text-base text-emerald-400">
          {isRedirecting ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <Sparkles className="w-4 h-4 animate-pulse" />
          )}
          Payment successful. Preparing your shoot…
        </div>

        <p className="text-xs text-zinc-300 flex items-center justify-center gap-2">
          {isRedirecting ? (
            <span className="flex items-center gap-2 text-white font-medium">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Credits confirmed! Opening studio...
            </span>
          ) : isDelayed ? (
            <span className="text-zinc-400">
              Payment confirmed! You can start your photoshoot now.
            </span>
          ) : (
            <span className="flex items-center gap-2 text-zinc-300">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
              Crediting your wallet &amp; initializing photoshoot...
            </span>
          )}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          onClick={handleInstantLaunch}
          disabled={isRedirecting}
          className="flex-1 bg-white hover:bg-zinc-200 text-black font-bold h-12 rounded-xl flex items-center justify-center gap-2 font-oxanium transition-all shadow-lg active:scale-95 cursor-pointer"
        >
          {isRedirecting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Opening Studio...
            </>
          ) : (
            <>
              Start My Dating Shoot Now
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>

        <Button
          onClick={handleReviewSettings}
          variant="outline"
          disabled={isRedirecting}
          className="sm:w-auto border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium h-12 px-5 rounded-xl font-oxanium cursor-pointer"
        >
          Review Setup
        </Button>
      </div>
    </div>
  );
}

