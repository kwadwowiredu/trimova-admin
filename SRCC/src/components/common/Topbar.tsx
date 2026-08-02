"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/lib/constants";
import type { AdminSession } from "@/types";

const TITLES: Record<string, string> = {
  [ROUTES.dashboard]: "Dashboard",
  [ROUTES.users]: "Users",
  [ROUTES.finance]: "Finance",
  [ROUTES.security]: "Security",
  [ROUTES.moderation]: "Moderation",
  [ROUTES.settings]: "Settings",
};

function titleFor(pathname: string): string {
  const match = Object.entries(TITLES).find(
    ([href]) => pathname === href || pathname.startsWith(`${href}/`),
  );
  return match?.[1] ?? "Dashboard";
}

interface TopbarProps {
  session: AdminSession;
  /** Opens the sidebar drawer below `lg`. */
  onMenuClick?: () => void;
}

export function Topbar({ session, onMenuClick }: TopbarProps) {
  const pathname = usePathname();

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-surface px-4 sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-btn p-1.5 text-text transition-colors hover:bg-surface-alt lg:hidden"
        >
          <Menu size={20} />
        </button>
        <h1 className="truncate text-lg font-semibold text-text">
          {titleFor(pathname)}
        </h1>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          type="button"
          aria-label="Search"
          className="text-text-muted transition-colors hover:text-text"
        >
          <Search size={20} />
        </button>
        <button
          type="button"
          aria-label="Notifications"
          className="relative text-text-muted transition-colors hover:text-text"
        >
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger" />
        </button>
        <Avatar name={session.full_name} src={session.avatar_url} size={32} />
      </div>
    </header>
  );
}
