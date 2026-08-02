import Link from "next/link";
import { ShieldX } from "lucide-react";
import { ROUTES } from "@/lib/constants";

/** Shown when a non-admin account attempts to access the panel. */
export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg px-6 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger/10">
        <ShieldX className="text-danger" size={32} />
      </div>
      <p className="mt-6 text-5xl font-bold text-text">403</p>
      <h1 className="mt-2 text-lg font-semibold text-text">Access denied</h1>
      <p className="mt-2 max-w-sm text-sm text-text-muted">
        This panel is restricted to Trimova administrators. Your account does not
        have the required <code className="text-accent">admin</code> role.
      </p>
      <Link
        href={ROUTES.login}
        className="mt-6 rounded-btn bg-accent px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent/90"
      >
        Back to sign in
      </Link>
    </main>
  );
}
