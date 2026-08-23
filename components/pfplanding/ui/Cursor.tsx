"use client";

import React, { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

export const Cursor: React.FC = () => {
  const pathname = usePathname();
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isEditorLanding = pathname === '/' || pathname === '/new-landing';

  useEffect(() => {
    if (isEditorLanding) return;

    // Direct DOM update for 60fps+ performance (bypassing React state)
    const updatePosition = (e: MouseEvent) => {
      if (cursorRef.current) {
        // Use translate3d for hardware acceleration
        cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    const updateHoverState = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check if inside navbar (exclude from cursor effect)
      const isInNavbar = target.closest('nav') || target.closest('[data-no-cursor]');
      if (isInNavbar) {
        setIsHovering(false);
        return;
      }

      // Check if hovering over interactive elements
      const isInteractive =
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[role="button"]');

      setIsHovering(!!isInteractive);
    };

    window.addEventListener('mousemove', updatePosition, { passive: true });
    window.addEventListener('mouseover', updateHoverState, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, [isEditorLanding]);

  if (isEditorLanding) return null;

  return (
    <div
      ref={cursorRef}
      className="cursor-custom pointer-events-none fixed top-0 left-0 z-[9999] mix-blend-difference"
    // Note: No transition-transform class here. This removes the "heavy/laggy" feel.
    >
      {/* Crosshair Container */}
      <div className="relative -translate-x-1/2 -translate-y-1/2">

        {/* Horizontal Line */}
        <div
          className={`absolute bg-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHovering ? 'w-8 h-[2px]' : 'w-4 h-[1px]'
            }`}
        />

        {/* Vertical Line */}
        <div
          className={`absolute bg-white left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 transition-all duration-300 ease-out ${isHovering ? 'h-8 w-[2px]' : 'h-4 w-[1px]'
            }`}
        />

        {/* Center Dot (Only visible on hover/focus) */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent transition-all duration-300 ${isHovering ? 'w-1 h-1 opacity-100' : 'w-0 h-0 opacity-0'
            }`}
        />


      </div>
    </div>
  );
};
