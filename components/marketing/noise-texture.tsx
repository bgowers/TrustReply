import { cn } from "@/lib/utils";

export function NoiseTexture({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 bg-noise", className)}
    />
  );
}
