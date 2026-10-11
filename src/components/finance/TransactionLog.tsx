"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Search, SlidersHorizontal, Check } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Pagination } from "@/components/ui/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from "@/components/ui/Table";
import { cn } from "@/lib/cn";
import { formatCedi, formatJoinDate } from "@/lib/format";
import {
  financeService,
  TRANSACTIONS_PAGE_SIZE,
  type TransactionPage,
} from "@/lib/services/finance";
import type { Transaction, TransactionStatus } from "@/types";

type StatusFilter = TransactionStatus | "all";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "success", label: "Success" },
  { value: "pending", label: "Pending" },
  { value: "failed", label: "Failed" },
];

const STATUS_TONES: Record<TransactionStatus, "success" | "warning" | "danger"> = {
  success: "success",
  pending: "warning",
  failed: "danger",
};

const STATUS_DOTS: Record<TransactionStatus, string> = {
  success: "bg-success",
  pending: "bg-text-muted",
  failed: "bg-danger",
};

function StatusPill({ status }: { status: TransactionStatus }) {
  return (
    <Badge tone={STATUS_TONES[status]} className="capitalize">
      <span className={cn("h-1.5 w-1.5 rounded-full", STATUS_DOTS[status])} />
      {status}
    </Badge>
  );
}

/** "Oct 24, 2023 • 14:22" — the two-part timestamp used in the log. */
function formatTimestamp(iso: string): string {
  const time = new Date(iso).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${formatJoinDate(iso)} • ${time}`;
}

/** Status filter popover behind the "Filter" button. */
function FilterMenu({
  value,
  onChange,
}: {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}) {
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
    <div ref={containerRef} className="relative">
      <Button
        variant="outline"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        <SlidersHorizontal size={15} />
        Filter
      </Button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-[11rem] animate-fade-in overflow-hidden rounded-card border border-border bg-surface py-1 shadow-drawer"
        >
          {STATUS_FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="menuitemradio"
              aria-checked={option.value === value}
              onClick={() => {
                onChange(option.value);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm text-text transition-colors hover:bg-surface-alt"
            >
              {option.label}
              {option.value === value && (
                <Check size={15} className="text-accent" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface TransactionLogProps {
  initialPage: TransactionPage;
}

/**
 * Global transaction log: searchable, status-filterable, paginated table with
 * the Process Refund action. Refunds resolve optimistically client-side — the
 * service call is a no-op until the Paystack endpoints are live.
 */
export function TransactionLog({ initialPage }: TransactionLogProps) {
  const [result, setResult] = useState<TransactionPage>(initialPage);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [refunded, setRefunded] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const isFirstRender = useRef(true);

  // Refetch whenever the query changes; the server-rendered first page is
  // already in state, so the initial mount is skipped.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    let active = true;
    startTransition(async () => {
      const next = await financeService.getTransactions({
        page,
        search,
        status,
      });
      if (active) setResult(next);
    });

    return () => {
      active = false;
    };
  }, [page, search, status]);

  const pageCount = Math.max(
    Math.ceil(result.total / (result.page_size || TRANSACTIONS_PAGE_SIZE)),
    1,
  );

  const showingRange = useMemo(() => {
    if (result.items.length === 0) return "No transactions";
    return `Showing ${result.items.length} of ${result.corpus_total.toLocaleString("en-GH")} transactions`;
  }, [result]);

  const handleRefund = (txn: Transaction) => {
    setRefunded((prev) => new Set(prev).add(txn.id));
    void financeService.processRefund(txn.id);
  };

  /** Reset to page 1 whenever the query narrows. */
  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };
  const handleStatus = (value: StatusFilter) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <Card className="overflow-hidden">
      <div className="flex flex-col gap-4 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-base font-semibold text-text">
            Global Transaction Log
          </h2>
          <p className="text-xs text-text-muted">
            Comprehensive history of inbound and outbound flows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Input
            type="search"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search Ref..."
            aria-label="Search transactions"
            icon={<Search size={15} />}
            className="w-full sm:w-56"
          />
          <FilterMenu value={status} onChange={handleStatus} />
        </div>
      </div>

      <TableWrapper className={cn("transition-opacity", isPending && "opacity-50")}>
        <Table>
          <TableHead tone="accent">
            <tr>
              <TableHeaderCell>Reference</TableHeaderCell>
              <TableHeaderCell>User / Client</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Timestamp</TableHeaderCell>
              <TableHeaderCell className="text-right">Actions</TableHeaderCell>
            </tr>
          </TableHead>

          <TableBody>
            {result.items.length === 0 ? (
              <TableEmpty
                colSpan={6}
                message="No transactions match this search or filter."
              />
            ) : (
              result.items.map((txn) => {
                const isRefunded = refunded.has(txn.id);
                const canRefund = txn.status !== "failed" && !isRefunded;

                return (
                  <TableRow key={txn.id}>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-accent">
                      {txn.reference}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={txn.user_name}
                          size={34}
                          className="bg-accent-soft text-accent"
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-text">
                            {txn.user_name}
                          </p>
                          <p className="truncate text-xs text-text-muted">
                            {txn.user_email}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-base font-bold text-text">
                      {formatCedi(txn.amount, { decimals: true })}
                    </TableCell>

                    <TableCell>
                      <StatusPill status={txn.status} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-text-muted">
                      {formatTimestamp(txn.created_at)}
                    </TableCell>

                    <TableCell className="text-right">
                      {canRefund ? (
                        <Button size="sm" onClick={() => handleRefund(txn)}>
                          Process Refund
                        </Button>
                      ) : (
                        <Button size="sm" variant="ghost" disabled>
                          {isRefunded ? "Refund Queued" : "No Action"}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableWrapper>

      <div className="flex flex-col items-center justify-between gap-3 border-t border-border px-5 py-4 sm:flex-row">
        <p className="text-sm text-text-muted">{showingRange}</p>
        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>
    </Card>
  );
}
