import { api } from "@/lib/api";
import type {
  FinancePipeline,
  Paginated,
  Transaction,
  TransactionStatus,
} from "@/types";

export const TRANSACTIONS_PAGE_SIZE = 10;

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

/** Finance data access for the Paystack pipeline screen. */
export const financeService = {
  async getPipeline(): Promise<FinancePipeline> {
    const { data } = await api.get<FinancePipeline>("/admin/finance/pipeline");
    return data;
  },

  async getTransactions({
    page = 1,
    page_size = TRANSACTIONS_PAGE_SIZE,
    search = "",
    status = "all",
  }: TransactionQuery = {}): Promise<TransactionPage> {
    const { data } = await api.get<Paginated<Transaction>>(
      "/admin/finance/transactions",
      { params: { page, page_size, search, status } },
    );

    const filtering = Boolean(search.trim()) || status !== "all";
    // Unfiltered, the matched count IS the whole corpus; when a filter is on we
    // ask once more for the unfiltered total so the footer stays honest.
    if (!filtering) return { ...data, corpus_total: data.total };

    const { data: all } = await api.get<Paginated<Transaction>>(
      "/admin/finance/transactions",
      { params: { page: 1, page_size: 1, status: "all" } },
    );
    return { ...data, corpus_total: all.total };
  },

  async processRefund(transactionId: string): Promise<void> {
    await api.post(`/admin/finance/transactions/${transactionId}/refund`);
  },
};
