"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  /** Max numbered buttons rendered before the window starts sliding. */
  maxButtons?: number;
}

/** Build a sliding window of page numbers centred on the current page. */
function pageWindow(page: number, pageCount: number, max: number): number[] {
  if (pageCount <= max) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }
  const half = Math.floor(max / 2);
  const start = Math.min(Math.max(page - half, 1), pageCount - max + 1);
  return Array.from({ length: max }, (_, i) => start + i);
}

/** Prev / numbered / next control used under the transaction log. */
export function Pagination({
  page,
  pageCount,
  onChange,
  maxButtons = 3,
}: PaginationProps) {
  if (pageCount <= 1) return null;

  const pages = pageWindow(page, pageCount, maxButtons);
  const arrowClass =
    "flex h-8 w-8 items-center justify-center rounded-btn border border-border bg-surface text-text-muted transition-colors hover:bg-surface-alt disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className={arrowClass}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((n) => (
        <button
          key={n}
          type="button"
          aria-label={`Page ${n}`}
          aria-current={n === page ? "page" : undefined}
          onClick={() => onChange(n)}
          className={cn(
            "h-8 w-8 rounded-btn border text-sm font-medium transition-colors",
            n === page
              ? "border-accent bg-accent text-white"
              : "border-border bg-surface text-text hover:bg-surface-alt",
          )}
        >
          {n}
        </button>
      ))}

      <button
        type="button"
        aria-label="Next page"
        disabled={page === pageCount}
        onClick={() => onChange(page + 1)}
        className={arrowClass}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
