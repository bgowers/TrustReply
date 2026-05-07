"use client";

import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { useRef, type ReactNode } from "react";

type ParallaxProps = {
  /** Range -1..1 — positive moves slower than scroll, negative moves faster. */
  speed?: number;
  className?: string;
  children: ReactNode;
};

export function Parallax({ speed = 0.2, className, children }: ParallaxProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const range = 80 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}
