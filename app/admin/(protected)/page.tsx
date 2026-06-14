import Link from "next/link";
import { UserRole } from "@prisma/client";
import { MetricCard } from "@/components/admin/reports/metric-card";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { requireAdmin } from "@/lib/auth";
import { getDashboardOverview, getTodayOperations } from "@/lib/admin/reports";
import { formatCurrency, formatPercent } from "@/lib/formatters";

export default async function AdminDashboardPage() {
  const adminUser = await requireAdmin();
  const revenueRestricted = adminUser.role === UserRole.RECEPTIONIST;

  const [overview, operations] = await Promise.all([
    getDashboardOverview(adminUser, { preset: "THIS_MONTH" }),
    getTodayOperations(adminUser),
  ]);

  return (
    <section className="space-y-6">
      <PageHeader
        eyebrow="Dashboard"
        title={`Welcome, ${adminUser.fullName}`}
        description="Monitor current operational metrics, payment follow-up, arrivals, and occupancy from the admin home screen."
        actions={
          <div className="flex flex-wrap gap-3">
            <StatusBadge label={adminUser.role.replace("_", " ")} tone="primary" />
            <StatusBadge
              label={adminUser.branch?.name ?? "All Branches"}
              tone="muted"
            />
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Total Bookings" value={String(overview.totalBookings)} />
        <MetricCard label="Pending Payments" value={String(overview.pendingPayments)} tone="warning" />
        <MetricCard label="Today's Arrivals" value={String(overview.todaysArrivals)} />
        <MetricCard label="Occupancy Rate" value={formatPercent(overview.occupancyRate)} />
        {!revenueRestricted ? (
          <MetricCard label="Revenue This Month" value={formatCurrency(overview.paidRevenue)} tone="success" />
        ) : (
          <MetricCard
            label="Revenue This Month"
            value="Restricted"
            hint="Revenue access is restricted to management roles."
          />
        )}
        <MetricCard label="Checked In Now" value={String(operations.currentlyCheckedIn.length)} />
      </div>

      <div className="surface-card px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold">Quick Actions</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/admin/bookings">View Bookings</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/availability">Check Availability</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/rooms">Manage Rooms</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/reports">View Reports</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
