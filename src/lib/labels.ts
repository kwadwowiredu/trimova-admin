import type { BookingStatus, PaymentStatus, UserRole, UserStatus } from "@/types";

/** Roles that count as a barber for the [Barbers] tab and payout tables. */
export const BARBER_ROLES: readonly UserRole[] = ["barber", "staff_barber"];

/** Human labels for the role pill in the table. */
export const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  barber: "Barber",
  staff_barber: "Staff Barber",
  admin: "Admin",
};

/** Human labels for the status pill in the table. */
export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  suspended: "Suspended",
};

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  declined: "Declined",
};

/**
 * "Paid" means Trimova is holding the money. Whether it has since gone to the
 * barber is the booking's `released_at`, not a separate payment status.
 */
export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  unpaid: "Unpaid",
  paid: "Held in escrow",
  refunded: "Refunded",
};
