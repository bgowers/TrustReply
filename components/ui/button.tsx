import { cn } from "@/lib/utils";
import * as React from "react";
import { Magnetic } from "@/components/motion/magnetic";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "shimmer" | "ink";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "text-white border border-white/15 [background:var(--accent-gradient)] hover:[background:var(--accent-gradient-hover)] shadow-[var(--surface-elev-2)] hover:shadow-[var(--surface-elev-3)]",
  secondary:
    "border bg-white text-[color:var(--color-fg)] hover:bg-[color:var(--color-card)] shadow-[var(--surface-elev-1)]",
  ghost: "text-[color:var(--color-fg)] hover:bg-[color:var(--color-card)]",
  danger:
    "border border-[color:var(--color-danger)] text-[color:var(--color-danger)] hover:bg-red-50",
  shimmer:
    "relative overflow-hidden text-white border border-white/15 [background:var(--accent-gradient)] hover:[background:var(--accent-gradient-hover)] shadow-[var(--surface-elev-2)] hover:shadow-[var(--surface-elev-3)]",
  ink: "border border-white/12 bg-white text-[color:var(--color-ink)] hover:bg-white/90 shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(255,255,255,0.25)]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  /** Wrap the button in a Magnetic pointer-follower. */
  magnetic?: boolean;
  /** Show a spinner and disable the button. */
  loading?: boolean;
}

const Spinner = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="3"
    />
    <path
      className="opacity-90"
      fill="currentColor"
      d="M4 12a8 8 0 0 1 8-8v3a5 5 0 0 0-5 5H4z"
    />
  </svg>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = "primary",
    size = "md",
    magnetic = false,
    loading = false,
    disabled,
    children,
    ...props
  },
  ref,
) {
  const button = (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "group/btn relative inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color:var(--color-accent)]",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {loading ? <Spinner /> : null}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
      {variant === "primary" || variant === "shimmer" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/30"
        />
      ) : null}
      {variant === "shimmer" ? (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -inset-x-1 z-0 opacity-0 transition-opacity duration-200 group-hover/btn:opacity-100 motion-reduce:hidden"
        >
          <span className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent [animation:shimmer-slide_1.6s_ease-in-out_infinite]" />
        </span>
      ) : null}
    </button>
  );

  if (magnetic) {
    return <Magnetic strength={0.18}>{button}</Magnetic>;
  }
  return button;
});
