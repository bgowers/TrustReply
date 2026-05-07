import type { ReactNode } from "react";

type MarqueeProps = {
  speed?: number;
  className?: string;
  children: ReactNode;
};

/**
 * CSS-only infinite marquee. Children must render the visible content;
 * we duplicate it for the seamless loop. Pause on hover. Reduced-motion
 * is handled by the global CSS rule that nullifies animation-duration.
 */
export function Marquee({ speed = 40, className, children }: MarqueeProps) {
  return (
    <div
      className={`group/marquee relative overflow-hidden ${className ?? ""}`}
      style={
        {
          "--marquee-duration": `${speed}s`,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[var(--color-bg)] to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[var(--color-bg)] to-transparent"
      />
      <div
        className="flex w-max gap-12 [animation:marquee-x_var(--marquee-duration)_linear_infinite] group-hover/marquee:[animation-play-state:paused]"
      >
        <div className="flex shrink-0 items-center gap-12">{children}</div>
        <div aria-hidden className="flex shrink-0 items-center gap-12">
          {children}
        </div>
      </div>
    </div>
  );
}
