import { cn } from "@/lib/utils";

type LogomarkProps = {
  className?: string;
  size?: number;
};

/**
 * TrustReply mark — a rounded shield with an inset checkmark. Color inherits
 * from `currentColor` so the same SVG works on light and dark surfaces.
 */
export function Logomark({ className, size = 22 }: LogomarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("inline-block shrink-0", className)}
      aria-hidden
    >
      <defs>
        <linearGradient id="tr-shield-grad" x1="0" y1="0" x2="0" y2="24">
          <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.85" />
        </linearGradient>
      </defs>
      <path
        d="M12 2 L21 6 V12 C21 17 16.5 21 12 22 C7.5 21 3 17 3 12 V6 Z"
        fill="url(#tr-shield-grad)"
      />
      <path
        d="M8.5 12.2 L11 14.7 L15.7 9.6"
        stroke="white"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

/** Logomark + wordmark lockup. */
export function Wordmark({ className, accent = false }: { className?: string; accent?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-semibold tracking-tight",
        className,
      )}
    >
      <Logomark
        className={accent ? "text-[color:var(--color-accent)]" : "text-current"}
      />
      <span>TrustReply</span>
    </span>
  );
}
