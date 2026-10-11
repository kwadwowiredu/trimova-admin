import {
  Wallet,
  Send,
  Undo2,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/cn";
import { formatCedi } from "@/lib/format";
import type { FinancePipeline } from "@/types";

type Tone = "accent" | "success" | "danger";

interface PipelineCard {
  label: string;
  value: string;
  hint: string;
  tone: Tone;
  icon: LucideIcon;
  hintIcon: LucideIcon;
  /** Fill ratio (0..1) for the card's progress meter. */
  progress: number;
}

const TONE_STYLES: Record<Tone, { text: string; bar: string }> = {
  accent: { text: "text-accent", bar: "bg-accent" },
  success: { text: "text-success", bar: "bg-success" },
  danger: { text: "text-danger", bar: "bg-danger" },
};

interface PipelineCardsProps {
  pipeline: FinancePipeline;
}

/**
 * The three funds-flow summary cards at the top of the Finance screen. Each
 * meter is sized relative to the largest amount in the pipeline so the bars
 * stay comparable as the real numbers move.
 */
export function PipelineCards({ pipeline }: PipelineCardsProps) {
  const peak = Math.max(
    pipeline.funds_held,
    pipeline.transfers_total,
    pipeline.refunds_total,
    1,
  );

  const cards: PipelineCard[] = [
    {
      label: "Funds Held",
      value: formatCedi(pipeline.funds_held),
      hint: "12% vs last week",
      tone: "accent",
      icon: Wallet,
      hintIcon: TrendingUp,
      progress: pipeline.funds_held / peak,
    },
    {
      label: "Transfers",
      value: formatCedi(pipeline.transfers_total),
      hint: `${pipeline.transfers_success_today.toLocaleString("en-GH")} successful today`,
      tone: "success",
      icon: Send,
      hintIcon: CheckCircle2,
      progress: pipeline.transfers_total / peak,
    },
    {
      label: "Refunds",
      value: formatCedi(pipeline.refunds_total),
      hint: `${pipeline.refunds_pending} pending requests`,
      tone: "danger",
      icon: Undo2,
      hintIcon: AlertTriangle,
      progress: pipeline.refunds_total / peak,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const tone = TONE_STYLES[card.tone];
        const HintIcon = card.hintIcon;
        return (
          <Card key={card.label} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                {card.label}
              </p>
              <card.icon size={18} className={tone.text} />
            </div>

            <p className="mt-2 text-3xl font-bold tracking-tight text-text">
              {card.value}
            </p>

            <div className={cn("mt-2 flex items-center gap-1.5 text-xs", tone.text)}>
              <HintIcon size={14} />
              <span>{card.hint}</span>
            </div>

            <div
              role="presentation"
              className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt"
            >
              <div
                className={cn("h-full rounded-full transition-all", tone.bar)}
                style={{ width: `${Math.min(card.progress * 100, 100)}%` }}
              />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
