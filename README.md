# Trimova Admin Panel

Internal web admin panel for the **Trimova** barbershop & mobile-barber marketplace
(Ghana). Built with **Next.js 14 (App Router) + TypeScript + Tailwind CSS**, designed
to plug into the same Node/Express + Supabase backend that powers the React Native
mobile apps.

> ⚠️ **Node.js is required and was not detected on this machine.** Install Node 18.18+
> (or 20 LTS) from <https://nodejs.org>, then run the commands below.

## Getting started

```bash
cd "final year project/trimova-admin"
npm install
cp .env.example .env.local   # then fill in real values (mock mode works out of the box)
npm run dev                  # http://localhost:3000
```

### Demo login (mock mode)

`NEXT_PUBLIC_USE_MOCKS=true` ships in `.env.local`, so you can sign in immediately:

| Role  | Email                | Password     | Result                       |
| ----- | -------------------- | ------------ | ---------------------------- |
| Admin | `admin@trimova.com`  | `trimova123` | Full access to the dashboard |
| Non-admin | `client@trimova.com` | `trimova123` | Bounced to **/403** (guard demo) |

## Design system

All colours/tokens come from `TRIMOVA_THEME` (`src/theme/theme.ts`) and are mirrored
in three places that stay in sync:

- `src/theme/theme.ts` — JS object (use in Recharts, inline styles).
- `tailwind.config.ts` — utilities (`bg-accent`, `text-text-muted`, `border-border`…).
- `src/theme/globals.css` — CSS custom properties (`var(--accent)`).

## Project structure

```
src/
  app/                     # App Router routes, layouts, server actions
    actions/auth.ts        # login / logout server actions
    login/                 # standalone auth gate (+ LoginForm client)
    403/                   # forbidden page (non-admin redirect target)
    (admin)/               # auth-guarded group with persistent sidebar shell
      layout.tsx           # server-side admin role guard
      dashboard/           # real-time platform-health dashboard
      users|finance|security|moderation|settings/   # built next
  components/
    ui/                    # Button, Card, Badge, Avatar, Input
    common/                # Sidebar, Topbar, AppShell, ModulePlaceholder
    dashboard/             # KpiGrid, TrendChart, LiveActivityFeed, UrgentFlags
  hooks/                   # useInterval (+ future data/UI hooks)
  lib/
    api.ts                 # global Axios instance + JWT request interceptor
    auth.ts                # signed session cookie helpers (server-only)
    services/              # typed data access (mock ↔ real API switch)
    mocks/                 # in-repo mock data
    constants.ts format.ts cn.ts token.ts
  theme/                   # theme.ts + globals.css
  types/                   # snake_case models matching the shared backend schema
  middleware.ts            # edge route guard (cookie presence)
```

## Backend integration

- **Env:** `NEXT_PUBLIC_API_URL`, `SUPABASE_URL`, `SUPABASE_ANON_KEY` mirror the
  mobile client's server parameters.
- **Types:** `src/types/*` use exact snake_case fields (`appointment_id`,
  `client_id`, `barber_id`, `shop_id`, `status`, …) to match the unified models.
- **API client:** `src/lib/api.ts` is a shared Axios instance whose request
  interceptor attaches the active admin JWT (`Authorization: Bearer …`).
- **Switching off mocks:** set `NEXT_PUBLIC_USE_MOCKS=false` and point
  `NEXT_PUBLIC_API_URL` at the live API. The service layer (`src/lib/services/*`)
  already branches on this flag — UI code doesn't change.

## What's implemented

- ✅ Foundation: workspace, theme system, types, Axios + JWT client, env config.
- ✅ Auth gate: login screen, signed-cookie session, server-side `role === "admin"`
  guard, `/403` redirect, logout.
- ✅ Real-time dashboard: 5 KPI cards, booking-velocity/revenue chart with
  30/90/yearly toggle, live activity feed, urgent-flags widget.
- ✅ Users directory: All / Clients / Barbers tabs, name+ID search, role and
  status pills, row action menu, and a detail drawer with payout history.
- ✅ Finance pipeline: funds-held / transfers / refunds cards with meters, the
  global transaction log (search, status filter, pagination, Process Refund),
  and the manual-entry panel behind the floating action button.
- ✅ Responsive shell: the sidebar collapses to a hamburger drawer below `lg`,
  and wide tables scroll inside their own container.

## Built next (per AGENTS.md)

Suspicious-activity panel · Moderation queue · Settings configuration engine.
