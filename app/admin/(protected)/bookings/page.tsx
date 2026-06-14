import { UserRole } from "@prisma/client";
import { BookingsTable } from "@/components/admin/bookings/bookings-table";
import { BookingFilters } from "@/components/admin/bookings/booking-filters";
import { BookingStatsCards } from "@/components/admin/bookings/booking-stats-cards";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getBookingsForAdmin, getBookingStatsForAdmin } from "@/lib/admin/bookings";
import { getActiveBranchSummaries } from "@/lib/public-data";
import { bookingFilterSchema } from "@/lib/validations/admin-booking";

type AdminBookingsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminBookingsPage({
  searchParams,
}: AdminBookingsPageProps) {
  const adminUser = await requireAdmin();
  const params = await searchParams;

  const parsed = bookingFilterSchema.safeParse({
    branchId: typeof params.branchId === "string" ? params.branchId : undefined,
    status: typeof params.status === "string" ? params.status : undefined,
    paymentStatus:
      typeof params.paymentStatus === "string" ? params.paymentStatus : undefined,
    search: typeof params.search === "string" ? params.search : undefined,
    fromDate: typeof params.fromDate === "string" ? params.fromDate : undefined,
    toDate: typeof params.toDate === "string" ? params.toDate : undefined,
  });

  const filters = parsed.success ? parsed.data : {};

  const [stats, bookings, branches] = await Promise.all([
    getBookingStatsForAdmin(adminUser),
    getBookingsForAdmin(adminUser, filters),
    getActiveBranchSummaries(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Bookings"
        title="Booking Management"
        description="View, verify, and manage guest room bookings."
      />
      <BookingStatsCards stats={stats} />
      <BookingFilters
        branches={branches}
        isSuperAdmin={adminUser.role === UserRole.SUPER_ADMIN}
        values={{
          branchId: typeof filters.branchId === "string" ? filters.branchId : "",
          status: typeof filters.status === "string" ? filters.status : "",
          paymentStatus:
            typeof filters.paymentStatus === "string" ? filters.paymentStatus : "",
          search: typeof filters.search === "string" ? filters.search : "",
          fromDate: typeof filters.fromDate === "string" ? filters.fromDate : "",
          toDate: typeof filters.toDate === "string" ? filters.toDate : "",
        }}
      />
      <BookingsTable bookings={bookings} />
    </div>
  );
}
