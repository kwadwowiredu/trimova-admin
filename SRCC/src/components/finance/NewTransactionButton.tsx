"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

/**
 * Floating action button on the Finance screen. Opens a manual-entry panel for
 * recording an off-Paystack adjustment; submission is stubbed until the
 * corresponding backend endpoint exists.
 */
export function NewTransactionButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Record a manual transaction"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-card bg-accent text-white shadow-drawer transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
      >
        <Plus size={24} />
      </button>

      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Record manual transaction"
        subtitle="For adjustments made outside the Paystack pipeline"
        footer={
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => setOpen(false)}>
              Save entry
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        }
      >
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">
              Reference
            </span>
            <Input placeholder="e.g. ADJ_000184" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">
              User email
            </span>
            <Input type="email" placeholder="user@example.com" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">
              Amount (GHS)
            </span>
            <Input type="number" min={0} step="0.01" placeholder="0.00" />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-text">
              Note
            </span>
            <textarea
              rows={3}
              placeholder="Why is this adjustment being recorded?"
              className="w-full rounded-btn border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
            />
          </label>
        </form>
      </Drawer>
    </>
  );
}
