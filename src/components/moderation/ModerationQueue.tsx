"use client";

import { useCallback, useState, useTransition } from "react";
import { MessageSquareWarning, Star, Check, EyeOff, AlertTriangle, Undo2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { moderationService } from "@/lib/services/admin";
import { timeAgo } from "@/lib/format";
import type { ModerationAction, ModerationReview, ReviewsPage } from "@/types";

type Filter = "reported" | "hidden" | "all";

const TABS: { label: string; value: Filter }[] = [
  { label: "Reported", value: "reported" },
  { label: "Removed", value: "hidden" },
  { label: "All reviews", value: "all" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          className={i <= rating ? "fill-warning text-warning" : "text-border"}
        />
      ))}
    </span>
  );
}

/**
 * The reported-reviews queue.
 *
 * Removing a review soft-hides it: the row survives so the rating history and
 * the audit trail stay intact, and the database trigger recomputes the
 * barber's average without it. Nothing here deletes anything.
 */
export function ModerationQueue({ initialPage }: { initialPage: ReviewsPage }) {
  const [page, setPage] = useState(initialPage);
  const [filter, setFilter] = useState<Filter>("reported");
  const [isPending, startTransition] = useTransition();

  const load = useCallback((next: Filter) => {
    startTransition(async () => {
      setPage(await moderationService.list(next));
    });
  }, []);

  function changeFilter(next: Filter) {
    setFilter(next);
    load(next);
  }

  function act(review: ModerationReview, action: ModerationAction) {
    startTransition(async () => {
      await moderationService.moderate(review.id, action);
      setPage(await moderationService.list(filter));
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-text">Content Moderation</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Reviews reported as abusive or fake. Removing hides a review from clients — it is
          never deleted.
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {TABS.map((t) => {
          const count =
            t.value === "reported"
              ? page.counts.reported
              : t.value === "hidden"
                ? page.counts.hidden
                : 0;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => changeFilter(t.value)}
              className={
                filter === t.value
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

      {isPending && <p className="text-xs text-text-muted">Loading…</p>}

      {page.items.length === 0 ? (
        <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
          <div className="rounded-full bg-success/10 p-3">
            <MessageSquareWarning className="text-success" size={22} />
          </div>
          <p className="text-sm font-semibold text-text">Queue is clear</p>
          <p className="max-w-sm text-sm text-text-muted">
            {filter === "reported"
              ? "No reviews are waiting on a decision."
              : "Nothing to show in this view."}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {page.items.map((review) => (
            <Card key={review.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 flex-1 gap-3">
                  <Avatar
                    name={review.author_name}
                    src={review.author_avatar_url}
                    size={38}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-text">{review.author_name}</p>
                      <Stars rating={review.rating} />
                      <span className="text-xs text-text-faint">
                        about {review.about_name}
                      </span>
                      {review.hidden_at && <Badge tone="danger">Removed</Badge>}
                    </div>

                    <p className="mt-2 text-sm text-text-muted">
                      {review.comment || (
                        <span className="italic text-text-faint">No written comment.</span>
                      )}
                    </p>

                    {review.report_reason && (
                      <p className="mt-2 flex items-start gap-1.5 text-xs text-danger">
                        <AlertTriangle size={13} className="mt-0.5 shrink-0" />
                        Reported: {review.report_reason}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-text-faint">
                      Left {timeAgo(review.created_at)}
                      {review.reported_at && ` · reported ${timeAgo(review.reported_at)}`}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2">
                  {review.hidden_at ? (
                    <Button size="sm" variant="outline" onClick={() => act(review, "restore")}>
                      <Undo2 size={14} className="mr-1.5" />
                      Restore
                    </Button>
                  ) : (
                    <>
                      <Button size="sm" variant="outline" onClick={() => act(review, "dismiss")}>
                        <Check size={14} className="mr-1.5" />
                        Dismiss
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => act(review, "warn")}>
                        <AlertTriangle size={14} className="mr-1.5" />
                        Warn author
                      </Button>
                      <Button size="sm" variant="danger" onClick={() => act(review, "remove")}>
                        <EyeOff size={14} className="mr-1.5" />
                        Remove
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
