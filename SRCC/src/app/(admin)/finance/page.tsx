import { financeService } from "@/lib/services/finance";
import { PipelineCards } from "@/components/finance/PipelineCards";
import { TransactionLog } from "@/components/finance/TransactionLog";
import { NewTransactionButton } from "@/components/finance/NewTransactionButton";

// Balances and the transaction log move continuously — always render fresh.
export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const [pipeline, transactions] = await Promise.all([
    financeService.getPipeline(),
    financeService.getTransactions(),
  ]);

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

      <NewTransactionButton />
    </div>
  );
}
