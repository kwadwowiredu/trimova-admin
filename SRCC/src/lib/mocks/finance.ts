import type { FinancePipeline, Transaction, TransactionStatus } from "@/types";

const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();

/** Top-of-page summary powering the three pipeline cards. */
export const MOCK_PIPELINE: FinancePipeline = {
  funds_held: 4_280_000,
  transfers_total: 2_145_500,
  refunds_total: 124_000,
  transfers_success_today: 840,
  refunds_pending: 15,
};

/** Total the backend reports for the log footer ("Showing N of TOTAL"). */
export const MOCK_TRANSACTION_TOTAL = 2_450;

const NAMES: [string, string, string][] = [
  ["Adekunle Musa", "musa.a@example.com", "success"],
  ["Janet Okafor", "janet@okafor.dev", "failed"],
  ["Samuel Taiwo", "samuel@taiwo.io", "pending"],
  ["Chinua Nduka", "c.nduka@fintech.co", "success"],
  ["Kwame Mensah", "kwame.m@example.com", "success"],
  ["Abena Boateng", "abena.b@example.com", "pending"],
  ["Daniel Owusu", "d.owusu@example.com", "success"],
  ["Esi Asante", "esi.asante@example.com", "failed"],
  ["Yaw Boateng", "yaw.b@example.com", "success"],
  ["Linda Mensah", "linda@example.com", "success"],
  ["Kojo Antwi", "kojo.antwi@example.com", "pending"],
  ["Sarah Adjei", "s.adjei@example.com", "success"],
];

const REFERENCE_PREFIXES = ["T", "P", "H", "K"];
const AMOUNTS = [45_000, 120_500, 12_000, 550_000, 8_750, 96_200, 33_400, 210_000];
const TYPES: Transaction["type"][] = [
  "deposit",
  "transfer",
  "refund",
  "commission",
];

/**
 * Deterministic transaction log so server and client renders agree. The first
 * four rows intentionally mirror the reference design's sample data.
 */
export const MOCK_TRANSACTIONS: Transaction[] = NAMES.map(
  ([name, email, status], i) => ({
    id: `txn-${i + 1}`,
    reference: `${REFERENCE_PREFIXES[i % REFERENCE_PREFIXES.length]}${(
      729304122 + i * 137_211
    ).toString()}${String.fromCharCode(65 + ((i * 7) % 26))}`,
    client_id: `TR-${9921 - i * 213}`,
    user_name: name,
    user_email: email,
    amount: AMOUNTS[i % AMOUNTS.length],
    type: TYPES[i % TYPES.length],
    status: status as TransactionStatus,
    created_at: hoursAgo(2 + i * 5),
  }),
);
