"use client";

import { useCallback, useState, useTransition } from "react";
import {
  ShieldAlert, RefreshCw, Check, Gavel, RotateCcw, Users, CalendarX, UserX,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { securityService } from "@/lib/services/admin";
import { timeAgo } from "@/lib/format";
import type { FlagKind, FlagStatus, FlagsPage, SuspiciousFlagRow } from "@/types";

const TABS: { label: string; value: FlagStatus | "all" }[] = [
  { label: "Pending investigation", value: "pending" },
  { label: "Cleared", value: "cleared" },
  { label: "Action taken", value: "action_taken" },
  { label: "All", value: "all" },
];

const KIND_LABELS: Record<FlagKind, string> = {
  high_cancellation: "High cancellation rate",
  client_no_show: "Repeated no-show reports",
  collusion: "Possible collusion",
};

const KIND_ICONS: Record<FlagKind, typeof CalendarX> = {
  high_cancellation: CalendarX,
  client_no_show: UserX,
  collusion: Users,
};

function severityTone(severity: SuspiciousFlagRow["severity"]) {
  if (severity === "high") return "danger" as const;
  if (severity === "medium") return "warning" as const;
  return "neutral" as const;
}

/**
 * The suspicious-activity workspace.
 *
 * Every row carries the numbers the detector counted, because a flag an admin
 * can't verify is one they'll either rubber-stamp or ignore — neither of which
 * is moderation.
 */
export function SecurityQueue({ initialPage }: { initialPage: FlagsPage }) {
  const [page, setPage] = useState(initialPage);
  const [tab, setTab] = useState<FlagStatus | "all">("pending");
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const load = useCallback((next: FlagStatus | "all") => {
    startTransition(async () => {
      setPage(await securityService.list(next));
    });
  }, []);

  function changeTab(next: FlagStatus | "all") {
    setTab(next);
    load(next);
  }

  async function runScan() {
    setScanning(true);
    setScanResult(null);
    try {
      const result = await securityService.scan();
      setScanResult(
        result.created > 0
          ? `${result.created} new flag${result.created === 1 ? "" : "s"} raised.`
          : "Nothing new — the last 30 days look clean.",
      );
      load(tab);
    } catch {
      setScanResult("Couldn't run the scan. Check the API is reachable.");
    } finally {
      setScanning(false);
    }
  }

  async function resolve(flag: SuspiciousFlagRow, status: FlagStatus) {
    startTransition(async () => {
      await securityService.resolve(flag.id, status);
      setPage(await securityService.list(tab));
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Suspicious Activity</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            Patterns from the last 30 days. Nothing here is acted on automatically.
          </p>
        </div>
        <Button onClick={runScan} isLoading={scanning} variant="secondary">
          <RefreshCw size={15} className="mr-2" />
          Run scan
        </Button>
      </div>

      {scanResult && (
        <div className="rounded-btn bg-accent-soft px-4 py-2.5 text-sm text-accent">
          {scanResult}
        </div>
      )}

      {/* Status tabs, with counts so the queue's size is never a surprise */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const count =
            t.value === "all"
              ? Object.values(page.counts).reduce((a, b) => a + b, 0)
              : page.counts[t.value];
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => changeTab(t.value)}
              className={
                tab === t.value
                  ? "rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full px-4 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-alt"
              }
            >
              {t.label}
              {count > 0 && <span className="ml-1.5 opacity-70">{count}</span>}
            </button>
          );
        })}
      </div>

      {isPending && (
        <p className="text-xs text-text-muted">Loading…</p>
      )}

      {page.items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="rounded-full bg-success/10 p-3">
            <ShieldAlert className="text-success" size={22} />
          </div>
          <p className="text-sm font-semibold text-text">Nothing flagged</p>
          <p className="max-w-sm text-sm text-text-muted">
            {tab === "pending"
              ? "No open flags. Run a scan to check the last 30 days again."
              : "There's nothing in this view yet."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {page.items.map((flag) => {
            const Icon = KIND_ICONS[flag.kind];
            return (
              <Card key={flag.id} className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 flex-1 gap-3">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-alt text-text-muted">
                      <Icon size={16} />
                    </span>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-sm font-semibold text-text">
                          {flag.subject_name}
                          {flag.counterpart_name && (
                            <span className="font-normal text-text-muted">
                              {" "}&amp; {flag.counterpart_name}
                            </span>
                          )}
                        </p>
                        <Badge tone={severityTone(flag.severity)}>{flag.severity}</Badge>
                        <Badge tone="neutral">{KIND_LABELS[flag.kind]}</Badge>
                      </div>

                      <p className="mt-1.5 text-sm text-text-muted">{flag.reason}</p>

                      {/* The detector's working, so a decision can be checked */}
                      {Object.keys(flag.evidence).length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                          {Object.entries(flag.evidence).map(([key, value]) => (
                            <span key={key} className="text-xs text-text-faint">
                              {key.replace(/([A-Z])/g, " $1").toLowerCase()}:{" "}
                              <span className="font-medium text-text-muted">{String(value)}</span>
                            </span>
                          ))}
                        </div>
                      )}

                      <p className="mt-2 text-xs text-text-faint">
                        Raised {timeAgo(flag.created_at)}
                        {flag.resolved_at && ` · resolved ${timeAgo(flag.resolved_at)}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    {flag.status === "pending" ? (
                      <>
                        <Button size="sm" variant="outline" onClick={() => resolve(flag, "cleared")}>
                          <Check size={14} className="mr-1.5" />
                          Clear
                        </Button>
                        <Button size="sm" variant="danger" onClick={() => resolve(flag, "action_taken")}>
                          <Gavel size={14} className="mr-1.5" />
                          Action taken
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => resolve(flag, "pending")}>
                        <RotateCcw size={14} className="mr-1.5" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
