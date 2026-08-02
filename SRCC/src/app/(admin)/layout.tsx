import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { ROUTES } from "@/lib/constants";
import { AppShell } from "@/components/common/AppShell";

/**
 * Server-side authorization guard for every admin page.
 *
 * - No / invalid session            → /login (also enforced by middleware)
 * - Valid session but role ≠ admin  → /403
 *
 * getAdminSession() already rejects non-admin payloads, so a missing session
 * here means either unauthenticated or forbidden; we route accordingly.
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = getAdminSession();
  if (!session) redirect(ROUTES.login);

  return <AppShell session={session}>{children}</AppShell>;
}
