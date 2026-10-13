import "server-only";
import { cookies } from "next/headers";
import crypto from "node:crypto";
import { SESSION_COOKIE } from "./constants";
import type { AdminSession } from "@/types";

/**
 * Lightweight signed-cookie session for the admin panel.
 *
 * The cookie value is `base64url(payload).signature` where the signature is an
 * HMAC-SHA256 over the payload using ADMIN_SESSION_SECRET. This lets server
 * components and server actions verify the session without a round-trip.
 *
 * When the real backend is wired up, swap `verifySession` to verify a backend
 * JWT instead — the call sites (getAdminSession / requireAdmin) stay the same.
 */
const SECRET = process.env.ADMIN_SESSION_SECRET ?? "dev-insecure-secret";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

interface SessionPayload extends AdminSession {
  exp: number;
  /**
   * The API's own JWT, carried inside the httpOnly cookie so server components
   * can call guarded /admin endpoints. The browser keeps its own copy in
   * localStorage for the Axios interceptor; this one never reaches client JS.
   */
  token?: string;
}

function sign(data: string): string {
  return crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
}

export function createSessionCookie(
  session: AdminSession,
  apiToken?: string,
): {
  value: string;
  maxAge: number;
} {
  const payload: SessionPayload = {
    ...session,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
    ...(apiToken ? { token: apiToken } : {}),
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const value = `${encoded}.${sign(encoded)}`;
  return { value, maxAge: SESSION_TTL_SECONDS };
}

export function verifySession(value: string | undefined): AdminSession | null {
  if (!value) return null;
  const [encoded, signature] = value.split(".");
  if (!encoded || !signature) return null;

  // Constant-time signature check.
  const expected = sign(encoded);
  if (
    expected.length !== signature.length ||
    !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    if (payload.exp * 1000 < Date.now()) return null;
    if (payload.role !== "admin") return null;
    const { exp: _exp, token: _token, ...session } = payload;
    return session;
  } catch {
    return null;
  }
}

/** Read + verify the current admin session inside a server component/action. */
export function getAdminSession(): AdminSession | null {
  const value = cookies().get(SESSION_COOKIE)?.value;
  return verifySession(value);
}

/**
 * The API JWT for the signed-in admin, for server-side calls to /admin routes.
 * Returns null when the cookie is missing, expired, or tampered with — the
 * signature is checked before anything inside it is trusted.
 */
export function getApiToken(): string | null {
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySession(value)) return null;

  const encoded = value!.split(".")[0];
  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf8"),
    ) as SessionPayload;
    return payload.token ?? null;
  } catch {
    return null;
  }
}
