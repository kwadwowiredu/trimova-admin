import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants";

/** Entry point — middleware handles auth, so just forward to the dashboard. */
export default function RootPage() {
  redirect(ROUTES.dashboard);
}
