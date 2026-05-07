import { cn } from "@/lib/utils";
import * as React from "react";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "block w-full rounded-md border border-[color:var(--color-border)] bg-white px-3 py-2 text-sm shadow-sm outline-none transition-[box-shadow,border-color] duration-180 placeholder:text-[color:var(--color-subtle)] focus:border-[color:var(--color-accent)] focus:shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-accent)_22%,transparent)] focus:outline-none",
        className,
      )}
      {...props}
    />
  );
});
