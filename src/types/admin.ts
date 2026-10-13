import type { ID, ISODateString } from "./common";
import type { UserRole } from "./user";

// ─── Security ────────────────────────────────────────────────────────────────

export type FlagKind = "high_cancellation" | "client_no_show" | "collusion";
export type FlagSeverity = "low" | "medium" | "high";
export type FlagStatus = "pending" | "cleared" | "action_taken";

/**
 * A pattern the detector thought worth a second look. Never a verdict — the
 * evidence is attached so a moderator can check the working before acting.
 */
export interface SuspiciousFlagRow {
  id: ID;
  kind: FlagKind;
  severity: FlagSeverity;
  reason: string;
  evidence: Record<string, unknown>;
  status: FlagStatus;
  resolution_note: string | null;
  resolved_at: ISODateString | null;
  created_at: ISODateString;
  subject_id: ID;
  subject_name: string;
  subject_role: UserRole;
  /** Present on collusion flags — the barber on the other side of the pair. */
  counterpart_id: ID | null;
  counterpart_name: string | null;
}

export interface FlagsPage {
  items: SuspiciousFlagRow[];
  total: number;
  counts: Record<FlagStatus, number>;
}

// ─── Moderation ──────────────────────────────────────────────────────────────

export interface ModerationReview {
  id: ID;
  rating: number;
  comment: string;
  author_name: string;
  author_id: ID;
  author_avatar_url: string | null;
  /** The barber the review is about. */
  about_name: string;
  about_id: ID;
  reported_at: ISODateString | null;
  report_reason: string | null;
  hidden_at: ISODateString | null;
  hidden_reason: string | null;
  created_at: ISODateString;
}

export interface ReviewsPage {
  items: ModerationReview[];
  total: number;
  counts: { reported: number; hidden: number };
}

export type ModerationAction = "dismiss" | "remove" | "restore" | "warn";

// ─── Settings ────────────────────────────────────────────────────────────────

export interface CommissionTier {
  id: ID;
  name: string;
  /** Completed bookings needed to reach this tier. */
  booking_threshold: number;
  /** Percentage Trimova keeps at this tier. */
  commission_rate: number;
}

export interface PlatformSettings {
  commission_percent: number;
  /** Hours after an appointment before escrow releases on its own. */
  confirmation_window_hours: number;
  free_cancel_hours: number;
  half_fee_hours: number;
  /** How long a mobile barber has to answer a request. */
  request_expiry_minutes: number;
  tier_window_days: number;
  tiers: CommissionTier[];
}

// ─── Notifications ───────────────────────────────────────────────────────────

export interface AdminNotification {
  id: ID;
  type: string;
  title: string;
  body: string;
  booking_id: ID | null;
  read_at: ISODateString | null;
  created_at: ISODateString;
  recipient_name: string;
  recipient_role: UserRole | null;
}

export interface Announcement {
  id: ID;
  audience: string;
  title: string;
  body: string;
  recipients: number;
  created_at: ISODateString;
}

export interface NotificationsPage {
  items: AdminNotification[];
  total: number;
  announcements: Announcement[];
}

export type AnnouncementAudience = "all" | "client" | "barber" | "staff_barber" | "user";
