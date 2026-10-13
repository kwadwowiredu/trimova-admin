"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/cn";

export interface MenuAction {
  label: string;
  onSelect: () => void;
  icon?: ReactNode;
  tone?: "default" | "danger";
}

interface DropdownMenuProps {
  actions: MenuAction[];
  label?: string;
  align?: "left" | "right";
}

/**
 * Kebab (⋮) action menu used in the Users table row "Actions" column.
 * Closes on outside click, Escape, or after an action is selected.
 */
export function DropdownMenu({
  actions,
  label = "Row actions",
  align = "right",
}: DropdownMenuProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-btn p-1.5 text-text-muted transition-colors hover:bg-surface-alt hover:text-text"
      >
        <MoreVertical size={18} />
      </button>

      {open && (
        <div
          role="menu"
          className={cn(
            "absolute z-30 mt-1 min-w-[10rem] animate-fade-in overflow-hidden",
            "rounded-card border border-border bg-surface py-1 shadow-drawer",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {actions.map((action) => (
            <button
              key={action.label}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                action.onSelect();
              }}
              className={cn(
                "flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors",
                action.tone === "danger"
                  ? "text-danger hover:bg-danger/10"
                  : "text-text hover:bg-surface-alt",
              )}
            >
              {action.icon}
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
