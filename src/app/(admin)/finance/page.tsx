import { serverGet, ApiError } from "@/lib/serverApi";
import { PipelineCards } from "@/components/finance/PipelineCards";
import { TransactionLog } from "@/components/finance/TransactionLog";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import { TRANSACTIONS_PAGE_SIZE, type TransactionPage } from "@/lib/services/finance";
import type { FinancePipeline, Paginated, Transaction } from "@/types";

// Balances and the transaction log move continuously — always render fresh.
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  let pipeline: FinancePipeline;
  let transactions: TransactionPage;

  try {
    const [pipelineData, page] = await Promise.all([
      serverGet<FinancePipeline>("/admin/finance/pipeline"),
      serverGet<Paginated<Transaction>>("/admin/finance/transactions", {
        page: 1,
        page_size: TRANSACTIONS_PAGE_SIZE,
      }),
    ]);
    pipeline = pipelineData;
    // Nothing is filtered on first load, so the matched count IS the corpus.
    transactions = { ...page, corpus_total: page.total };
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-text">Financial Pipeline</h1>
        <span className="text-xs font-semibold text-text-muted">
          Real-time Paystack Sync
        </span>
      </div>

      <PipelineCards pipeline={pipeline} />
      <TransactionLog initialPage={transactions} />
    </div>
  );
}
