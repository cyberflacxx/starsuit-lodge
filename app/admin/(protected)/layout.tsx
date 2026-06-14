import Link from "next/link";
import { AdminNav } from "@/components/admin/admin-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { requireAdmin } from "@/lib/auth";
import type { AdminNavItem } from "@/types";

const navItems: AdminNavItem[] = [
  { label: "Dashboard", href: "/admin", icon: "dashboard" },
  { label: "Availability", href: "/admin/availability", icon: "availability" },
  { label: "Bookings", href: "/admin/bookings", icon: "bookings" },
  { label: "Reports", href: "/admin/reports", icon: "reports" },
  { label: "Content", href: "/admin/content", icon: "content" },
  { label: "Rooms", href: "/admin/rooms", icon: "rooms" },
  { label: "Branches", href: "/admin/branches", icon: "branches" },
  { label: "Payments", href: "/admin/payments", icon: "payments" },
  { label: "Notifications", href: "/admin/notifications", icon: "notifications" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

export default async function AdminProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adminUser = await requireAdmin();

  return (
    <div className="min-h-screen bg-muted">
      <div className="shell py-6">
        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className="surface-card h-fit px-5 py-6">
            <Link href="/admin" className="block">
              <p className="font-display text-2xl font-semibold text-primary">
                Starsuit Lodges Admin
              </p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Authenticated operations for Mutare and Chipinge.
              </p>
            </Link>

            <div className="mt-6 rounded-3xl bg-primary px-4 py-4 text-white">
              <p className="text-sm font-semibold">{adminUser.fullName}</p>
              <p className="mt-1 text-sm text-white/76">{adminUser.role}</p>
            </div>
            <AdminNav items={navItems} />
          </aside>

          <div className="space-y-6">
            <header className="surface-card flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                  Admin Console
                </p>
                <p className="mt-2 text-sm leading-7 text-muted-foreground">
                  Secure access is active through Supabase Auth and Prisma role checks.
                </p>
              </div>
              <LogoutButton />
            </header>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
