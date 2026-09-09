'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { SmartTextLoader } from '@/components/preview/SmartTextLoader';
import { SocialProofCarousel } from '@/components/preview/SocialProofCarousel';
import { PreviewPaymentCards } from '@/components/preview/PreviewPaymentCards';
import { triggerConfetti } from '@/components/preview/RevealAnimation';
import { Loader2, Sparkles } from 'lucide-react';

interface PreviewStatus {
    status: 'pending' | 'generating' | 'completed' | 'failed' | 'not_found';
    image_url?: string;
}

interface PricingPlan {
    id: string;
    name: string;
    price: number;
    credits: number;
    isPopular?: boolean;
}

export default function PreviewPageClient({
    userId,
    plans
}: {
    userId: string;
    plans: PricingPlan[];
}) {
    const params = useParams();
    const router = useRouter();
    const modelId = params.modelId as string;

    const [status, setStatus] = useState<PreviewStatus>({ status: 'pending' });
    const [hasRevealed, setHasRevealed] = useState(false);
    const [pollCount, setPollCount] = useState(0);

    const pollStatus = useCallback(async () => {
        try {
            const response = await fetch(`/api/preview/status?modelId=${modelId}`);
            const data = await response.json();

            if (data.status === 'completed' && data.image_url) {
                setStatus({
                    status: 'completed',
                    image_url: data.image_url,
                });

                if (!hasRevealed) {
                    setHasRevealed(true);
                    triggerConfetti();

                    // Mark that user has seen their free preview
                    fetch('/api/preview/mark-viewed', { method: 'POST' }).catch(console.error);
                }
            } else if (data.status === 'failed') {
                setStatus({ status: 'failed' });
            } else {
                setStatus({ status: data.status || 'pending' });
            }

            setPollCount(prev => prev + 1);
        } catch (error) {
            console.error('Failed to poll preview status:', error);
        }
    }, [modelId, hasRevealed]);

    // Poll every 5 seconds while pending
    useEffect(() => {
        if (status.status === 'completed' || status.status === 'failed') {
            return;
        }

        // Initial poll
        pollStatus();

        const interval = setInterval(pollStatus, 5000);
        return () => clearInterval(interval);
    }, [pollStatus, status.status]);

    // Waiting phase (image not ready yet)
    if (status.status === 'pending' || status.status === 'generating') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-lg mx-auto space-y-8">
                    {/* Main headline */}
                    <div className="space-y-2">
                        <Sparkles className="h-12 w-12 mx-auto text-primary animate-pulse" />
                        <h2 className="text-2xl md:text-4xl font-bold">
                            Creating your Free AI twin...
                        </h2>
                    </div>

                    {/* Smart text loader */}
                    <SmartTextLoader intervalMs={15000} />

                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Please don't close the page. This usually takes 60-90 seconds</span>
                    </div>
                </div>

                {/* Social proof carousel at bottom */}
                <div className="mt-12 w-full max-w-2xl">
                    <SocialProofCarousel />
                </div>
            </div>
        );
    }

    // Failed state
    if (status.status === 'failed') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-lg mx-auto space-y-4">
                    <h1 className="text-2xl font-bold">Generation failed</h1>
                    <p className="text-muted-foreground">
                        Something went wrong generating your preview. Don't worry - this is on us.
                    </p>
                    <button
                        onClick={() => router.push('/dating-shoot')}
                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                    >
                        Go to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Not found state - preview generation wasn't triggered properly
    if (status.status === 'not_found') {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
                <div className="text-center max-w-lg mx-auto space-y-4">
                    <h1 className="text-2xl font-bold">Preview Not Ready</h1>
                    <p className="text-muted-foreground">
                        Your preview is being prepared. This page will refresh automatically.
                    </p>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                </div>
            </div>
        );
    }

    // Reveal phase (image ready!)
    return (
        <div className="min-h-[80vh] px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">
                {/* Revealed image */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold animate-fade-in">
                        Is this you? 😲
                    </h1>

                    <div className="relative mx-auto max-w-sm">
                        {/* The preview image */}
                        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-4 ring-primary/20">
                            <Image
                                src={status.image_url!}
                                alt="Your AI-generated preview"
                                fill
                                className="object-cover"
                                priority
                            />

                            {/* Subtle watermark/preview badge */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                                <span className="text-white text-sm font-medium">
                                    ✨ Your AI Portrait
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment cards */}
                <PreviewPaymentCards plans={plans} userId={userId} />
            </div>
        </div>
    );
}
