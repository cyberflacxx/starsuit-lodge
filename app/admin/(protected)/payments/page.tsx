import Link from "next/link";
import { PageHeader } from "@/components/admin/page-header";
import { PaymentStatusBadge } from "@/components/admin/bookings/payment-status-badge";
import { requireAdmin } from "@/lib/auth";
import { getBookingsForAdmin } from "@/lib/admin/bookings";

function isToday(value: Date) {
  const today = new Date();

  return (
    value.getUTCFullYear() === today.getUTCFullYear() &&
    value.getUTCMonth() === today.getUTCMonth() &&
    value.getUTCDate() === today.getUTCDate()
  );
}

export default async function AdminPaymentsPage() {
  const adminUser = await requireAdmin();
  const allBookings = await getBookingsForAdmin(adminUser, {});
  const bookings = allBookings.filter((booking) =>
    ["PENDING", "UNPAID", "FAILED", "REFUNDED"].includes(booking.paymentStatus),
  );

  const stats = {
    pendingVerification: allBookings.filter((booking) => booking.paymentStatus === "PENDING").length,
    paidToday: allBookings.filter(
      (booking) => booking.paymentStatus === "PAID" && booking.payment?.paidAt && isToday(booking.payment.paidAt),
    ).length,
    failed: allBookings.filter((booking) => booking.paymentStatus === "FAILED").length,
    unpaid: allBookings.filter((booking) => booking.paymentStatus === "UNPAID").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Payments"
        title="Payment Verification"
        description="Review guest payment states and open booking records for manual verification."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Pending Verification", stats.pendingVerification],
          ["Paid Today", stats.paidToday],
          ["Failed", stats.failed],
          ["Unpaid", stats.unpaid],
        ].map(([label, value]) => (
          <div key={label} className="surface-card rounded-[1.8rem] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {label}
            </p>
            <p className="mt-4 text-4xl font-semibold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      <div className="surface-card overflow-x-auto px-2 py-2 sm:px-4">
        <table className="min-w-full divide-y divide-border">
          <thead>
            <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
              <th className="px-4 py-4">Booking reference</th>
              <th className="px-4 py-4">Guest</th>
              <th className="px-4 py-4">Branch</th>
              <th className="px-4 py-4">Amount</th>
              <th className="px-4 py-4">Payment method</th>
              <th className="px-4 py-4">Payment status</th>
              <th className="px-4 py-4">Created date</th>
              <th className="px-4 py-4">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm text-foreground">
            {bookings.length ? (
              bookings.map((booking) => (
                <tr key={booking.id}>
                  <td className="px-4 py-4 font-semibold">{booking.bookingReference}</td>
                  <td className="px-4 py-4">
                    {booking.guest.firstName} {booking.guest.surname}
                  </td>
                  <td className="px-4 py-4">{booking.branch.name}</td>
                  <td className="px-4 py-4">${Number(booking.totalAmount).toFixed(2)}</td>
                  <td className="px-4 py-4">{booking.payment?.method ?? "No payment"}</td>
                  <td className="px-4 py-4">
                    <PaymentStatusBadge status={booking.paymentStatus as never} />
                  </td>
                  <td className="px-4 py-4">
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeZone: "UTC",
                    }).format(booking.createdAt)}
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/admin/bookings/${booking.id}`}
                      className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                    >
                      View Booking
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">
                  No payment-focused bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
