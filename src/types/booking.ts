import type { ID, ISODateString } from "./common";

/** Booking lifecycle, matching the `booking_status` enum in Postgres. */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "declined";

/**
 * Payment state, matching the `payment_status` enum in Postgres.
 *
 * Escrow isn't a separate status: "paid" means Trimova is holding the money,
 * and the booking's `released_at` timestamp says whether it has since been
 * handed to the barber.
 */
export type PaymentStatus = "unpaid" | "paid" | "refunded";

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

/** Either party on a booking, as the admin views render them. */
export interface BookingParty {
  id: ID;
  full_name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
}

/** A money movement attached to a booking. */
export interface BookingTransaction {
  id: ID;
  reference: string;
  amount: number;
  type: "deposit" | "transfer" | "refund" | "commission";
  status: "pending" | "success" | "failed";
  channel: string | null;
  created_at: ISODateString;
}

/**
 * An appointment as an admin sees it — both parties resolved, not just ids.
 * This is what turns "a booking happened" in the activity feed into something
 * support can actually act on.
 */
export interface AdminBooking {
  id: ID;
  /**
   * Short, quotable reference — the first block of the uuid. This is what
   * support reads out and what the search box accepts, so a caller can say
   * "booking 8f42c1a9" and be found.
   */
  short_ref: string;
  service_name: string;
  service_price: number;
  travel_fee: number;
  /** service_price + travel_fee — what the client was charged. */
  amount: number;
  status: BookingStatus;
  payment_status: PaymentStatus;
  payment_reference: string | null;
  requires_approval: boolean;
  scheduled_at: ISODateString;
  ends_at: ISODateString;
  approved_at: ISODateString | null;
  completed_at: ISODateString | null;
  cancelled_at: ISODateString | null;
  /** When escrow was released to the barber. */
  released_at: ISODateString | null;
  cancel_reason: string | null;
  /** Set for mobile bookings — where the barber travelled to. */
  client_address: string | null;
  notes: string | null;
  created_at: ISODateString;
  client: BookingParty | null;
  barber: BookingParty | null;
  /** The staff member who performed it, when it wasn't the owner. */
  staff: { id: ID; full_name: string; avatar_url: string | null } | null;
}

export interface AdminBookingDetail extends AdminBooking {
  transactions: BookingTransaction[];
}

/** Denormalised row for the live activity feed. */
export interface ActivityEvent {
  id: ID;
  type: "registration" | "booking" | "payout" | "review";
  actor_name: string;
  description: string;
  amount?: number;
  /** Set when the event came from a booking, so the row can open its detail. */
  booking_id?: ID | null;
  created_at: ISODateString;
}
