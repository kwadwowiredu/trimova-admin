"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, USE_MOCKS, ROUTES } from "@/lib/constants";
import { createSessionCookie } from "@/lib/auth";
import { MOCK_ACCOUNTS, type AuthCandidate } from "@/lib/mocks/auth";
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

/**
 * Authenticate an admin. While USE_MOCKS is on this checks the mock directory;
 * otherwise it should POST to `${NEXT_PUBLIC_API_URL}/auth/login` and read the
 * returned JWT + user. Only accounts with role === "admin" get a session.
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

  let session: AuthCandidate | null = null;
  let token = "";

  if (USE_MOCKS) {
    const account = MOCK_ACCOUNTS[email];
    if (!account || account.password !== password) {
      return { ok: false, error: "Invalid email or password." };
    }
    session = account.session;
    token = `mock.${Buffer.from(email).toString("base64url")}`;
  } else {
    // --- Real backend integration (swap in when API is live) ---
    // const { data } = await api.post("/auth/login", { email, password });
    // session = data.user; token = data.token;
    return {
      ok: false,
      error: "Live backend is not configured. Set NEXT_PUBLIC_USE_MOCKS=true.",
    };
  }

  // Role constraint: only admins are allowed past the gate.
  if (session.role !== "admin") {
    return { ok: false, forbidden: true };
  }

  const { value, maxAge } = createSessionCookie(session as AdminSession);
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
