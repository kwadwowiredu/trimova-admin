import { LoginForm } from "./LoginForm";

/**
 * Standalone authentication gate. Server-side middleware already bounces
 * authenticated admins away from here; unauthenticated users land on this
 * split-panel sign-in screen.
 */
export default function LoginPage() {
  return (
    <main className="flex min-h-screen">
      {/* Brand panel */}
      <section className="relative hidden w-1/2 flex-col justify-between bg-accent p-12 text-white lg:flex">
        <span className="text-2xl font-bold">Trimova Admin</span>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Platform health,
            <br />
            in real time.
          </h2>
          <p className="mt-4 max-w-md text-sm text-white/80">
            Monitor bookings, manage users, oversee Paystack escrow and refunds,
            and keep the marketplace safe — all from one console.
          </p>
        </div>
        <p className="text-xs text-white/60">
          Restricted access · Authorized administrators only
        </p>
      </section>

      {/* Form panel */}
      <section className="flex w-full items-center justify-center bg-bg px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <span className="text-xl font-bold text-accent lg:hidden">
              Trimova Admin
            </span>
            <h1 className="mt-2 text-2xl font-bold text-text">Welcome back</h1>
            <p className="mt-1 text-sm text-text-muted">
              Sign in to the administrator console.
            </p>
          </div>
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
