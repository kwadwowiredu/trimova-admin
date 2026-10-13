import "server-only";
import { API_BASE_URL } from "./constants";
import { getApiToken } from "./auth";

/**
 * Server-side calls to the Trimova API.
 *
 * The browser's Axios instance reads its JWT from localStorage, which doesn't
 * exist while a server component renders — so server fetches take the token
 * from the httpOnly session cookie instead. Same API, same guard, just the
 * other half of the app.
 *
 * Client components should keep using `lib/services/*`, which go through Axios.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function serverGet<T>(
  path: string,
  params?: Record<string, string | number | undefined>,
): Promise<T> {
  const token = getApiToken();
  if (!token) throw new ApiError(401, "Your session has expired.");

  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params ?? {})) {
    if (value !== undefined && value !== "") query.set(key, String(value));
  }
  const qs = query.toString();

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}${qs ? `?${qs}` : ""}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Admin screens show live operational state; a cached page would be lying.
      cache: "no-store",
    });
  } catch {
    throw new ApiError(0, "Couldn't reach the Trimova API. Check that it's running.");
  }

  const body = (await res.json().catch(() => null)) as
    | { success?: boolean; data?: T; message?: string }
    | null;

  if (!res.ok || !body) {
    throw new ApiError(res.status, body?.message ?? "Something went wrong.");
  }
  // The API wraps payloads in { success, data } — unwrap so callers get the
  // shape their types describe.
  return (body.data ?? body) as T;
}
