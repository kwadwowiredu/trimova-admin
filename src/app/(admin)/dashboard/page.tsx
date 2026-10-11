import { serverGet, ApiError } from "@/lib/serverApi";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { UrgentFlags } from "@/components/dashboard/UrgentFlags";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { DashboardSnapshot } from "@/types";

// Always render fresh — this is a live platform-health view.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let snapshot: DashboardSnapshot;
  try {
    snapshot = await serverGet<DashboardSnapshot>("/admin/dashboard", {
      range: "30d",
    });
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Live KPI grid */}
      <KpiGrid kpis={snapshot.kpis} />

      {/* Charts layer */}
      <TrendChart initialData={snapshot.trend} initialRange="30d" />

      {/* Split layout: live feed (left) + urgent flags (right) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LiveActivityFeed initialEvents={snapshot.activity} />
        <UrgentFlags initialFlags={snapshot.flags} />
      </div>
    </div>
  );
}
