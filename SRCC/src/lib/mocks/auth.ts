import type { AdminSession, UserRole } from "@/types";

/** A login candidate — role is widened to UserRole so the admin guard is real. */
export type AuthCandidate = Omit<AdminSession, "role"> & { role: UserRole };

interface MockAccount {
  password: string;
  session: AuthCandidate;
}

/**
 * Mock admin directory used while NEXT_PUBLIC_USE_MOCKS=true.
 * Replace with a real POST {NEXT_PUBLIC_API_URL}/auth/login call later.
 *
 *   email:    admin@trimova.com
 *   password: trimova123
 *
 * The "client" account below exists to demonstrate the role guard: logging in
 * with it is rejected (role !== "admin") and the UI routes it to /403.
 */
export const MOCK_ACCOUNTS: Record<string, MockAccount> = {
  "admin@trimova.com": {
    password: "trimova123",
    session: {
      id: "usr-admin-001",
      full_name: "John Doe",
      email: "admin@trimova.com",
      role: "admin",
      avatar_url: null,
    },
  },
  "client@trimova.com": {
    password: "trimova123",
    session: {
      id: "usr-client-001",
      full_name: "Ama Client",
      email: "client@trimova.com",
      role: "client",
      avatar_url: null,
    },
  },
};
