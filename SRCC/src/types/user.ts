import type { ID, ISODateString } from "./common";

/** Roles recognised by the backend `users.role` claim. */
export type UserRole = "client" | "barber" | "staff_barber" | "admin";

/** Account lifecycle state — drives the red "SUSPENDED" styling in the table. */
export type UserStatus = "active" | "inactive" | "pending" | "suspended";

/** Two operating modes for a barber profile. */
export type BarberType = "barbershop" | "mobile";

/**
 * Core user record. Matches the unified `users` table shared with the mobile
 * backend. Field names are snake_case on purpose.
 */
export interface User {
  id: ID;
  full_name: string;
  email: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  rating: number | null;
  created_at: ISODateString;
  updated_at: ISODateString;
}

/** A barber's portfolio/stats — belongs to the user, not the shop. */
export interface BarberProfile extends User {
  role: "barber" | "staff_barber";
  barber_type: BarberType;
  completed_bookings: number;
  completion_rate: number; // 0..1
  commission_tier: "starter" | "regular" | "pro";
  commission_rate: number; // percentage, e.g. 5
}

/** A single payout line shown in the barber detail sub-table. */
export interface PayoutRecord {
  id: ID;
  barber_id: ID;
  amount: number; // GHS major units for display convenience
  status: "paid" | "pending" | "failed";
  reference: string;
  created_at: ISODateString;
}

/** Authenticated admin session payload stored in the session cookie. */
export interface AdminSession {
  id: ID;
  full_name: string;
  email: string;
  role: "admin";
  avatar_url: string | null;
}
