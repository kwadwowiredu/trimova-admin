import type {
  DashboardSnapshot,
  TrendPoint,
  TrendRange,
  ActivityEvent,
  SuspiciousFlag,
} from "@/types";

const minutesAgo = (m: number) => new Date(Date.now() - m * 60_000).toISOString();
const todayAt = (h: number, min: number) => {
  const d = new Date();
  d.setHours(h, min, 0, 0);
  return d.toISOString();
};

/** Deterministic pseudo-random so SSR and client renders match. */
function seeded(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

/** Build a trend series of N days for the velocity + revenue charts. */
export function buildTrend(range: TrendRange): TrendPoint[] {
  const days = range === "30d" ? 30 : range === "90d" ? 90 : 365;
  const step = range === "1y" ? 30 : range === "90d" ? 3 : 1;
  const rand = seeded(days);
  const points: TrendPoint[] = [];
  for (let i = days; i >= 0; i -= step) {
    const date = new Date(Date.now() - i * 86_400_000);
    const base = 70 + Math.sin(i / 4) * 25 + rand() * 40;
    const bookings = Math.round(base);
    points.push({
      date: date.toLocaleDateString("en-GH", { month: "short", day: "numeric" }),
      bookings,
      revenue: Math.round(bookings * (60 + rand() * 40)),
    });
  }
  return points;
}

export const MOCK_ACTIVITY: ActivityEvent[] = [
  {
    id: "act-1",
    type: "booking",
    actor_name: "Kwame Mensah",
    description: "booked The Grooming Hub",
    amount: 150,
    created_at: minutesAgo(2),
  },
  {
    id: "act-2",
    type: "registration",
    actor_name: "Sarah Adjei",
    description: "joined as a Barber · Pending verification",
    created_at: minutesAgo(15),
  },
  {
    id: "act-3",
    type: "payout",
    actor_name: "Urban Fades",
    description: "Payout processed",
    amount: 2400,
    created_at: minutesAgo(42),
  },
  {
    id: "act-4",
    type: "booking",
    actor_name: "Abena Boateng",
    description: "booked Luxury Cuts",
    amount: 85,
    created_at: minutesAgo(60),
  },
  {
    id: "act-5",
    type: "review",
    actor_name: "Daniel Owusu",
    description: "left a 5-star review for Sharp Cuts",
    created_at: minutesAgo(95),
  },
];

export const MOCK_FLAGS: SuspiciousFlag[] = [
  {
    id: "flag-1",
    subject_name: "K. Osei",
    subject_role: "client",
    reason:
      "Multiple failed card attempts (8) from IP 192.168.1.1 on user K. Osei",
    severity: "high",
    status: "pending",
    created_at: todayAt(12, 15),
  },
  {
    id: "flag-2",
    subject_name: "Elite Cuts",
    subject_role: "barber",
    reason:
      'Barber "Elite Cuts" reported a review for harassment and hate speech. Manual audit required.',
    severity: "medium",
    status: "pending",
    created_at: todayAt(10, 40),
  },
];

export function buildDashboardSnapshot(range: TrendRange = "30d"): DashboardSnapshot {
  return {
    kpis: {
      total_users: 12_482,
      active_barbers: 843,
      live_booking_volume: 3_120,
      commission_revenue: 84_200,
      escrow_balance: 42_100,
    },
    trend: buildTrend(range),
    activity: MOCK_ACTIVITY,
    flags: MOCK_FLAGS,
  };
}
