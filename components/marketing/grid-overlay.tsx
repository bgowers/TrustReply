import { cn } from "@/lib/utils";

export function GridOverlay({
  variant = "dark",
  className,
}: {
  variant?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0",
        variant === "dark" ? "bg-grid-dark" : "bg-grid",
        className,
      )}
    />
  );
}
