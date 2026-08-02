import { dashboardService } from "@/lib/services/dashboard";
import { KpiGrid } from "@/components/dashboard/KpiGrid";
import { TrendChart } from "@/components/dashboard/TrendChart";
import { LiveActivityFeed } from "@/components/dashboard/LiveActivityFeed";
import { UrgentFlags } from "@/components/dashboard/UrgentFlags";

// Always render fresh — this is a live platform-health view.
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const snapshot = await dashboardService.getSnapshot("30d");

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
