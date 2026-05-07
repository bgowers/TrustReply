"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  useReducedMotion,
} from "motion/react";
import { useRef, type PointerEvent, type ReactNode } from "react";

type TiltProps = {
  /** Maximum tilt angle in degrees. */
  max?: number;
  /** Show a soft glare overlay that follows the cursor. */
  glare?: boolean;
  className?: string;
  children: ReactNode;
};

/**
 * 3D pitch/yaw on cursor. Used on pricing cards. Reduced-motion = pass-through.
 */
export function Tilt({ max = 6, glare = false, className, children }: TiltProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), {
    stiffness: 220,
    damping: 24,
  });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), {
    stiffness: 220,
    damping: 24,
  });
  const glareX = useTransform(px, [0, 1], ["10%", "90%"]);
  const glareY = useTransform(py, [0, 1], ["10%", "90%"]);
  const glareBg = useMotionTemplate`radial-gradient(220px circle at ${glareX} ${glareY}, rgba(255,255,255,0.55), transparent 60%)`;

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const handleLeave = () => {
    px.set(0.5);
    py.set(0.5);
  };

  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 800,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      {children}
      {glare ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
          style={{ background: glareBg }}
        />
      ) : null}
    </motion.div>
  );
}
