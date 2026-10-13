import type {
  HTMLAttributes,
  TdHTMLAttributes,
  ThHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

/**
 * Thin styled wrappers over native table elements so the Users directory and
 * the Finance transaction log share one visual language. `Table` is always
 * wrapped in a horizontally scrollable container so wide tables never force the
 * page itself to scroll sideways on tablet/mobile.
 */

export function TableWrapper({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("scroll-thin w-full overflow-x-auto", className)} {...props} />
  );
}

export function Table({
  className,
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <table
      className={cn("w-full min-w-[44rem] border-collapse text-left", className)}
      {...props}
    />
  );
}

interface TableHeadProps extends HTMLAttributes<HTMLTableSectionElement> {
  /** `accent` matches the Finance log's tinted header row. */
  tone?: "muted" | "accent";
}

export function TableHead({ tone = "muted", className, ...props }: TableHeadProps) {
  return (
    <thead
      className={cn(
        "border-b border-border",
        tone === "accent" ? "bg-accent-soft/40" : "bg-surface-alt/60",
        className,
      )}
      {...props}
    />
  );
}

export function TableHeaderCell({
  className,
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={cn(
        "px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn("divide-y divide-border", className)} {...props} />;
}

export function TableRow({
  className,
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr className={cn("transition-colors hover:bg-surface-alt/50", className)} {...props} />
  );
}

export function TableCell({
  className,
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("px-5 py-3.5 align-middle text-sm", className)} {...props} />;
}

interface TableEmptyProps {
  colSpan: number;
  message: string;
}

export function TableEmpty({ colSpan, message }: TableEmptyProps) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-14 text-center text-sm text-text-muted"
      >
        {message}
      </td>
    </tr>
  );
}
