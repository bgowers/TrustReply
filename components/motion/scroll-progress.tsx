"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * 2px scroll-progress bar pinned to the top of the viewport. Used on legal
 * pages. Reduced-motion: the bar still renders but stays in sync with scroll
 * via the global behavior — useSpring is a no-op when transition durations
 * are zeroed.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-[var(--aurora-1)] via-[var(--aurora-2)] to-[var(--aurora-3)]"
    />
  );
}
