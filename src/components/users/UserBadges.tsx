import { Badge } from "@/components/ui/Badge";
import { ROLE_LABELS, STATUS_LABELS } from "@/lib/labels";
import type { UserRole, UserStatus } from "@/types";

/** Barbers read as "success" green, everyone else stays neutral. */
const ROLE_TONES: Record<UserRole, "neutral" | "success" | "accent"> = {
  client: "neutral",
  barber: "success",
  staff_barber: "success",
  admin: "accent",
};

const STATUS_TONES: Record<UserStatus, "neutral" | "success" | "danger" | "warning"> = {
  active: "success",
  inactive: "neutral",
  pending: "warning",
  suspended: "danger",
};

const PILL = "px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider";

export function RoleBadge({ role }: { role: UserRole }) {
  return (
    <Badge tone={ROLE_TONES[role]} className={PILL}>
      {ROLE_LABELS[role]}
    </Badge>
  );
}

export function StatusBadge({ status }: { status: UserStatus }) {
  return (
    <Badge tone={STATUS_TONES[status]} className={PILL}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
