import { cn } from "@/lib/utils";
import * as React from "react";

type Tone = "light" | "ink";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Visual tone — `ink` is the dark-backdrop variant for the login surface. */
  tone?: Tone;
  /**
   * When true, the component is the input half of a floating-label control.
   * Caller renders <label className="peer-..."> for the floating label.
   */
  floating?: boolean;
}

const toneClasses: Record<Tone, string> = {
  light:
    "border-[color:var(--color-border)] bg-white text-[color:var(--color-fg)] placeholder:text-[color:var(--color-subtle)] focus:border-[color:var(--color-accent)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_22%,transparent)]",
  ink: "border-white/12 bg-white/8 text-white placeholder:text-white/40 focus:border-white/40 focus:bg-white/12 focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--aurora-1)_30%,transparent)]",
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, tone = "light", floating = false, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      className={cn(
        "peer block w-full rounded-md border px-3 py-2 text-sm shadow-sm outline-none transition-[box-shadow,border-color,background-color] duration-180 focus:outline-none",
        toneClasses[tone],
        floating && "pt-5 pb-2 placeholder:text-transparent",
        className,
      )}
      {...props}
    />
  );
});
