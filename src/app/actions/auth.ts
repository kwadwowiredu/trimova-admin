"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { API_BASE_URL, SESSION_COOKIE, ROUTES } from "@/lib/constants";
import { createSessionCookie } from "@/lib/auth";
import type { AdminSession } from "@/types";

export interface LoginResult {
  ok: boolean;
  /** Field-level error message rendered under the form. */
  error?: string;
  /**
   * Set to true when credentials are valid but the account is NOT an admin.
   * The client redirects these to /403 to satisfy the role constraint.
   */
  forbidden?: boolean;
  /** Raw JWT for the browser Axios interceptor (localStorage). */
  token?: string;
}

interface LoginUser {
  id: string;
  fullName?: string;
  full_name?: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  avatar_url?: string | null;
}

/**
 * Authenticate an admin against the Trimova API.
 *
 * This runs on the server, so it uses fetch directly rather than the browser
 * Axios instance — there's no localStorage token to attach yet, and the
 * password must never travel through the client bundle.
 *
 * Admin accounts are created with `npm run create-admin` in the API project;
 * there is deliberately no admin sign-up anywhere.
 */
export async function loginAction(
  _prev: LoginResult | null,
  formData: FormData,
): Promise<LoginResult> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, error: "Email and password are required." };
  }

  let payload: { success?: boolean; message?: string; data?: { token: string; user: LoginUser } };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
    });
    payload = await res.json();

    if (!res.ok || !payload?.data) {
      return {
        ok: false,
        error: payload?.message ?? "Invalid email or password.",
      };
    }
  } catch {
    return {
      ok: false,
      error: "Couldn't reach the Trimova API. Check that it's running.",
    };
  }

  const { token, user } = payload.data;

  // Role constraint: only admins are allowed past the gate.
  if (user.role !== "admin") {
    return { ok: false, forbidden: true };
  }

  // The API answers in camelCase; the panel's types are snake_case.
  const session: AdminSession = {
    id: user.id,
    full_name: user.fullName ?? user.full_name ?? user.email,
    email: user.email,
    role: "admin",
    avatar_url: user.avatarUrl ?? user.avatar_url ?? null,
  };

  // The API token rides inside the httpOnly cookie so server components can
  // call guarded endpoints; the browser gets its own copy for Axios.
  const { value, maxAge } = createSessionCookie(session, token);
  cookies().set(SESSION_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  return { ok: true, token };
}

/** Clear the session cookie and bounce back to /login. */
export async function logoutAction(): Promise<void> {
  cookies().delete(SESSION_COOKIE);
  redirect(ROUTES.login);
}
