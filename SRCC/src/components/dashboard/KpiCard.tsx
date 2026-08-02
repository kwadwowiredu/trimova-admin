import { TrendingUp, TrendingDown, type LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";

export interface KpiCardProps {
  label: string;
  value: string;
  hint: string;
  /** Drives the hint colour + arrow. */
  trend?: "up" | "down" | "neutral";
  icon?: LucideIcon;
}

const TREND_STYLES: Record<NonNullable<KpiCardProps["trend"]>, string> = {
  up: "text-success",
  down: "text-danger",
  neutral: "text-text-muted",
};

export function KpiCard({ label, value, hint, trend = "neutral", icon: Icon }: KpiCardProps) {
  const TrendIcon = trend === "down" ? TrendingDown : TrendingUp;
  return (
    <Card className="p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-text-faint">
        {label}
      </p>
      <p className="mt-2 text-2xl font-bold text-text">{value}</p>
      <div className={cn("mt-2 flex items-center gap-1 text-xs", TREND_STYLES[trend])}>
        {trend !== "neutral" ? (
          <TrendIcon size={14} />
        ) : Icon ? (
          <Icon size={14} />
        ) : null}
        <span>{hint}</span>
      </div>
    </Card>
  );
}
