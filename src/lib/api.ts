import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";
import { API_BASE_URL } from "./constants";
import { tokenStore } from "./token";

/**
 * Global Axios instance shared by the whole admin panel.
 *
 * Request interceptor  → automatically attaches the active admin JWT.
 * Response interceptor  → normalises errors and clears the token on 401 so the
 *                          UI can bounce the admin back to /login.
 *
 * Components never import axios directly — they call the typed functions in
 * src/lib/services/* which use this instance.
 */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStore.get();
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

export interface NormalizedApiError {
  status: number;
  message: string;
}

/**
 * The Express backend wraps every successful payload in an envelope:
 *
 *     { success: true, data: <payload>, message?: string }
 *
 * The mobile apps rely on that shape, so rather than special-casing /admin
 * routes on the server we unwrap it here. Services keep writing the natural
 * `const { data } = await api.get<User[]>("/admin/users")` and receive the
 * payload itself, exactly as the mocks return it.
 *
 * Responses that aren't enveloped (or any future non-JSON body) pass through
 * untouched.
 */
function isEnvelope(body: unknown): body is { success: boolean; data: unknown } {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    "data" in body
  );
}

api.interceptors.response.use(
  (response) => {
    if (isEnvelope(response.data)) {
      response.data = response.data.data;
    }
    return response;
  },
  (error: AxiosError<{ message?: string }>) => {
    const status = error.response?.status ?? 0;

    // Token expired / unauthenticated — drop the stale token client-side.
    if (status === 401) {
      tokenStore.clear();
    }

    const normalized: NormalizedApiError = {
      status,
      message:
        error.response?.data?.message ??
        error.message ??
        "Something went wrong. Check your connection and try again.",
    };
    return Promise.reject(normalized);
  },
);
