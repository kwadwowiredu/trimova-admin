import { CURRENCY } from "@/types";

/** Format a GHS amount, e.g. formatCurrency(84200) -> "GHS 84,200". */
export function formatCurrency(
  amount: number,
  opts: { compact?: boolean; withSymbol?: boolean } = {},
): string {
  const { compact = false, withSymbol = true } = opts;
  const formatted = new Intl.NumberFormat("en-GH", {
    notation: compact ? "compact" : "standard",
    maximumFractionDigits: compact ? 1 : 2,
    minimumFractionDigits: compact ? 0 : 0,
  }).format(amount);
  return withSymbol ? `${CURRENCY} ${formatted}` : formatted;
}

/**
 * Cedi-symbol variant used across the finance screen.
 *   formatCedi(4280000)                  -> "₵4,280,000"
 *   formatCedi(45000, { decimals: true }) -> "₵45,000.00"
 *
 * Pipeline cards use the whole-number form; the transaction log shows exact
 * pesewas, so it passes `decimals`.
 */
export function formatCedi(
  amount: number,
  opts: { decimals?: boolean } = {},
): string {
  const fractionDigits = opts.decimals ? 2 : 0;
  return `₵${new Intl.NumberFormat("en-GH", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(amount)}`;
}

/** Relative time, e.g. "2 minutes ago". */
export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const seconds = Math.floor((Date.now() - then) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

/** Clock time, e.g. "12:15 PM". */
export function formatClock(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-GH", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Join date, e.g. "Oct 12, 2023".
 *
 * Uses en-US rather than en-GH deliberately: the admin panel's tables are
 * specced month-first, while en-GH renders day-first ("12 Oct 2023").
 */
export function formatJoinDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}
