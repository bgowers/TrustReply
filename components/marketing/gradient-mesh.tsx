import { cn } from "@/lib/utils";

/**
 * 2-stop conic gradient — softer than aurora, used behind pricing cards
 * and as a decorative accent rim. Opacity-controlled.
 */
export function GradientMesh({
  className,
  intensity = 0.18,
}: {
  className?: string;
  intensity?: number;
}) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 blur-3xl", className)}
      style={{
        background: `conic-gradient(from 220deg at 50% 50%, var(--aurora-1), var(--aurora-2), var(--aurora-3), var(--aurora-4), var(--aurora-1))`,
        opacity: intensity,
      }}
    />
  );
}
