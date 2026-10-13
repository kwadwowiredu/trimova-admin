"use client";

import { cn } from "@/lib/cn";

export interface TabItem<T extends string> {
  value: T;
  label: string;
}

interface TabsProps<T extends string> {
  items: readonly TabItem<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}

/**
 * Segmented pill control used by the Users directory (All / Clients / Barbers)
 * and any future filtered table. The active pill sits on a white surface inside
 * a soft accent track, matching the reference design.
 */
export function Tabs<T extends string>({
  items,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={cn(
        "inline-flex w-full gap-1 rounded-btn bg-accent-soft/50 p-1 sm:w-auto",
        className,
      )}
    >
      {items.map((item) => {
        const active = item.value === value;
        return (
          <button
            key={item.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.value)}
            className={cn(
              "flex-1 whitespace-nowrap rounded-[6px] px-4 py-1.5 text-sm font-medium transition-colors sm:flex-none",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40",
              active
                ? "bg-surface text-accent shadow-card"
                : "text-text-muted hover:text-text",
            )}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
