import { serverGet, ApiError } from "@/lib/serverApi";
import { SettingsForm } from "@/components/settings/SettingsForm";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { PlatformSettings } from "@/types";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  let settings: PlatformSettings;
  try {
    settings = await serverGet<PlatformSettings>("/admin/settings");
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return <SettingsForm initial={settings} />;
}
