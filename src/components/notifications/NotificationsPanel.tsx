"use client";

import { useCallback, useState, useTransition } from "react";
import { Megaphone, Send, Bell, CheckCircle2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { notificationsService } from "@/lib/services/admin";
import { timeAgo } from "@/lib/format";
import type { AnnouncementAudience, NotificationsPage } from "@/types";

const AUDIENCES: { label: string; value: AnnouncementAudience }[] = [
  { label: "Everyone", value: "all" },
  { label: "Clients", value: "client" },
  { label: "Barbers", value: "barber" },
  { label: "Staff barbers", value: "staff_barber" },
];

const TYPE_FILTERS = [
  { label: "All", value: "all" },
  { label: "Bookings", value: "booking_created" },
  { label: "Payments", value: "payment_received" },
  { label: "Payouts", value: "payout" },
  { label: "System", value: "system" },
];

/**
 * What the platform has been telling people, and a way to tell them something
 * new.
 *
 * The feed matters as much as the compose box: when a barber says "I never got
 * told", this is where support checks whether a notification was actually
 * written and whether it was read.
 */
export function NotificationsPanel({ initialPage }: { initialPage: NotificationsPage }) {
  const [page, setPage] = useState(initialPage);
  const [type, setType] = useState("all");
  const [isPending, startTransition] = useTransition();

  const [audience, setAudience] = useState<AnnouncementAudience>("all");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  const load = useCallback((next: string) => {
    startTransition(async () => {
      setPage(await notificationsService.list(next));
    });
  }, []);

  function changeType(next: string) {
    setType(next);
    load(next);
  }

  async function send() {
    if (!title.trim() || !body.trim()) {
      setResult({ ok: false, message: "Give the announcement a title and a message." });
      return;
    }
    setSending(true);
    setResult(null);
    try {
      const { recipients } = await notificationsService.announce({ audience, title, body });
      setResult({
        ok: true,
        message: `Sent to ${recipients} ${recipients === 1 ? "person" : "people"}.`,
      });
      setTitle("");
      setBody("");
      load(type);
    } catch (err) {
      setResult({
        ok: false,
        message: (err as { message?: string })?.message ?? "Couldn't send that announcement.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-text">Notifications</h1>
        <p className="mt-0.5 text-sm text-text-muted">
          Everything the platform has sent, and a way to broadcast something new.
        </p>
      </div>

      {/* ── Compose ──────────────────────────────────────────────── */}
      <Card className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <Megaphone size={17} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Send an announcement</h2>
        </div>

        <label className="mb-1.5 block text-sm font-medium text-text">Audience</label>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {AUDIENCES.map((a) => (
            <button
              key={a.value}
              type="button"
              onClick={() => setAudience(a.value)}
              className={
                audience === a.value
                  ? "rounded-full bg-accent px-4 py-1.5 text-xs font-semibold text-white"
                  : "rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-alt"
              }
            >
              {a.label}
            </button>
          ))}
        </div>

        <label className="mb-1.5 block text-sm font-medium text-text">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Scheduled maintenance on Sunday"
          maxLength={80}
        />

        <label className="mb-1.5 mt-4 block text-sm font-medium text-text">Message</label>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          maxLength={400}
          placeholder="Trimova will be briefly unavailable from 2am to 4am on Sunday while we upgrade our servers."
          className="w-full rounded-btn border border-border bg-surface px-3 py-2.5 text-sm text-text outline-none transition-colors placeholder:text-text-faint focus:border-accent"
        />

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-text-faint">
            This reaches every matching account in-app. It cannot be unsent.
          </p>
          <Button onClick={send} isLoading={sending}>
            <Send size={15} className="mr-2" />
            Send
          </Button>
        </div>

        {result && (
          <div
            className={
              result.ok
                ? "mt-3 flex items-center gap-2 rounded-btn bg-success/10 px-4 py-2.5 text-sm text-success"
                : "mt-3 flex items-center gap-2 rounded-btn bg-danger/10 px-4 py-2.5 text-sm text-danger"
            }
          >
            {result.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            {result.message}
          </div>
        )}
      </Card>

      {/* ── Past announcements ───────────────────────────────────── */}
      {page.announcements.length > 0 && (
        <Card className="p-5">
          <h2 className="mb-3 text-base font-semibold text-text">Recent announcements</h2>
          <ul className="space-y-2.5">
            {page.announcements.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-3 border-b border-border pb-2.5 last:border-0 last:pb-0">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text">{a.title}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-text-muted">{a.body}</p>
                </div>
                <div className="shrink-0 text-right">
                  <Badge tone="neutral">{a.audience}</Badge>
                  <p className="mt-1 text-xs text-text-faint">
                    {a.recipients} · {timeAgo(a.created_at)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* ── Delivery log ─────────────────────────────────────────── */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4">
          <div className="flex items-center gap-2">
            <Bell size={16} className="text-text-muted" />
            <h2 className="text-base font-semibold text-text">Delivery log</h2>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {TYPE_FILTERS.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => changeType(t.value)}
                className={
                  type === t.value
                    ? "rounded-full bg-accent px-3.5 py-1.5 text-xs font-semibold text-white"
                    : "rounded-full px-3.5 py-1.5 text-xs font-semibold text-text-muted transition-colors hover:bg-surface-alt"
                }
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isPending ? (
          <p className="px-5 py-10 text-center text-sm text-text-muted">Loading…</p>
        ) : page.items.length === 0 ? (
          <p className="px-5 py-14 text-center text-sm text-text-muted">
            Nothing sent yet.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {page.items.map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-text">{n.title}</p>
                  <p className="mt-0.5 text-sm text-text-muted">{n.body}</p>
                  <p className="mt-1 text-xs text-text-faint">
                    to {n.recipient_name}
                    {n.recipient_role && ` (${n.recipient_role.replace("_", " ")})`} ·{" "}
                    {timeAgo(n.created_at)}
                  </p>
                </div>
                {/* Whether it was read is the question support actually asks. */}
                <Badge tone={n.read_at ? "success" : "neutral"}>
                  {n.read_at ? "Read" : "Unread"}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
