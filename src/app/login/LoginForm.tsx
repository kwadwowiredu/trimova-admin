"use client";

import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { loginAction, type LoginResult } from "@/app/actions/auth";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { tokenStore } from "@/lib/token";
import { ROUTES } from "@/lib/constants";

/**
 * `pending` is only true while the server action is in flight. Signing in
 * doesn't end there — the token still has to be stored and the dashboard
 * navigated to, which is another beat or two. Without `redirecting`, the
 * button snaps back to "Sign in" while work is plainly still happening, which
 * reads as a failure.
 */
function SubmitButton({ redirecting }: { redirecting: boolean }) {
  const { pending } = useFormStatus();
  const busy = pending || redirecting;

  return (
    <Button type="submit" className="w-full" isLoading={busy} disabled={busy}>
      {busy ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [state, formAction] = useFormState<LoginResult | null, FormData>(
    loginAction,
    null,
  );

  // React to the server action result: store token + route, or redirect to 403.
  useEffect(() => {
    if (!state) return;

    if (state.forbidden) {
      setRedirecting(true);
      router.replace(ROUTES.forbidden);
      return;
    }

    if (state.ok && state.token) {
      setRedirecting(true);
      tokenStore.set(state.token);
      router.replace(ROUTES.dashboard);
      router.refresh();
      return;
    }

    // A rejected attempt returns the form to the admin so they can retry.
    setRedirecting(false);
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-btn bg-danger/10 px-3 py-2.5 text-sm text-danger">
          <AlertCircle size={16} />
          <span>{state.error}</span>
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium text-text">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          icon={<Mail size={16} />}
          required
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="text-sm font-medium text-text">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          icon={<Lock size={16} />}
          required
        />
      </div>

      <SubmitButton redirecting={redirecting} />

      <p className="rounded-btn bg-surface-alt px-3 py-2 text-xs text-text-muted">
        Admin accounts are created from the API project with{" "}
        <span className="font-medium">npm run create-admin</span>. There is no
        sign-up.
      </p>
    </form>
  );
}
