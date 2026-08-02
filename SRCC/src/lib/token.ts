import { TOKEN_STORAGE_KEY } from "./constants";

/**
 * Browser-side admin JWT storage. The Axios interceptor reads from here to
 * attach the token to outbound requests. Server components read the token from
 * the httpOnly session cookie instead (see lib/auth.ts).
 */
export const tokenStore = {
  get(): string | null {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(TOKEN_STORAGE_KEY);
  },
  set(token: string): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(TOKEN_STORAGE_KEY, token);
  },
  clear(): void {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(TOKEN_STORAGE_KEY);
  },
};
