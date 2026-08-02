"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import type { AdminSession } from "@/types";

interface ShellFrameProps {
  session: AdminSession;
  children: ReactNode;
}

/**
 * Owns the mobile navigation state shared by the Topbar's hamburger and the
 * Sidebar drawer. Split out of AppShell so the shell itself stays a server
 * component and keeps reading the session on the server.
 */
export function ShellFrame({ session, children }: ShellFrameProps) {
  const [navOpen, setNavOpen] = useState(false);
  const pathname = usePathname();

  // Navigating on mobile should always dismiss the drawer.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar
        session={session}
        open={navOpen}
        onClose={() => setNavOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar session={session} onMenuClick={() => setNavOpen(true)} />
        <main className="scroll-thin flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6">
          {children}
        </main>
      </div>
    </div>
  );
}
