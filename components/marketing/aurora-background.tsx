import { cn } from "@/lib/utils";

type Variant = "hero" | "cta" | "login";

const intensity: Record<Variant, number> = {
  hero: 0.7,
  cta: 0.85,
  login: 0.6,
};

/**
 * Three counter-drifting blurred radial blobs anchored at deep navy. Pure CSS,
 * pointer-events: none. Pause animation under reduced-motion (handled by the
 * global media query).
 */
export function AuroraBackground({
  variant = "hero",
  className,
}: {
  variant?: Variant;
  className?: string;
}) {
  const i = intensity[variant];
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      {/* Base ink wash */}
      <div className="absolute inset-0 bg-[color:var(--color-ink)]" />

      {/* Aurora blob 1 — indigo */}
      <div
        className="absolute top-[-20%] left-[-15%] h-[60vmax] w-[60vmax] rounded-full blur-[120px] [animation:aurora-drift-1_60s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, var(--aurora-1) 0%, transparent 60%)`,
          opacity: 0.55 * i,
          mixBlendMode: "screen",
        }}
      />
      {/* Aurora blob 2 — violet */}
      <div
        className="absolute top-[-10%] right-[-10%] h-[50vmax] w-[50vmax] rounded-full blur-[120px] [animation:aurora-drift-2_80s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, var(--aurora-2) 0%, transparent 60%)`,
          opacity: 0.5 * i,
          mixBlendMode: "screen",
        }}
      />
      {/* Aurora blob 3 — cyan rim */}
      <div
        className="absolute bottom-[-30%] left-[20%] h-[55vmax] w-[55vmax] rounded-full blur-[140px] [animation:aurora-drift-1_72s_ease-in-out_infinite]"
        style={{
          background: `radial-gradient(circle, var(--aurora-3) 0%, transparent 60%)`,
          opacity: 0.35 * i,
          mixBlendMode: "screen",
        }}
      />
      {/* Bottom fade-out so the band blends with subsequent light surfaces */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[color:var(--color-ink)]" />
    </div>
  );
}
