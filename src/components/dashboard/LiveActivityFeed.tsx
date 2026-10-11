"use client";

import { useState } from "react";
import {
  CalendarCheck,
  UserPlus,
  Wallet,
  Star,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { BookingDrawer } from "@/components/bookings/BookingDrawer";
import { api } from "@/lib/api";
import { formatCurrency, timeAgo } from "@/lib/format";
import { useInterval } from "@/hooks/useInterval";
import type { ActivityEvent } from "@/types";

const ICONS: Record<ActivityEvent["type"], LucideIcon> = {
  booking: CalendarCheck,
  registration: UserPlus,
  payout: Wallet,
  review: Star,
};

interface LiveActivityFeedProps {
  initialEvents: ActivityEvent[];
}

/**
 * Real-time platform activity, polled from the API.
 *
 * Rows tied to a booking are clickable: an admin shouldn't have to guess what
 * "Kojo paid for a booking" means — one click opens the full appointment,
 * both parties and the money trail included.
 */
export function LiveActivityFeed({ initialEvents }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const [openBookingId, setOpenBookingId] = useState<string | null>(null);
  const [stale, setStale] = useState(false);

  useInterval(async () => {
    try {
      const { data } = await api.get<ActivityEvent[]>("/admin/activity");
      setEvents(data);
      setStale(false);
    } catch {
      // A dropped poll shouldn't blank the feed — keep the last good data and
      // say so, rather than pretending it's still live.
      setStale(true);
    }
  }, 15000);

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Live Activity</h2>
        <Badge tone={stale ? "warning" : "success"}>
          {!stale && (
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          )}
          {stale ? "Reconnecting" : "Live"}
        </Badge>
      </div>

      {events.length === 0 ? (
        <p className="py-12 text-center text-sm text-text-muted">
          Nothing has happened on the platform yet.
        </p>
      ) : (
        <ul className="scroll-thin -mr-2 max-h-80 space-y-1 overflow-y-auto pr-2">
          {events.map((event) => {
            const Icon = ICONS[event.type];
            const clickable = Boolean(event.booking_id);

            const body = (
              <>
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm text-text">
                    <span className="font-semibold">{event.actor_name}</span>{" "}
                    {event.description}
                  </span>
                  <span className="block text-xs text-text-faint">
                    {timeAgo(event.created_at)}
                    {typeof event.amount === "number" &&
                      ` · ${formatCurrency(event.amount)}`}
                  </span>
                </span>
                {clickable && (
                  <ChevronRight size={15} className="mt-2 shrink-0 text-text-muted" />
                )}
              </>
            );

            return (
              <li key={event.id} className="animate-fade-in">
                {clickable ? (
                  <button
                    type="button"
                    onClick={() => setOpenBookingId(event.booking_id!)}
                    className="flex w-full items-start gap-3 rounded-btn px-2 py-2.5 text-left hover:bg-surface-alt"
                  >
                    {body}
                  </button>
                ) : (
                  <div className="flex items-start gap-3 rounded-btn px-2 py-2.5">
                    {body}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <BookingDrawer
        bookingId={openBookingId}
        onClose={() => setOpenBookingId(null)}
      />
    </Card>
  );
}
