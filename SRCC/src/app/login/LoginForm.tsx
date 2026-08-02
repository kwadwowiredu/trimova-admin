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

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" isLoading={pending}>
      {pending ? "Signing in…" : "Sign in"}
    </Button>
  );
}

export function LoginForm() {
  const router = useRouter();
  const [state, formAction] = useFormState<LoginResult | null, FormData>(
    loginAction,
    null,
  );

  // React to the server action result: store token + route, or redirect to 403.
  useEffect(() => {
    if (!state) return;
    if (state.forbidden) {
      router.replace(ROUTES.forbidden);
      return;
    }
    if (state.ok && state.token) {
      tokenStore.set(state.token);
      router.replace(ROUTES.dashboard);
      router.refresh();
    }
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
          placeholder="admin@trimova.com"
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

      <SubmitButton />

      <p className="rounded-btn bg-surface-alt px-3 py-2 text-xs text-text-muted">
        Demo credentials · <span className="font-medium">admin@trimova.com</span>{" "}
        / <span className="font-medium">trimova123</span>
      </p>
    </form>
  );
}
