import { serverGet, ApiError } from "@/lib/serverApi";
import { ModerationQueue } from "@/components/moderation/ModerationQueue";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { ReviewsPage } from "@/types";

export const dynamic = "force-dynamic";

export default async function ModerationPage() {
  let page: ReviewsPage;
  try {
    page = await serverGet<ReviewsPage>("/admin/reviews", { filter: "reported" });
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return <ModerationQueue initialPage={page} />;
}
