"use client";

import { useEffect, useState } from "react";
import {
  Calendar, Clock, MapPin, Mail, Phone, Receipt, Car, Store, User as UserIcon,
} from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { bookingsService } from "@/lib/services/bookings";
import { BOOKING_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/labels";
import { formatCedi, formatClock, formatJoinDate } from "@/lib/format";
import { statusTone } from "./BookingsLog";
import type { AdminBookingDetail, BookingParty, BookingTransaction } from "@/types";

interface BookingDrawerProps {
  bookingId: string | null;
  onClose: () => void;
}

/**
 * The full record of one appointment: both parties, the schedule, the money
 * trail, and how it ended. This is what support needs when a client or barber
 * disputes what happened.
 */
export function BookingDrawer({ bookingId, onClose }: BookingDrawerProps) {
  const [booking, setBooking] = useState<AdminBookingDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setBooking(null);
      setError(null);
      return;
    }
    let cancelled = false;
    setBooking(null);
    setError(null);

    bookingsService
      .get(bookingId)
      .then((data) => {
        if (!cancelled) setBooking(data);
      })
      .catch((err: { message?: string }) => {
        if (!cancelled) setError(err?.message ?? "Couldn't load this booking.");
      });

    // A fast re-click shouldn't let a stale response overwrite the new one.
    return () => {
      cancelled = true;
    };
  }, [bookingId]);

  return (
    <Drawer
      open={bookingId !== null}
      onClose={onClose}
      title="Booking details"
      subtitle={booking ? `${booking.service_name} · ref ${booking.short_ref}` : undefined}
    >
      {error ? (
        <p className="py-10 text-center text-sm text-danger">{error}</p>
      ) : !booking ? (
        <p className="py-10 text-center text-sm text-text-muted">Loading…</p>
      ) : (
        <div className="space-y-6">
          {/* Status line */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={statusTone(booking.status)}>
              {BOOKING_STATUS_LABELS[booking.status]}
            </Badge>
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
              {booking.payment_status === "paid" && booking.released_at
                ? "Released to barber"
                : PAYMENT_STATUS_LABELS[booking.payment_status]}
            </Badge>
            <Badge tone="neutral">
              <span className="flex items-center gap-1">
                {booking.client_address ? <Car size={11} /> : <Store size={11} />}
                {booking.client_address ? "Mobile" : "In-shop"}
              </span>
            </Badge>
          </div>

          {/* Schedule */}
          <Section title="Appointment">
            <Row icon={<Calendar size={14} />} label="Date">
              {formatJoinDate(booking.scheduled_at)}
            </Row>
            <Row icon={<Clock size={14} />} label="Time">
              {formatClock(booking.scheduled_at)} – {formatClock(booking.ends_at)}
            </Row>
            {booking.client_address && (
              <Row icon={<MapPin size={14} />} label="Travelling to">
                {booking.client_address}
              </Row>
            )}
            {booking.notes && (
              <Row icon={<Receipt size={14} />} label="Client note">
                {booking.notes}
              </Row>
            )}
          </Section>

          {/* Both sides */}
          <Section title="Client">
            <Party party={booking.client} />
          </Section>

          <Section title={booking.staff ? "Shop" : "Barber"}>
            <Party party={booking.barber} />
            {booking.staff && (
              <p className="mt-2 text-xs text-text-muted">
                Performed by <span className="font-medium text-text">{booking.staff.full_name}</span>
              </p>
            )}
          </Section>

          {/* Money */}
          <Section title="Charges">
            <Line label={booking.service_name} value={formatCedi(booking.service_price, { decimals: true })} />
            {booking.travel_fee > 0 && (
              <Line label="Travel fee" value={formatCedi(booking.travel_fee, { decimals: true })} />
            )}
            <div className="mt-2 flex items-center justify-between border-t border-border pt-2">
              <span className="text-sm font-semibold text-text">Total</span>
              <span className="text-sm font-bold text-text">
                {formatCedi(booking.amount, { decimals: true })}
              </span>
            </div>
            {booking.payment_reference && (
              <p className="mt-2 break-all font-mono text-xs text-text-muted">
                {booking.payment_reference}
              </p>
            )}
          </Section>

          {/* Ledger — every movement tied to this booking */}
          <Section title="Transactions">
            {booking.transactions.length === 0 ? (
              <p className="text-sm text-text-muted">No money has moved yet.</p>
            ) : (
              <ul className="space-y-2">
                {booking.transactions.map((txn) => (
                  <TransactionRow key={txn.id} txn={txn} />
                ))}
              </ul>
            )}
          </Section>

          {/* How it ended */}
          {(booking.cancel_reason || booking.cancelled_at || booking.completed_at) && (
            <Section title="Outcome">
              {booking.completed_at && (
                <Row icon={<Clock size={14} />} label="Completed">
                  {formatJoinDate(booking.completed_at)} {formatClock(booking.completed_at)}
                </Row>
              )}
              {booking.cancelled_at && (
                <Row icon={<Clock size={14} />} label="Cancelled">
                  {formatJoinDate(booking.cancelled_at)} {formatClock(booking.cancelled_at)}
                </Row>
              )}
              {booking.cancel_reason && (
                <p className="mt-1 text-sm text-text-muted">{booking.cancel_reason}</p>
              )}
            </Section>
          )}
        </div>
      )}
    </Drawer>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h3>
      <div className="rounded-card border border-border bg-surface-alt/40 px-4 py-3.5">
        {children}
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 py-1">
      <span className="mt-0.5 shrink-0 text-text-muted">{icon}</span>
      <span className="w-28 shrink-0 text-sm text-text-muted">{label}</span>
      <span className="min-w-0 flex-1 text-sm text-text">{children}</span>
    </div>
  );
}

function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-0.5">
      <span className="text-sm text-text-muted">{label}</span>
      <span className="text-sm text-text">{value}</span>
    </div>
  );
}

function Party({ party }: { party: BookingParty | null }) {
  if (!party) {
    return <p className="text-sm text-text-muted">This account has been removed.</p>;
  }
  return (
    <div className="flex items-start gap-3">
      <Avatar name={party.full_name} src={party.avatar_url} size={38} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text">{party.full_name}</p>
        <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-text-muted">
          <Mail size={11} className="shrink-0" />
          {party.email}
        </p>
        {party.phone && (
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-text-muted">
            <Phone size={11} className="shrink-0" />
            {party.phone}
          </p>
        )}
      </div>
      <UserIcon size={14} className="mt-1 shrink-0 text-text-muted" />
    </div>
  );
}

function TransactionRow({ txn }: { txn: BookingTransaction }) {
  const tone =
    txn.status === "success" ? "success" : txn.status === "failed" ? "danger" : "warning";
  return (
    <li className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm capitalize text-text">{txn.type}</p>
        <p className="truncate font-mono text-[11px] text-text-muted">{txn.reference}</p>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-sm font-semibold text-text">
          {formatCedi(txn.amount, { decimals: true })}
        </span>
        <Badge tone={tone}>{txn.status}</Badge>
      </div>
    </li>
  );
}
