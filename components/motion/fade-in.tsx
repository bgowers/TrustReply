"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";
import type { ReactNode } from "react";

type FadeInProps = {
  delay?: number;
  y?: number;
  once?: boolean;
  amount?: number;
  duration?: number;
  className?: string;
  children: ReactNode;
} & Omit<HTMLMotionProps<"div">, "children">;

/**
 * Fade-in + slight upward translate when the element enters the viewport.
 * Always renders a `<div>` — wrap children in the desired tag externally.
 */
export function FadeIn({
  delay = 0,
  y = 16,
  once = true,
  amount = 0.3,
  duration = 0.6,
  className,
  children,
  ...rest
}: FadeInProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
