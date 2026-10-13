import { api } from "@/lib/api";
import type { AdminBooking, AdminBookingDetail, Paginated } from "@/types";

export const BOOKINGS_PAGE_SIZE = 10;

export interface BookingQuery {
  page?: number;
  page_size?: number;
  /** Comma-separated statuses, or "all". */
  status?: string;
  search?: string;
}

/**
 * Every appointment on the platform. The activity feed tells an admin that
 * something happened; this is how they find out exactly what — who booked
 * whom, for how much, and where the money ended up.
 */
export const bookingsService = {
  async list({
    page = 1,
    page_size = BOOKINGS_PAGE_SIZE,
    status = "all",
    search = "",
  }: BookingQuery = {}): Promise<Paginated<AdminBooking>> {
    const { data } = await api.get<Paginated<AdminBooking>>("/admin/bookings", {
      params: { page, page_size, status, search },
    });
    return data;
  },

  /** One booking, with its full transaction trail attached. */
  async get(bookingId: string): Promise<AdminBookingDetail> {
    const { data } = await api.get<AdminBookingDetail>(
      `/admin/bookings/${bookingId}`,
    );
    return data;
  },
};
