import type { HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

/** Flat white surface card matching the Trimova dashboard aesthetic. */
export function Card({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-card border border-border bg-surface shadow-card",
        className,
      )}
      {...props}
    />
  );
}
