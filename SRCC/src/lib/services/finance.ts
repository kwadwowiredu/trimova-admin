import { api } from "@/lib/api";
import { USE_MOCKS } from "@/lib/constants";
import {
  MOCK_PIPELINE,
  MOCK_TRANSACTIONS,
  MOCK_TRANSACTION_TOTAL,
} from "@/lib/mocks/finance";
import type {
  FinancePipeline,
  Paginated,
  Transaction,
  TransactionStatus,
} from "@/types";

export const TRANSACTIONS_PAGE_SIZE = 4;

export interface TransactionQuery {
  page?: number;
  page_size?: number;
  search?: string;
  status?: TransactionStatus | "all";
}

/**
 * `total` counts the rows matching the current query (it drives pagination),
 * while `corpus_total` is the platform-wide transaction count shown in the
 * log footer — the two differ whenever a search or status filter is active.
 */
export interface TransactionPage extends Paginated<Transaction> {
  corpus_total: number;
}

/**
 * Finance data access for the Paystack pipeline screen. While mocks are on the
 * pagination/filtering happens in-memory; the real endpoints take the same
 * query shape so the UI is unchanged when NEXT_PUBLIC_USE_MOCKS flips to false.
 */
export const financeService = {
  async getPipeline(): Promise<FinancePipeline> {
    if (USE_MOCKS) return MOCK_PIPELINE;
    const { data } = await api.get<FinancePipeline>("/admin/finance/pipeline");
    return data;
  },

  async getTransactions({
    page = 1,
    page_size = TRANSACTIONS_PAGE_SIZE,
    search = "",
    status = "all",
  }: TransactionQuery = {}): Promise<TransactionPage> {
    const filtering = Boolean(search.trim()) || status !== "all";

    if (USE_MOCKS) {
      const needle = search.trim().toLowerCase();
      const filtered = MOCK_TRANSACTIONS.filter((txn) => {
        const byStatus = status === "all" || txn.status === status;
        const bySearch =
          !needle ||
          txn.reference.toLowerCase().includes(needle) ||
          txn.user_name.toLowerCase().includes(needle) ||
          txn.user_email.toLowerCase().includes(needle);
        return byStatus && bySearch;
      });

      const start = (page - 1) * page_size;
      return {
        items: filtered.slice(start, start + page_size),
        total: filtered.length,
        corpus_total: filtering ? filtered.length : MOCK_TRANSACTION_TOTAL,
        page,
        page_size,
      };
    }

    const { data } = await api.get<Paginated<Transaction>>(
      "/admin/finance/transactions",
      { params: { page, page_size, search, status } },
    );
    return { ...data, corpus_total: data.total };
  },

  async processRefund(transactionId: string): Promise<void> {
    if (USE_MOCKS) return;
    await api.post(`/admin/finance/transactions/${transactionId}/refund`);
  },
};
