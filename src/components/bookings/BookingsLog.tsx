"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Search, Store, Car } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
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
import { Pagination } from "@/components/ui/Pagination";
import { BookingDrawer } from "./BookingDrawer";
import { bookingsService, BOOKINGS_PAGE_SIZE } from "@/lib/services/bookings";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/labels";
import { formatCedi, formatJoinDate, formatClock } from "@/lib/format";
import type { AdminBooking, BookingStatus, Paginated } from "@/types";

const STATUS_TABS: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Live", value: "pending,confirmed,in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Cancelled", value: "cancelled,declined" },
];

export function statusTone(status: BookingStatus) {
  switch (status) {
    case "completed":
      return "success" as const;
    case "confirmed":
      return "accent" as const;
    case "in_progress":
      return "accent" as const;
    case "pending":
      return "warning" as const;
    default:
      return "danger" as const;
  }
}

/**
 * Every appointment on the platform.
 *
 * The dashboard's activity feed says a booking happened; this is where an
 * admin finds out what actually happened — who booked whom, what they were
 * charged, and where the money sits right now.
 */
export function BookingsLog({ initialPage }: { initialPage: Paginated<AdminBooking> }) {
  const [page, setPage] = useState(initialPage);
  const [pageNum, setPageNum] = useState(1);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback(
    (nextPage: number, nextStatus: string, nextSearch: string) => {
      startTransition(async () => {
        const data = await bookingsService.list({
          page: nextPage,
          status: nextStatus,
          search: nextSearch,
        });
        setPage(data);
      });
    },
    [],
  );

  // Debounce the search so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageNum(1);
      load(1, status, search);
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  function changeStatus(next: string) {
    setStatus(next);
    setPageNum(1);
    load(1, next, search);
  }

  function changePage(next: number) {
    setPageNum(next);
    load(next, status, search);
  }

  const pageCount = Math.max(1, Math.ceil(page.total / BOOKINGS_PAGE_SIZE));

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="flex flex-wrap gap-1.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => changeStatus(tab.value)}
              className={
                status === tab.value
                  ? "rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full px-3.5 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-alt"
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <Input
            icon={<Search size={15} />}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ref, client, barber, service…"
          />
        </div>
      </div>

      <TableWrapper>
        <Table>
          <TableHead tone="accent">
            <tr>
              <TableHeaderCell>Ref</TableHeaderCell>
              <TableHeaderCell>Client</TableHeaderCell>
              <TableHeaderCell>Barber</TableHeaderCell>
              <TableHeaderCell>Service</TableHeaderCell>
              <TableHeaderCell>When</TableHeaderCell>
              <TableHeaderCell>Amount</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Payment</TableHeaderCell>
            </tr>
          </TableHead>
          <TableBody>
            {page.items.length === 0 ? (
              <TableEmpty colSpan={8} message="No bookings match this view." />
            ) : (
              page.items.map((booking) => (
                <TableRow
                  key={booking.id}
                  onClick={() => setSelected(booking)}
                  className="cursor-pointer"
                >
                  <TableCell className="whitespace-nowrap font-mono text-xs text-text-muted">
                    {booking.short_ref}
                  </TableCell>
                  <TableCell className="font-medium text-text">
                    {booking.client?.full_name ?? "—"}
                  </TableCell>
                  <TableCell className="text-text-muted">
                    <span className="flex items-center gap-1.5">
                      {booking.client_address ? (
                        <Car size={13} className="shrink-0" />
                      ) : (
                        <Store size={13} className="shrink-0" />
                      )}
                      {/* The staff member did the work, under the shop's name. */}
                      {booking.staff?.full_name ?? booking.barber?.full_name ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell className="text-text-muted">{booking.service_name}</TableCell>
                  <TableCell className="whitespace-nowrap text-text-muted">
                    {formatJoinDate(booking.scheduled_at)}
                    <span className="ml-1.5 text-xs">
                      {formatClock(booking.scheduled_at)}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-nowrap font-semibold text-text">
                    {formatCedi(booking.amount, { decimals: true })}
                  </TableCell>
                  <TableCell>
                    <Badge tone={statusTone(booking.status)}>
                      {BOOKING_STATUS_LABELS[booking.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      tone={
                        booking.payment_status === "paid"
                          ? booking.released_at
                            ? "success"
                            : "warning"
                          : booking.payment_status === "refunded"
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {/* Escrow ends at release, so say which side of it we're on. */}
                      {booking.payment_status === "paid" && booking.released_at
                        ? "Released"
                        : PAYMENT_STATUS_LABELS[booking.payment_status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableWrapper>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5">
        <p className="text-xs text-text-muted">
          {isPending ? "Loading…" : `${page.total} booking${page.total === 1 ? "" : "s"}`}
        </p>
        <Pagination page={pageNum} pageCount={pageCount} onChange={changePage} />
      </div>

      <BookingDrawer
        bookingId={selected?.id ?? null}
        onClose={() => setSelected(null)}
      />
    </Card>
  );
}
