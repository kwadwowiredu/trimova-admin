"use client";

import { useEffect, useState } from "react";
import { Mail, Phone, Star, CalendarDays } from "lucide-react";
import { Drawer } from "@/components/ui/Drawer";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { usersService } from "@/lib/services/users";
import { BARBER_ROLES } from "@/lib/mocks/users";
import { formatCurrency, formatJoinDate } from "@/lib/format";
import type { PayoutRecord, User, UserStatus } from "@/types";

interface UserDrawerProps {
  user: User | null;
  onClose: () => void;
  onStatusChange: (userId: string, status: UserStatus) => void;
}

const PAYOUT_TONES: Record<PayoutRecord["status"], "success" | "warning" | "danger"> = {
  paid: "success",
  pending: "warning",
  failed: "danger",
};

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <span className="mt-0.5 text-text-faint">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs text-text-faint">{label}</p>
        <p className="truncate text-sm text-text">{value}</p>
      </div>
    </div>
  );
}

/**
 * Slide-over inspector for a single user: profile summary, contact details and
 * — for barbers — payout history, plus suspend/reinstate actions.
 */
export function UserDrawer({ user, onClose, onStatusChange }: UserDrawerProps) {
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loadingPayouts, setLoadingPayouts] = useState(false);

  const isBarber = user ? BARBER_ROLES.includes(user.role) : false;

  useEffect(() => {
    if (!user || !isBarber) {
      setPayouts([]);
      return;
    }

    let active = true;
    setLoadingPayouts(true);
    usersService
      .getPayouts(user.id)
      .then((records) => {
        if (active) setPayouts(records);
      })
      .finally(() => {
        if (active) setLoadingPayouts(false);
      });

    return () => {
      active = false;
    };
  }, [user, isBarber]);

  if (!user) return null;

  const suspended = user.status === "suspended";

  return (
    <Drawer
      open
      onClose={onClose}
      title={user.full_name}
      subtitle={`ID: #${user.id}`}
      footer={
        <div className="flex gap-2">
          <Button
            variant={suspended ? "primary" : "danger"}
            className="flex-1"
            onClick={() => {
              onStatusChange(user.id, suspended ? "active" : "suspended");
              onClose();
            }}
          >
            {suspended ? "Reinstate Account" : "Suspend Account"}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="flex items-center gap-4">
        <Avatar name={user.full_name} src={user.avatar_url} size={56} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold text-text">
            {user.full_name}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <RoleBadge role={user.role} />
            <StatusBadge status={user.status} />
          </div>
        </div>
      </div>

      <div className="mt-5 divide-y divide-border border-y border-border">
        <DetailRow icon={<Mail size={16} />} label="Email" value={user.email} />
        <DetailRow
          icon={<Phone size={16} />}
          label="Phone"
          value={user.phone ?? "Not provided"}
        />
        <DetailRow
          icon={<CalendarDays size={16} />}
          label="Joined"
          value={formatJoinDate(user.created_at)}
        />
        {user.rating !== null && (
          <DetailRow
            icon={<Star size={16} />}
            label="Average rating"
            value={`${user.rating.toFixed(1)} / 5.0`}
          />
        )}
      </div>

      {isBarber && (
        <section className="mt-6">
          <h3 className="text-sm font-semibold text-text">Payout history</h3>

          {loadingPayouts ? (
            <div className="mt-3 space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="skeleton h-14 rounded-card" />
              ))}
            </div>
          ) : payouts.length === 0 ? (
            <p className="mt-3 rounded-card border border-border bg-surface-alt/50 px-4 py-6 text-center text-sm text-text-muted">
              No payouts recorded yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {payouts.map((payout) => (
                <li
                  key={payout.id}
                  className="flex items-center justify-between gap-3 rounded-card border border-border px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-mono text-xs text-accent">
                      {payout.reference}
                    </p>
                    <p className="text-xs text-text-faint">
                      {formatJoinDate(payout.created_at)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-text">
                      {formatCurrency(payout.amount)}
                    </span>
                    <Badge tone={PAYOUT_TONES[payout.status]} className="capitalize">
                      {payout.status}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </Drawer>
  );
}
