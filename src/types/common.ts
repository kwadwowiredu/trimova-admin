/**
 * Shared primitives. These mirror the unified backend models consumed by the
 * React Native client — keep field names in snake_case to match the database.
 */

/** ISO-8601 timestamp string, e.g. "2026-06-30T14:22:00Z". */
export type ISODateString = string;

/** UUID/string primary keys as returned by Supabase/Postgres. */
export type ID = string;

/** Standard API envelope returned by the Express backend. */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/** Cursor/offset pagination wrapper. */
export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

/** Amounts are stored in the smallest currency unit (pesewas) on the backend. */
export type Pesewas = number;

export const CURRENCY = "GHS" as const;
