/** App-wide constants. Kept in one place for easy backend syncing. */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

/** Cookie that carries the admin JWT session. Read by middleware + server. */
export const SESSION_COOKIE = "trimova_admin_session";

/** localStorage key holding the raw admin JWT for the Axios interceptor. */
export const TOKEN_STORAGE_KEY = "trimova_admin_token";

/** Toggle that swaps real API calls for in-repo mock data. */
export const USE_MOCKS = process.env.NEXT_PUBLIC_USE_MOCKS !== "false";

export const ROUTES = {
  login: "/login",
  forbidden: "/403",
  dashboard: "/dashboard",
  users: "/users",
  finance: "/finance",
  security: "/security",
  moderation: "/moderation",
  settings: "/settings",
} as const;
