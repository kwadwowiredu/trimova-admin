"use client";

import { useState } from "react";
import { Percent, Clock, TrendingUp, Save, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { settingsService } from "@/lib/services/admin";
import type { PlatformSettings } from "@/types";

/**
 * The platform's operating parameters.
 *
 * These are read on every booking and settlement, so the form saves the whole
 * object at once rather than field by field — a half-applied policy (a free
 * window shorter than the half-fee window, say) would charge clients more for
 * cancelling earlier.
 */
export function SettingsForm({ initial }: { initial: PlatformSettings }) {
  const [form, setForm] = useState<PlatformSettings>(initial);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  function setField<K extends keyof PlatformSettings>(key: K, value: PlatformSettings[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setResult(null);
  }

  function setTier(id: string, patch: Partial<{ booking_threshold: number; commission_rate: number }>) {
    setForm((prev) => ({
      ...prev,
      tiers: prev.tiers.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    }));
    setResult(null);
  }

  async function handleSave() {
    setSaving(true);
    setResult(null);
    try {
      const saved = await settingsService.save(form);
      // Re-seed from the server so what's on screen is what's stored.
      setForm(saved);
      setResult({ ok: true, message: "Settings saved. New bookings use these immediately." });
    } catch (err) {
      setResult({
        ok: false,
        message: (err as { message?: string })?.message ?? "Couldn't save those settings.",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-text">Settings</h1>
          <p className="mt-0.5 text-sm text-text-muted">
            These govern every booking on the platform. Changes take effect immediately.
          </p>
        </div>
        <Button onClick={handleSave} isLoading={saving}>
          <Save size={15} className="mr-2" />
          Save changes
        </Button>
      </div>

      {result && (
        <div
          className={
            result.ok
              ? "flex items-center gap-2 rounded-btn bg-success/10 px-4 py-2.5 text-sm text-success"
              : "flex items-center gap-2 rounded-btn bg-danger/10 px-4 py-2.5 text-sm text-danger"
          }
        >
          {result.ok ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {result.message}
        </div>
      )}

      {/* ── Commission tiers ─────────────────────────────────────── */}
      <Card className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <TrendingUp size={17} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Commission tiers</h2>
        </div>
        <p className="mb-5 text-sm text-text-muted">
          A barber&apos;s rate improves as they complete more work. Tiers are recalculated from
          completed bookings over the last {form.tier_window_days} days, so a barber can move
          both up and down.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          {form.tiers.map((tier) => (
            <div key={tier.id} className="rounded-card border border-border bg-surface-alt/40 p-4">
              <p className="mb-3 text-sm font-semibold text-text">{tier.name}</p>

              <label className="mb-1 block text-xs font-medium text-text-muted">
                Completed bookings
              </label>
              <Input
                type="number"
                min={0}
                value={tier.booking_threshold}
                onChange={(e) =>
                  setTier(tier.id, { booking_threshold: Number(e.target.value) })
                }
              />

              <label className="mb-1 mt-3 block text-xs font-medium text-text-muted">
                Commission rate
              </label>
              <Input
                type="number"
                min={0}
                max={50}
                step={0.5}
                icon={<Percent size={14} />}
                value={tier.commission_rate}
                onChange={(e) =>
                  setTier(tier.id, { commission_rate: Number(e.target.value) })
                }
              />

              {/* What this means in money, on a typical ₵70 cut */}
              <p className="mt-2 text-xs text-text-faint">
                On a ₵70 service the barber keeps ₵
                {(70 - (70 * tier.commission_rate) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Default commission"
            hint="Used before a barber has enough history for a tier."
            icon={<Percent size={14} />}
            value={form.commission_percent}
            min={0}
            max={50}
            step={0.5}
            onChange={(v) => setField("commission_percent", v)}
          />
          <Field
            label="Tier window (days)"
            hint="How far back the tier calculation looks."
            value={form.tier_window_days}
            min={7}
            max={365}
            onChange={(v) => setField("tier_window_days", v)}
          />
        </div>
      </Card>

      {/* ── Timing rules ─────────────────────────────────────────── */}
      <Card className="p-5">
        <div className="mb-1 flex items-center gap-2">
          <Clock size={17} className="text-accent" />
          <h2 className="text-base font-semibold text-text">Execution rules</h2>
        </div>
        <p className="mb-5 text-sm text-text-muted">
          The clocks that govern cancellations, approvals and when money leaves escrow.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Free cancellation window (hours)"
            hint="Cancel earlier than this and the client is refunded in full."
            value={form.free_cancel_hours}
            min={0}
            max={168}
            onChange={(v) => setField("free_cancel_hours", v)}
          />
          <Field
            label="Half-fee window (hours)"
            hint="Inside this, 50% is forfeited. Below it, the full amount is."
            value={form.half_fee_hours}
            min={0}
            max={168}
            onChange={(v) => setField("half_fee_hours", v)}
          />
          <Field
            label="Confirmation window (hours)"
            hint="How long after an appointment a client has to raise a problem before payment is released to the barber."
            value={form.confirmation_window_hours}
            min={0}
            max={168}
            onChange={(v) => setField("confirmation_window_hours", v)}
          />
          <Field
            label="Request expiry (minutes)"
            hint="How long a mobile barber has to accept a booking request before it lapses."
            value={form.request_expiry_minutes}
            min={5}
            max={10080}
            onChange={(v) => setField("request_expiry_minutes", v)}
          />
        </div>

        {form.free_cancel_hours <= form.half_fee_hours && (
          <p className="mt-4 flex items-center gap-2 text-sm text-danger">
            <AlertCircle size={15} />
            The free window must be longer than the half-fee window, or cancelling earlier
            would cost more.
          </p>
        )}
      </Card>
    </div>
  );
}

function Field({
  label,
  hint,
  value,
  min,
  max,
  step,
  icon,
  onChange,
}: {
  label: string;
  hint: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-text">{label}</label>
      <Input
        type="number"
        min={min}
        max={max}
        step={step}
        icon={icon}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <p className="mt-1 text-xs text-text-faint">{hint}</p>
    </div>
  );
}
