"use client";

import { useEffect, useState } from "react";

/**
 * Mirrors `useReducedMotion` from motion/react but is usable in non-Motion code
 * (Lenis init, the live-questionnaire ticker, etc). SSR-safe: returns `false`
 * during render and updates after mount.
 */
export function useReducedMotionGuard(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  return reduced;
}
