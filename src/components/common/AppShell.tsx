import type { ReactNode } from "react";
import { ShellFrame } from "./ShellFrame";
import type { AdminSession } from "@/types";

interface AppShellProps {
  session: AdminSession;
  children: ReactNode;
}

/** Persistent sidebar + topbar frame wrapping every authenticated admin page. */
export function AppShell({ session, children }: AppShellProps) {
  return <ShellFrame session={session}>{children}</ShellFrame>;
}
