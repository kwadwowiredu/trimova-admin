import { usersService } from "@/lib/services/users";
import { UsersDirectory } from "@/components/users/UsersDirectory";

// The directory reflects live suspensions/registrations — never cache it.
export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await usersService.list();

  return <UsersDirectory initialUsers={users} />;
}
