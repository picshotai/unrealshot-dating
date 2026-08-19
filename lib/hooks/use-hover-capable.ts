"use client";

import { useEffect, useState } from "react";

/**
 * Whether the device has a real pointer that can hover.
 *
 * Touch screens report pointer events but cannot hover, so effects driven by
 * cursor position are wasted work there — and worse, they latch on first touch
 * and stay stuck. Starts false so the server render and the first client render
 * agree, then upgrades after mount.
 */
export function useHoverCapable(): boolean {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    setCanHover(query.matches);

    const onChange = (event: MediaQueryListEvent) => setCanHover(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return canHover;
}
