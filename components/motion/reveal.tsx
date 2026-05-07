"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  text: string;
  className?: string;
  /** Stagger between words in seconds. */
  stagger?: number;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  children?: ReactNode;
};

/**
 * Word-by-word stagger fade-up. Used sparingly — hero H1 only.
 * Pass plain text via `text`; the component handles segmentation.
 */
export function Reveal({
  text,
  className,
  stagger = 0.035,
  delay = 0,
  as = "h1",
}: RevealProps) {
  const reduced = useReducedMotion();
  const words = text.split(/(\s+)/);
  const Tag = motion[as];

  if (reduced) {
    const StaticTag = as;
    return <StaticTag className={className}>{text}</StaticTag>;
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            delayChildren: delay,
          },
        },
      }}
    >
      {words.map((word, i) =>
        /^\s+$/.test(word) ? (
          <span key={i}> </span>
        ) : (
          <motion.span
            key={i}
            className="inline-block will-change-transform"
            variants={{
              hidden: { opacity: 0, y: "0.5em" },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
              },
            }}
          >
            {word}
          </motion.span>
        ),
      )}
    </Tag>
  );
}
