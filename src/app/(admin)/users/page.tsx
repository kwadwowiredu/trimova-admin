import { serverGet, ApiError } from "@/lib/serverApi";
import { UsersDirectory } from "@/components/users/UsersDirectory";
import { ApiErrorState } from "@/components/common/ApiErrorState";
import type { User } from "@/types";

// The directory reflects live suspensions/registrations — never cache it.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  let users: User[];
  try {
    users = await serverGet<User[]>("/admin/users");
  } catch (err) {
    return (
      <ApiErrorState
        message={err instanceof ApiError ? err.message : "Something went wrong."}
      />
    );
  }

  return <UsersDirectory initialUsers={users} />;
}
