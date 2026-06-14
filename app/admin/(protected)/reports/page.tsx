import { UserRole } from "@prisma/client";
import { BranchPerformanceChart } from "@/components/admin/reports/branch-performance-chart";
import { BookingTrendChart } from "@/components/admin/reports/booking-trend-chart";
import { ExportButtons } from "@/components/admin/reports/export-buttons";
import { MetricCard } from "@/components/admin/reports/metric-card";
import { PaymentSummaryChart } from "@/components/admin/reports/payment-summary-chart";
import { ReportFilterBar } from "@/components/admin/reports/report-filter-bar";
import { RevenueTrendChart } from "@/components/admin/reports/revenue-trend-chart";
import { RoomPerformanceTable } from "@/components/admin/reports/room-performance-table";
import { TodayOperationsPanel } from "@/components/admin/reports/today-operations-panel";
import { PageHeader } from "@/components/admin/page-header";
import { RoleAccessNote } from "@/components/admin/role-access-note";
import { StatusBadge } from "@/components/admin/status-badge";
import { requireAdmin } from "@/lib/auth";
import {
  getBookingTrend,
  getBranchPerformance,
  getDashboardOverview,
  getPaymentSummary,
  getReportScopeForAdmin,
  getRevenueTrend,
  getRoomPerformance,
  getTodayOperations,
} from "@/lib/admin/reports";
import { formatCurrency, formatPercent } from "@/lib/formatters";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { reportFilterSchema } from "@/lib/validations/reports";

type AdminReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminReportsPage({
  searchParams,
}: AdminReportsPageProps) {
  const adminUser = await requireAdmin();
  const params = await searchParams;
  const parsed = reportFilterSchema.safeParse({
    branchId: typeof params.branchId === "string" ? params.branchId : undefined,
    fromDate: typeof params.fromDate === "string" ? params.fromDate : undefined,
    toDate: typeof params.toDate === "string" ? params.toDate : undefined,
    preset: typeof params.preset === "string" ? params.preset : "LAST_30_DAYS",
  });

  const filters = parsed.success ? parsed.data : { preset: "LAST_30_DAYS" as const };
  const [branches, scope, overview, bookingTrend, revenueTrend, paymentSummary, roomPerformance, branchPerformance, todayOperations] =
    await Promise.all([
      getActiveBranchSummaries(),
      getReportScopeForAdmin(adminUser, filters),
      getDashboardOverview(adminUser, filters),
      getBookingTrend(adminUser, filters),
      getRevenueTrend(adminUser, filters),
      getPaymentSummary(adminUser, filters),
      getRoomPerformance(adminUser, filters),
      getBranchPerformance(adminUser, filters),
      getTodayOperations(adminUser, filters),
    ]);

  const revenueRestricted = adminUser.role === UserRole.RECEPTIONIST;
  const exportFilters = {
    ...filters,
    branchId: scope.selectedBranchId ?? filters.branchId,
    fromDate: scope.dateRange.fromDateInput,
    toDate: scope.dateRange.toDateInput,
    preset: scope.dateRange.preset,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Reports and Dashboard"
        description="Monitor bookings, revenue, occupancy, and branch performance."
        actions={<ExportButtons filters={exportFilters} />}
      />

      <RoleAccessNote
        role={adminUser.role}
        hasAssignedBranch={Boolean(adminUser.branchId)}
      />

      <ReportFilterBar
        filters={{
          ...filters,
          branchId: scope.selectedBranchId ?? filters.branchId,
          fromDate: scope.dateRange.fromDateInput,
          toDate: scope.dateRange.toDateInput,
          preset: scope.dateRange.preset,
        }}
        branches={branches}
        isSuperAdmin={adminUser.role === UserRole.SUPER_ADMIN}
        lockedBranchName={adminUser.branch?.name ?? null}
      />

      <div className="surface-card flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Current Scope
          </p>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {scope.scopeLabel} | {scope.dateRange.fromDateInput} to {scope.dateRange.toDateInput}
          </p>
        </div>
        <StatusBadge label={scope.scopeLabel} tone="primary" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total Bookings" value={String(overview.totalBookings)} />
        <MetricCard label="Confirmed" value={String(overview.confirmedBookings)} tone="success" />
        <MetricCard label="Cancelled" value={String(overview.cancelledBookings)} tone="danger" />
        <MetricCard label="Occupancy Rate" value={formatPercent(overview.occupancyRate)} />
        {!revenueRestricted ? (
          <>
            <MetricCard label="Paid Revenue" value={formatCurrency(overview.paidRevenue)} tone="success" />
            <MetricCard label="Pending Revenue" value={formatCurrency(overview.pendingRevenue)} tone="warning" />
            <MetricCard label="Unpaid Revenue" value={formatCurrency(overview.unpaidRevenue)} />
            <MetricCard label="Pending Payments" value={String(overview.pendingPayments)} />
          </>
        ) : (
          <div className="surface-card px-6 py-6 md:col-span-2 xl:col-span-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Revenue Access
            </p>
            <p className="mt-4 text-base leading-8 text-muted-foreground">
              Revenue access is restricted to management roles.
            </p>
          </div>
        )}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="surface-card px-6 py-6">
          <h2 className="text-2xl font-semibold">Booking Trend</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Booking volume, confirmations, and cancellations across the selected period.
          </p>
          <div className="mt-6">
            <BookingTrendChart data={bookingTrend} />
          </div>
        </section>

        {!revenueRestricted ? (
          <section className="surface-card px-6 py-6">
            <h2 className="text-2xl font-semibold">Revenue Trend</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Paid and pending revenue across the selected period.
            </p>
            <div className="mt-6">
              <RevenueTrendChart data={revenueTrend} />
            </div>
          </section>
        ) : null}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {!revenueRestricted ? (
          <section className="surface-card px-6 py-6">
            <h2 className="text-2xl font-semibold">Payment Summary</h2>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              Payment state totals and value distribution.
            </p>
            <div className="mt-6">
              <PaymentSummaryChart data={paymentSummary} />
            </div>
          </section>
        ) : null}

        <section className="surface-card px-6 py-6">
          <h2 className="text-2xl font-semibold">Branch Performance</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            Compare bookings and occupancy across visible branches.
          </p>
          <div className="mt-6">
            <BranchPerformanceChart data={branchPerformance} />
          </div>
        </section>
      </div>

      <section className="surface-card px-6 py-6">
        <h2 className="text-2xl font-semibold">Room Performance</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          See which rooms are generating the most bookings and paid revenue.
        </p>
        <div className="mt-6">
          <RoomPerformanceTable rows={roomPerformance} />
        </div>
      </section>

      <section className="surface-card px-6 py-6">
        <h2 className="text-2xl font-semibold">Today&apos;s Operations</h2>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          Arrivals, checkouts, pending payments, and guests currently checked in.
        </p>
        <div className="mt-6">
          <TodayOperationsPanel operations={todayOperations} />
        </div>
      </section>
    </div>
  );
}
