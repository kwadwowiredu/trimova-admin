import type { PayoutRecord, User, UserRole, UserStatus } from "@/types";

const daysAgo = (d: number) => new Date(Date.now() - d * 86_400_000).toISOString();

/**
 * In-repo user directory used while NEXT_PUBLIC_USE_MOCKS=true. Field shapes
 * match the unified `users` table so swapping in the real endpoint is a
 * one-line change in src/lib/services/users.ts.
 */
export const MOCK_USERS: User[] = [
  {
    id: "TR-9921",
    full_name: "Julian Rossi",
    email: "julian.rossi@example.com",
    phone: "+233 20 114 8890",
    role: "barber",
    status: "active",
    avatar_url: "https://i.pravatar.cc/80?img=12",
    rating: 4.8,
    created_at: "2023-10-12T09:15:00Z",
    updated_at: daysAgo(3),
  },
  {
    id: "TR-8842",
    full_name: "Elena Vance",
    email: "elena.vance@example.com",
    phone: "+233 24 778 1204",
    role: "client",
    status: "active",
    avatar_url: "https://i.pravatar.cc/80?img=47",
    rating: null,
    created_at: "2023-11-03T14:40:00Z",
    updated_at: daysAgo(1),
  },
  {
    id: "TR-7210",
    full_name: "Marcus Thorne",
    email: "marcus.thorne@example.com",
    phone: "+233 55 902 3317",
    role: "barber",
    status: "suspended",
    avatar_url: "https://i.pravatar.cc/80?img=33",
    rating: 3.2,
    created_at: "2024-01-15T08:05:00Z",
    updated_at: daysAgo(9),
  },
  {
    id: "TR-6634",
    full_name: "Kwame Mensah",
    email: "kwame.mensah@example.com",
    phone: "+233 27 445 6621",
    role: "client",
    status: "active",
    avatar_url: "https://i.pravatar.cc/80?img=15",
    rating: null,
    created_at: "2024-02-08T11:25:00Z",
    updated_at: daysAgo(2),
  },
  {
    id: "TR-5518",
    full_name: "Abena Boateng",
    email: "abena.boateng@example.com",
    phone: "+233 20 663 0098",
    role: "barber",
    status: "pending",
    avatar_url: "https://i.pravatar.cc/80?img=44",
    rating: 4.4,
    created_at: "2024-03-21T16:50:00Z",
    updated_at: daysAgo(5),
  },
  {
    id: "TR-4402",
    full_name: "Daniel Owusu",
    email: "daniel.owusu@example.com",
    phone: "+233 50 221 7745",
    role: "client",
    status: "inactive",
    avatar_url: "https://i.pravatar.cc/80?img=68",
    rating: null,
    created_at: "2024-04-02T10:10:00Z",
    updated_at: daysAgo(21),
  },
  {
    id: "TR-3390",
    full_name: "Sarah Adjei",
    email: "sarah.adjei@example.com",
    phone: "+233 24 330 9912",
    role: "staff_barber",
    status: "active",
    avatar_url: "https://i.pravatar.cc/80?img=25",
    rating: 4.9,
    created_at: "2024-05-19T13:30:00Z",
    updated_at: daysAgo(4),
  },
  {
    id: "TR-2287",
    full_name: "Esi Asante",
    email: "esi.asante@example.com",
    phone: "+233 27 118 4456",
    role: "client",
    status: "active",
    avatar_url: "https://i.pravatar.cc/80?img=31",
    rating: null,
    created_at: "2024-06-27T07:45:00Z",
    updated_at: daysAgo(6),
  },
];

/** Payout history rendered in the barber detail drawer. */
export const MOCK_PAYOUTS: Record<string, PayoutRecord[]> = {
  "TR-9921": [
    {
      id: "pay-1",
      barber_id: "TR-9921",
      amount: 2400,
      status: "paid",
      reference: "PSK_8842019X",
      created_at: daysAgo(4),
    },
    {
      id: "pay-2",
      barber_id: "TR-9921",
      amount: 1850,
      status: "paid",
      reference: "PSK_8790233A",
      created_at: daysAgo(11),
    },
    {
      id: "pay-3",
      barber_id: "TR-9921",
      amount: 960,
      status: "pending",
      reference: "PSK_8712994C",
      created_at: daysAgo(18),
    },
  ],
  "TR-7210": [
    {
      id: "pay-4",
      barber_id: "TR-7210",
      amount: 540,
      status: "failed",
      reference: "PSK_7621880B",
      created_at: daysAgo(9),
    },
  ],
  "TR-5518": [
    {
      id: "pay-5",
      barber_id: "TR-5518",
      amount: 1320,
      status: "paid",
      reference: "PSK_6650123D",
      created_at: daysAgo(7),
    },
  ],
  "TR-3390": [
    {
      id: "pay-6",
      barber_id: "TR-3390",
      amount: 3100,
      status: "paid",
      reference: "PSK_5540771E",
      created_at: daysAgo(2),
    },
  ],
};

/** Roles that the "Barbers" tab collapses into one filter. */
export const BARBER_ROLES: readonly UserRole[] = ["barber", "staff_barber"];

/** Human labels for the role pill in the table. */
export const ROLE_LABELS: Record<UserRole, string> = {
  client: "Client",
  barber: "Barber",
  staff_barber: "Staff Barber",
  admin: "Admin",
};

/** Human labels for the status pill in the table. */
export const STATUS_LABELS: Record<UserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending: "Pending",
  suspended: "Suspended",
};
