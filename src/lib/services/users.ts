import { api } from "@/lib/api";
import type { PayoutRecord, User, UserDetail, UserStatus } from "@/types";

/** Tabs above the users table map to a backend `role` filter. */
export type UserFilter = "all" | "clients" | "barbers";

export interface UserQuery {
  filter?: UserFilter;
  search?: string;
}

/**
 * Users data access. Filtering and searching happen server-side so the table
 * stays correct as the platform grows past what one page can hold.
 */
export const usersService = {
  async list({ filter = "all", search = "" }: UserQuery = {}): Promise<User[]> {
    const { data } = await api.get<User[]>("/admin/users", {
      params: { filter, search },
    });
    return data;
  },

  /** Full profile plus booking history counts, for the detail drawer. */
  async get(userId: string): Promise<UserDetail> {
    const { data } = await api.get<UserDetail>(`/admin/users/${userId}`);
    return data;
  },

  async getPayouts(userId: string): Promise<PayoutRecord[]> {
    const { data } = await api.get<PayoutRecord[]>(
      `/admin/users/${userId}/payouts`,
    );
    return data;
  },

  async updateStatus(userId: string, status: UserStatus): Promise<void> {
    await api.patch(`/admin/users/${userId}`, { status });
  },
};
