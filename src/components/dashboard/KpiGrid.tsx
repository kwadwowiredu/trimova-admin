import { Lock } from "lucide-react";
import { KpiCard, type KpiCardProps } from "./KpiCard";
import { formatCurrency } from "@/lib/format";
import type { DashboardKpis } from "@/types";

interface KpiGridProps {
  kpis: DashboardKpis;
}

/** The 5 flat metric cards across the top of the dashboard. */
export function KpiGrid({ kpis }: KpiGridProps) {
  const cards: KpiCardProps[] = [
    {
      label: "Total Users",
      value: kpis.total_users.toLocaleString("en-GH"),
      hint: "12% growth",
      trend: "up",
    },
    {
      label: "Active Barbers",
      value: kpis.active_barbers.toLocaleString("en-GH"),
      hint: "92% online",
      trend: "up",
    },
    {
      label: "Booking Volume",
      value: kpis.live_booking_volume.toLocaleString("en-GH"),
      hint: "3% vs last wk",
      trend: "down",
    },
    {
      label: "Revenue (GHS)",
      value: kpis.commission_revenue.toLocaleString("en-GH"),
      hint: "+GHS 12k today",
      trend: "up",
    },
    {
      label: "Escrow Balance",
      value: formatCurrency(kpis.escrow_balance, { compact: true, withSymbol: false }),
      hint: "Pending payout",
      trend: "neutral",
      icon: Lock,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
      {cards.map((card) => (
        <KpiCard key={card.label} {...card} />
      ))}
    </div>
  );
}
