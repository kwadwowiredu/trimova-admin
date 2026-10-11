"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Wallet,
  ShieldCheck,
  MessageSquareWarning,
  Bell,
  Settings,
  LogOut,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { ROUTES } from "@/lib/constants";
import { Avatar } from "@/components/ui/Avatar";
import { logoutAction } from "@/app/actions/auth";
import type { AdminSession } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "Users", href: ROUTES.users, icon: Users },
  { label: "Bookings", href: ROUTES.bookings, icon: CalendarCheck },
  { label: "Finance", href: ROUTES.finance, icon: Wallet },
  { label: "Security", href: ROUTES.security, icon: ShieldCheck },
  { label: "Notifications", href: ROUTES.notifications, icon: Bell },
  { label: "Moderation", href: ROUTES.moderation, icon: MessageSquareWarning },
];

const NAV_LINK =
  "flex items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-medium transition-colors";
const NAV_LINK_ACTIVE = "bg-accent-soft text-accent";
const NAV_LINK_IDLE = "text-text-muted hover:bg-surface-alt hover:text-text";

interface SidebarProps {
  session: AdminSession;
  /** Drawer visibility below `lg`; ignored on desktop where the rail is fixed. */
  open?: boolean;
  onClose?: () => void;
}

export function Sidebar({ session, open = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Scrim — only rendered while the mobile drawer is open. */}
      {open && (
        <div
          className="fixed inset-0 z-40 animate-fade-in bg-overlay lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex h-screen w-64 shrink-0 flex-col",
          "border-r border-border bg-surface transition-transform duration-200",
          "lg:static lg:z-auto lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between px-6 py-6">
          <span className="text-xl font-bold text-accent">Trimova Admin</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-btn p-1 text-text-muted transition-colors hover:bg-surface-alt hover:text-text lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={cn(
                NAV_LINK,
                isActive(href) ? NAV_LINK_ACTIVE : NAV_LINK_IDLE,
              )}
            >
              <Icon size={18} strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="px-3 pb-3">
          <Link
            href={ROUTES.settings}
            aria-current={isActive(ROUTES.settings) ? "page" : undefined}
            className={cn(
              NAV_LINK,
              isActive(ROUTES.settings) ? NAV_LINK_ACTIVE : NAV_LINK_IDLE,
            )}
          >
            <Settings size={18} strokeWidth={2} />
            Settings
          </Link>
        </div>

        <div className="flex items-center gap-3 border-t border-border px-4 py-4">
          <Avatar name={session.full_name} src={session.avatar_url} size={36} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-text">
              {session.full_name}
            </p>
            <p className="truncate text-xs text-text-muted">Master Admin</p>
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              aria-label="Sign out"
              className="rounded-btn p-2 text-text-muted transition-colors hover:bg-surface-alt hover:text-danger"
            >
              <LogOut size={16} />
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
