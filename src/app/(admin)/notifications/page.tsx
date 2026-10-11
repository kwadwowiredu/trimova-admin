import { serverGet, ApiError } from "@/lib/serverApi";
import { NotificationsPanel } from "@/components/notifications/NotificationsPanel";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { NotificationsPage } from "@/types";

export const dynamic = "force-dynamic";

export default async function NotificationsAdminPage() {
  let page: NotificationsPage;
  try {
    page = await serverGet<NotificationsPage>("/admin/notifications", { type: "all" });
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return <NotificationsPanel initialPage={page} />;
}
