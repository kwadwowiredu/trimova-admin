"use client";

import { useMemo, useState, useTransition } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { TRIMOVA_THEME } from "@/theme/theme";
import { formatCurrency } from "@/lib/format";
import { dashboardService } from "@/lib/services/dashboard";
import type { TrendPoint, TrendRange } from "@/types";

const RANGES: { value: TrendRange; label: string }[] = [
  { value: "30d", label: "30 Days" },
  { value: "90d", label: "90 Days" },
  { value: "1y", label: "Yearly" },
];

type Metric = "bookings" | "revenue";

interface TrendChartProps {
  initialData: TrendPoint[];
  initialRange?: TrendRange;
}

export function TrendChart({ initialData, initialRange = "30d" }: TrendChartProps) {
  const [range, setRange] = useState<TrendRange>(initialRange);
  const [metric, setMetric] = useState<Metric>("bookings");
  const [data, setData] = useState<TrendPoint[]>(initialData);
  const [isPending, startTransition] = useTransition();

  const handleRange = (next: TrendRange) => {
    if (next === range) return;
    setRange(next);
    startTransition(async () => {
      const fresh = await dashboardService.getTrend(next);
      setData(fresh);
    });
  };

  const peak = useMemo(
    () => Math.max(...data.map((d) => d[metric])),
    [data, metric],
  );

  return (
    <Card className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-text">
            {metric === "bookings" ? "Booking Velocity" : "System Revenue"}
          </h2>
          <p className="text-xs text-text-muted">
            Real-time throughput for the selected range
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Metric switch */}
          <div className="flex rounded-btn bg-surface-alt p-0.5">
            {(["bookings", "revenue"] as Metric[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMetric(m)}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 text-xs font-medium capitalize transition-colors",
                  metric === m
                    ? "bg-surface text-accent shadow-card"
                    : "text-text-muted hover:text-text",
                )}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Range toggle */}
          <div className="flex rounded-btn bg-surface-alt p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => handleRange(r.value)}
                className={cn(
                  "rounded-[6px] px-2.5 py-1 text-xs font-medium transition-colors",
                  range === r.value
                    ? "bg-surface text-accent shadow-card"
                    : "text-text-muted hover:text-text",
                )}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "mt-5 h-64 transition-opacity",
          isPending && "opacity-50",
        )}
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 0, bottom: 0, left: -16 }}>
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
              minTickGap={24}
              tick={{ fontSize: 11, fill: TRIMOVA_THEME.textFaint }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fontSize: 11, fill: TRIMOVA_THEME.textFaint }}
            />
            <Tooltip
              cursor={{ fill: TRIMOVA_THEME.surfaceAlt }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${TRIMOVA_THEME.border}`,
                fontSize: 12,
                boxShadow: "0 8px 24px -8px rgba(16,24,40,0.18)",
              }}
              formatter={(value: number) =>
                metric === "revenue"
                  ? [formatCurrency(value), "Revenue"]
                  : [value.toLocaleString("en-GH"), "Bookings"]
              }
            />
            <Bar dataKey={metric} radius={[4, 4, 0, 0]} maxBarSize={28}>
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={
                    entry[metric] === peak
                      ? TRIMOVA_THEME.accent
                      : TRIMOVA_THEME.accentSoft
                  }
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
