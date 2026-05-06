import { cn } from "@/lib/utils";
import * as React from "react";

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "block w-full rounded-md border bg-white px-3 py-2 text-sm shadow-sm focus:border-[color:var(--color-accent)]",
          className,
        )}
        {...props}
      />
    );
  },
);
