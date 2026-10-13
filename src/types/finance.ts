import type { ID, ISODateString } from "./common";

export type TransactionStatus = "success" | "pending" | "failed";
export type TransactionType = "deposit" | "transfer" | "refund" | "commission";

/** A single line in the global Paystack transaction log. */
export interface Transaction {
  id: ID;
  reference: string;
  client_id: ID;
  user_name: string;
  user_email: string;
  amount: number; // GHS major units for display convenience
  type: TransactionType;
  status: TransactionStatus;
  created_at: ISODateString;
}

/** Top-of-page pipeline summary on the Finance screen. */
export interface FinancePipeline {
  funds_held: number;
  transfers_total: number;
  refunds_total: number;
  transfers_success_today: number;
  refunds_pending: number;
}

/** A suspicious-activity flag written by the background detection script. */
export interface SuspiciousFlag {
  id: ID;
  subject_name: string;
  subject_role: "client" | "barber";
  reason: string;
  severity: "low" | "medium" | "high";
  status: "pending" | "cleared" | "action_taken";
  created_at: ISODateString;
}
