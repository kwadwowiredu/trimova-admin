import { api } from "@/lib/api";
import { USE_MOCKS } from "@/lib/constants";
import { buildDashboardSnapshot, buildTrend } from "@/lib/mocks/dashboard";
import type { DashboardSnapshot, TrendPoint, TrendRange } from "@/types";

/**
 * Dashboard data access. Components/hooks call these; they never touch Axios or
 * mock files directly. Flip NEXT_PUBLIC_USE_MOCKS to "false" to hit the real
 * Express endpoints that already back the mobile app.
 */
export const dashboardService = {
  async getSnapshot(range: TrendRange = "30d"): Promise<DashboardSnapshot> {
    if (USE_MOCKS) return buildDashboardSnapshot(range);
    const { data } = await api.get<DashboardSnapshot>("/admin/dashboard", {
      params: { range },
    });
    return data;
  },

  async getTrend(range: TrendRange): Promise<TrendPoint[]> {
    if (USE_MOCKS) return buildTrend(range);
    const { data } = await api.get<TrendPoint[]>("/admin/dashboard/trend", {
      params: { range },
    });
    return data;
  },
};
