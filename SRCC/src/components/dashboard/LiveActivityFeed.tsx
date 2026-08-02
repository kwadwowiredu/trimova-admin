"use client";

import { useRef, useState } from "react";
import {
  CalendarCheck,
  UserPlus,
  Wallet,
  Star,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, timeAgo } from "@/lib/format";
import { useInterval } from "@/hooks/useInterval";
import type { ActivityEvent } from "@/types";

const ICONS: Record<ActivityEvent["type"], LucideIcon> = {
  booking: CalendarCheck,
  registration: UserPlus,
  payout: Wallet,
  review: Star,
};

/** Pool of synthetic events used to simulate the real-time stream. */
const SAMPLE: Omit<ActivityEvent, "id" | "created_at">[] = [
  { type: "booking", actor_name: "Yaw Boateng", description: "booked Fresh Cuts", amount: 120 },
  { type: "registration", actor_name: "Linda Mensah", description: "joined as a Client" },
  { type: "payout", actor_name: "The Grooming Hub", description: "Payout processed", amount: 1850 },
  { type: "booking", actor_name: "Kojo Antwi", description: "booked Sharp Lines", amount: 95 },
  { type: "review", actor_name: "Esi Asante", description: "left a 5-star review for Urban Fades" },
];

interface LiveActivityFeedProps {
  initialEvents: ActivityEvent[];
}

export function LiveActivityFeed({ initialEvents }: LiveActivityFeedProps) {
  const [events, setEvents] = useState<ActivityEvent[]>(initialEvents);
  const counter = useRef(0);

  // Simulated realtime: prepend a new event every 8s. Replace this with a
  // Supabase realtime subscription / SSE / websocket against the live backend.
  useInterval(() => {
    const sample = SAMPLE[counter.current % SAMPLE.length];
    counter.current += 1;
    const next: ActivityEvent = {
      ...sample,
      id: `live-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setEvents((prev) => [next, ...prev].slice(0, 12));
  }, 8000);

  return (
    <Card className="flex h-full flex-col p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Live Activity</h2>
        <Badge tone="success">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
          Live
        </Badge>
      </div>

      <ul className="scroll-thin -mr-2 max-h-80 space-y-1 overflow-y-auto pr-2">
        {events.map((event) => {
          const Icon = ICONS[event.type];
          return (
            <li
              key={event.id}
              className="flex animate-fade-in items-start gap-3 rounded-btn px-2 py-2.5 hover:bg-surface-alt"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-soft text-accent">
                <Icon size={15} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-text">
                  <span className="font-semibold">{event.actor_name}</span>{" "}
                  {event.description}
                </p>
                <p className="text-xs text-text-faint">
                  {timeAgo(event.created_at)}
                  {typeof event.amount === "number" &&
                    ` · ${formatCurrency(event.amount)}`}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
