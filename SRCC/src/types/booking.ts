import type { ID, ISODateString } from "./common";

/** Booking lifecycle as defined by the backend `appointments.status`. */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "no_show";

/** Escrow/payment state held by Trimova until completion. */
export type PaymentStatus =
  | "unpaid"
  | "held_in_escrow"
  | "released"
  | "refunded"
  | "partially_refunded";

/**
 * Appointment/booking record. Matches the unified `appointments` table used by
 * both the barbershop and mobile-barber flows on the mobile backend.
 */
export interface Booking {
  appointment_id: ID;
  client_id: ID;
  barber_id: ID;
  shop_id: ID | null; // null for mobile/freelance bookings
  service_name: string;
  status: BookingStatus;
  payment_status: PaymentStatus;
  amount: number; // GHS major units for display convenience
  start_time: ISODateString;
  end_time: ISODateString;
  created_at: ISODateString;
}

/** Denormalised row for the live activity feed. */
export interface ActivityEvent {
  id: ID;
  type: "registration" | "booking" | "payout" | "review";
  actor_name: string;
  description: string;
  amount?: number;
  created_at: ISODateString;
}
