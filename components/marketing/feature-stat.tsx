import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FeatureStatProps = {
  number: string;
  label: string;
  body: string;
  icon?: ReactNode;
  className?: string;
};

export function FeatureStat({ number, label, body, icon, className }: FeatureStatProps) {
  return (
    <div
      className={cn(
        "group relative rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/[0.04]",
        className,
      )}
    >
      {icon ? (
        <div className="mb-5 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.04] text-[color:var(--aurora-1)]">
          {icon}
        </div>
      ) : null}
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--color-ink-muted)]">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white nums">
        {number}
      </p>
      <p className="mt-3 text-[14px] leading-relaxed text-[color:var(--color-ink-muted)]">
        {body}
      </p>
    </div>
  );
}
