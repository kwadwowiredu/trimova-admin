import { api } from "@/lib/api";
import { USE_MOCKS } from "@/lib/constants";
import { BARBER_ROLES, MOCK_PAYOUTS, MOCK_USERS } from "@/lib/mocks/users";
import type { PayoutRecord, User, UserStatus } from "@/types";

/** Tabs above the users table map to a backend `role` filter. */
export type UserFilter = "all" | "clients" | "barbers";

export interface UserQuery {
  filter?: UserFilter;
  search?: string;
}

function matchesFilter(user: User, filter: UserFilter): boolean {
  if (filter === "clients") return user.role === "client";
  if (filter === "barbers") return BARBER_ROLES.includes(user.role);
  return true;
}

function matchesSearch(user: User, search: string): boolean {
  if (!search) return true;
  const needle = search.trim().toLowerCase();
  return (
    user.full_name.toLowerCase().includes(needle) ||
    user.id.toLowerCase().includes(needle) ||
    user.email.toLowerCase().includes(needle)
  );
}

/**
 * Users data access. Components call these instead of touching Axios or the
 * mock files directly, so flipping NEXT_PUBLIC_USE_MOCKS to "false" points the
 * whole module at the live Express endpoints with no UI changes.
 */
export const usersService = {
  async list({ filter = "all", search = "" }: UserQuery = {}): Promise<User[]> {
    if (USE_MOCKS) {
      return MOCK_USERS.filter(
        (user) => matchesFilter(user, filter) && matchesSearch(user, search),
      );
    }
    const { data } = await api.get<User[]>("/admin/users", {
      params: { filter, search },
    });
    return data;
  },

  async getPayouts(userId: string): Promise<PayoutRecord[]> {
    if (USE_MOCKS) return MOCK_PAYOUTS[userId] ?? [];
    const { data } = await api.get<PayoutRecord[]>(
      `/admin/users/${userId}/payouts`,
    );
    return data;
  },

  async updateStatus(userId: string, status: UserStatus): Promise<void> {
    if (USE_MOCKS) return;
    await api.patch(`/admin/users/${userId}`, { status });
  },
};
