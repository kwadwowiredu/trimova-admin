import { serverGet, ApiError } from "@/lib/serverApi";
import { SecurityQueue } from "@/components/security/SecurityQueue";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { FlagsPage } from "@/types";

// The queue changes as the detector runs — never cache it.
export const dynamic = "force-dynamic";

export default async function SecurityPage() {
  let page: FlagsPage;
  try {
    page = await serverGet<FlagsPage>("/admin/flags", { status: "pending" });
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return <SecurityQueue initialPage={page} />;
}
