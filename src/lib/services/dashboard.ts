import { api } from "@/lib/api";
import type { DashboardSnapshot, TrendPoint, TrendRange } from "@/types";

/**
 * Dashboard data access. Components/hooks call these; they never touch Axios
 * directly. Everything comes from the same Express API that backs the mobile
 * apps, so what an admin sees is what actually happened.
 */
export const dashboardService = {
  async getSnapshot(range: TrendRange = "30d"): Promise<DashboardSnapshot> {
    const { data } = await api.get<DashboardSnapshot>("/admin/dashboard", {
      params: { range },
    });
    return data;
  },

  async getTrend(range: TrendRange): Promise<TrendPoint[]> {
    const { data } = await api.get<TrendPoint[]>("/admin/dashboard/trend", {
      params: { range },
    });
    return data;
  },
};
