import { AlertTriangle } from "lucide-react";

/**
 * Shown when a server-rendered admin screen can't reach the API. Without this
 * a stopped backend takes the whole page down with an unhandled exception,
 * which tells an admin nothing about what to do next.
 */
export function ApiErrorState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-card border border-border bg-surface px-6 py-16 text-center">
      <div className="rounded-full bg-danger-soft p-3">
        <AlertTriangle className="text-danger" size={22} />
      </div>
      <p className="text-sm font-semibold text-text">Couldn&apos;t load this page</p>
      <p className="max-w-sm text-sm text-text-muted">{message}</p>
      <p className="text-xs text-text-muted">
        Check that the Trimova API is running, then refresh.
      </p>
    </div>
  );
}
