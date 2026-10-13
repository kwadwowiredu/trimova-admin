import { api } from "@/lib/api";
import type {
  FlagsPage,
  FlagStatus,
  ModerationAction,
  NotificationsPage,
  PlatformSettings,
  ReviewsPage,
  AnnouncementAudience,
} from "@/types";

/** Suspicious-activity queue. */
export const securityService = {
  async list(status: FlagStatus | "all" = "pending"): Promise<FlagsPage> {
    const { data } = await api.get<FlagsPage>("/admin/flags", { params: { status } });
    return data;
  },

  /** Run the detector now rather than waiting for the next pass. */
  async scan(): Promise<{ created: number; open: number }> {
    const { data } = await api.post<{ created: number; open: number }>("/admin/flags/scan");
    return data;
  },

  async resolve(id: string, status: FlagStatus, note?: string): Promise<void> {
    await api.patch(`/admin/flags/${id}`, { status, note });
  },
};

/** Reported-review queue. */
export const moderationService = {
  async list(filter: "reported" | "hidden" | "all" = "reported"): Promise<ReviewsPage> {
    const { data } = await api.get<ReviewsPage>("/admin/reviews", { params: { filter } });
    return data;
  },

  async moderate(id: string, action: ModerationAction, reason?: string): Promise<void> {
    await api.patch(`/admin/reviews/${id}`, { action, reason });
  },
};

/** Platform configuration. */
export const settingsService = {
  async get(): Promise<PlatformSettings> {
    const { data } = await api.get<PlatformSettings>("/admin/settings");
    return data;
  },

  /** Returns the saved settings, so the form re-seeds from the server. */
  async save(patch: Partial<PlatformSettings>): Promise<PlatformSettings> {
    const { data } = await api.put<PlatformSettings>("/admin/settings", patch);
    return data;
  },
};

/** What the platform has been telling people, and broadcasting to them. */
export const notificationsService = {
  async list(type = "all"): Promise<NotificationsPage> {
    const { data } = await api.get<NotificationsPage>("/admin/notifications", {
      params: { type },
    });
    return data;
  },

  async announce(payload: {
    audience: AnnouncementAudience;
    title: string;
    body: string;
    targetUserId?: string;
  }): Promise<{ recipients: number }> {
    const { data } = await api.post<{ recipients: number }>(
      "/admin/notifications/announce",
      payload,
    );
    return data;
  },
};
