"use client";

import { useState } from "react";
import { AlertTriangle, MessageSquareWarning, ShieldCheck } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatClock } from "@/lib/format";
import type { SuspiciousFlag } from "@/types";

interface UrgentFlagsProps {
  initialFlags: SuspiciousFlag[];
}

/**
 * Right-column widget surfacing the most urgent unhandled flags + reported
 * reviews. Actions resolve optimistically client-side; wire the handlers to the
 * security/moderation endpoints when the backend is live.
 */
export function UrgentFlags({ initialFlags }: UrgentFlagsProps) {
  const [flags, setFlags] = useState<SuspiciousFlag[]>(initialFlags);

  const resolve = (id: string) =>
    setFlags((prev) => prev.filter((f) => f.id !== id));

  return (
    <Card className="flex h-full flex-col border-danger/30 bg-danger/[0.03] p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-text">Urgent Flags</h2>
        <Badge tone="danger">{flags.length} Tasks</Badge>
      </div>

      {flags.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
          <ShieldCheck className="text-success" size={28} />
          <p className="mt-3 text-sm font-medium text-text">All clear</p>
          <p className="text-xs text-text-muted">No urgent items right now.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {flags.map((flag) => {
            const isReview = flag.subject_role === "barber";
            const Icon = isReview ? MessageSquareWarning : AlertTriangle;
            return (
              <li
                key={flag.id}
                className="animate-fade-in rounded-card border border-border bg-surface p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Icon
                      size={16}
                      className={isReview ? "text-warning" : "text-danger"}
                    />
                    <span className="text-sm font-semibold text-text">
                      {isReview ? "Reported Review" : "Suspicious Transaction"}
                    </span>
                  </div>
                  <span className="text-xs text-text-faint">
                    {formatClock(flag.created_at)}
                  </span>
                </div>

                <p className="mt-2 text-xs leading-relaxed text-text-muted">
                  {flag.reason}
                </p>

                <div className="mt-3 flex gap-2">
                  {isReview ? (
                    <>
                      <Button size="sm" onClick={() => resolve(flag.id)}>
                        View Review
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolve(flag.id)}
                      >
                        Safe
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => resolve(flag.id)}
                      >
                        Freeze Account
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolve(flag.id)}
                      >
                        Dismiss
                      </Button>
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
