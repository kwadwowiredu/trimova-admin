import { serverGet, ApiError } from "@/lib/serverApi";
import { BookingsLog } from "@/components/bookings/BookingsLog";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import { BOOKINGS_PAGE_SIZE } from "@/lib/services/bookings";
import type { AdminBooking, Paginated } from "@/types";

// Appointments change minute to minute — always render fresh.
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  let page: Paginated<AdminBooking>;
  try {
    page = await serverGet<Paginated<AdminBooking>>("/admin/bookings", {
      page: 1,
      page_size: BOOKINGS_PAGE_SIZE,
    });
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-xl font-bold text-text">Bookings</h1>
        <span className="text-xs font-semibold text-text-muted">
          Every appointment on the platform
        </span>
      </div>

      <BookingsLog initialPage={page} />
    </div>
  );
}
