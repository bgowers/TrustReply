import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionVariant = "light" | "ink" | "hero";

type SectionProps = {
  variant?: SectionVariant;
  eyebrow?: string;
  className?: string;
  innerClassName?: string;
  id?: string;
  children: ReactNode;
};

const surfaceClasses: Record<SectionVariant, string> = {
  light: "bg-[color:var(--color-bg)] text-[color:var(--color-fg)]",
  ink: "bg-[color:var(--color-ink)] text-[color:var(--color-ink-fg)]",
  hero: "bg-[color:var(--color-ink)] text-[color:var(--color-ink-fg)]",
};

/**
 * Standard section primitive. Provides surface, eyebrow slot, and a
 * consistent inner container. Wrap with motion outside if you want
 * scroll-driven entrances.
 */
export function Section({
  variant = "light",
  eyebrow,
  className,
  innerClassName,
  id,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("relative isolate overflow-hidden", surfaceClasses[variant], className)}
    >
      <div
        className={cn(
          "relative mx-auto w-full max-w-6xl px-6 py-24 sm:py-28",
          innerClassName,
        )}
      >
        {eyebrow ? (
          <p
            className={cn(
              "eyebrow mb-6",
              variant === "ink" || variant === "hero"
                ? "text-[color:var(--color-ink-muted)]"
                : "text-[color:var(--color-muted)]",
            )}
          >
            {eyebrow}
          </p>
        ) : null}
        {children}
      </div>
    </section>
  );
}
