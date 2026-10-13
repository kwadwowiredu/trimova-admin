"use client";

import { useMemo, useState } from "react";
import { Search, Eye, Ban, RotateCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Avatar } from "@/components/ui/Avatar";
import { Tabs, type TabItem } from "@/components/ui/Tabs";
import { DropdownMenu, type MenuAction } from "@/components/ui/DropdownMenu";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableWrapper,
} from "@/components/ui/Table";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { UserDrawer } from "./UserDrawer";
import { BARBER_ROLES } from "@/lib/labels";
import { usersService, type UserFilter } from "@/lib/services/users";
import { formatJoinDate } from "@/lib/format";
import type { User, UserStatus } from "@/types";

const TABS: readonly TabItem<UserFilter>[] = [
  { value: "all", label: "All Users" },
  { value: "clients", label: "Clients" },
  { value: "barbers", label: "Barbers" },
];

interface UsersDirectoryProps {
  initialUsers: User[];
}

/**
 * Users directory: tabbed segmented filter, search, data table and the row
 * detail drawer. Filtering runs client-side over the already-fetched list so
 * the tabs feel instant; swap to a server round-trip via usersService.list()
 * once the directory outgrows a single page.
 */
export function UsersDirectory({ initialUsers }: UsersDirectoryProps) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [filter, setFilter] = useState<UserFilter>("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<User | null>(null);

  const visible = useMemo(() => {
    const needle = search.trim().toLowerCase();
    return users.filter((user) => {
      const byRole =
        filter === "all"
          ? true
          : filter === "clients"
            ? user.role === "client"
            : BARBER_ROLES.includes(user.role);

      const bySearch =
        !needle ||
        user.full_name.toLowerCase().includes(needle) ||
        user.id.toLowerCase().includes(needle) ||
        user.email.toLowerCase().includes(needle);

      return byRole && bySearch;
    });
  }, [users, filter, search]);

  /** Optimistic status flip — the service is a no-op while mocks are on. */
  const handleStatusChange = (userId: string, status: UserStatus) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === userId ? { ...user, status } : user)),
    );
    void usersService.updateStatus(userId, status);
  };

  const actionsFor = (user: User): MenuAction[] => [
    {
      label: "View details",
      icon: <Eye size={15} />,
      onSelect: () => setSelected(user),
    },
    user.status === "suspended"
      ? {
          label: "Reinstate",
          icon: <RotateCcw size={15} />,
          onSelect: () => handleStatusChange(user.id, "active"),
        }
      : {
          label: "Suspend",
          icon: <Ban size={15} />,
          tone: "danger" as const,
          onSelect: () => handleStatusChange(user.id, "suspended"),
        },
  ];

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs
          aria-label="Filter users by role"
          items={TABS}
          value={filter}
          onChange={setFilter}
        />
        <Input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or ID..."
          aria-label="Search users"
          icon={<Search size={15} />}
          className="sm:w-80"
        />
      </div>

      <Card className="overflow-hidden">
        <TableWrapper>
          <Table>
            <TableHead>
              <tr>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Join Date</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell className="text-right">Actions</TableHeaderCell>
              </tr>
            </TableHead>

            <TableBody>
              {visible.length === 0 ? (
                <TableEmpty
                  colSpan={5}
                  message="No users match this filter or search."
                />
              ) : (
                visible.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => setSelected(user)}
                        className="flex items-center gap-3 text-left"
                      >
                        <Avatar
                          name={user.full_name}
                          src={user.avatar_url}
                          size={38}
                        />
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-text">
                            {user.full_name}
                          </span>
                          <span className="block truncate text-xs text-text-muted">
                            ID: #{user.id}
                          </span>
                        </span>
                      </button>
                    </TableCell>

                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>

                    <TableCell className="whitespace-nowrap text-text">
                      {formatJoinDate(user.created_at)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={user.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu
                        label={`Actions for ${user.full_name}`}
                        actions={actionsFor(user)}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableWrapper>
      </Card>

      <UserDrawer
        user={selected}
        onClose={() => setSelected(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
