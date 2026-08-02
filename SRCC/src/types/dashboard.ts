import type { ActivityEvent } from "./booking";
import type { SuspiciousFlag } from "./finance";

/** The 5 KPI cards on the Platform Health dashboard. */
export interface DashboardKpis {
  total_users: number;
  active_barbers: number;
  live_booking_volume: number;
  commission_revenue: number; // GHS major units
  escrow_balance: number; // GHS major units
}

/** One point on the booking-velocity / revenue trend charts. */
export interface TrendPoint {
  date: string; // "Jun 30" label
  bookings: number;
  revenue: number; // GHS major units
}

export type TrendRange = "30d" | "90d" | "1y";

/** Aggregated payload powering the whole dashboard in one fetch. */
export interface DashboardSnapshot {
  kpis: DashboardKpis;
  trend: TrendPoint[];
  activity: ActivityEvent[];
  flags: SuspiciousFlag[];
}
