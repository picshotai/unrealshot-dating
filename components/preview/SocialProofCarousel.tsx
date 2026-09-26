'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

// Sample images for social proof - using placeholder paths
// These should be replaced with actual generated image examples
const SAMPLE_IMAGES = [
    '/pages/dating_gym_photo.webp',
    '/pages/outdoor_coffee_closeup.webp',
    '/pages/city_walk_closeup.webp',
    '/pages/dinner_closeup.webp',
    '/pages/coastal_walk_closeup.webp',
    '/pages/kitchen_shot_cooking.webp',
    '/pages/rooftop3.webp',
    '/pages/hinge_closeup.webp',
];

interface SocialProofCarouselProps {
    images?: string[];
    speed?: number; // pixels per second
}

export function SocialProofCarousel({
    images = SAMPLE_IMAGES,
    speed = 50
}: SocialProofCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const scrollContainer = scrollRef.current;
        if (!scrollContainer) return;

        let animationId: number;
        let startTime: number;
        const totalWidth = scrollContainer.scrollWidth / 2; // Since we duplicate

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Calculate position based on speed
            const position = (elapsed * speed / 1000) % totalWidth;
            scrollContainer.scrollLeft = position;

            animationId = requestAnimationFrame(animate);
        };

        animationId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationId);
    }, [speed]);

    // Duplicate images for seamless loop
    const duplicatedImages = [...images, ...images];

    return (
        <div className="w-full overflow-hidden">
            <p className="text-center text-sm text-muted-foreground mb-4">
                See what others are creating:
            </p>
            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-hidden"
                style={{ scrollBehavior: 'auto' }}
            >
                {duplicatedImages.map((src, index) => (
                    <div
                        key={index}
                        className="flex-shrink-0 w-24 h-32 md:w-32 md:h-40 rounded-lg overflow-hidden bg-muted"
                    >
                        <Image
                            src={src}
                            alt={`Sample ${(index % images.length) + 1}`}
                            width={128}
                            height={160}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                // Fallback for missing images
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
