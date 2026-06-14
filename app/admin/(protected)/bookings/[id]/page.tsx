import { notFound } from "next/navigation";
import { BookingDetailCard } from "@/components/admin/bookings/booking-detail-card";
import { BookingStatusActions } from "@/components/admin/bookings/booking-status-actions";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { CancellationForm } from "@/components/admin/bookings/cancellation-form";
import { GuestContactButtons } from "@/components/admin/bookings/guest-contact-buttons";
import { PaymentStatusBadge } from "@/components/admin/bookings/payment-status-badge";
import { PaymentVerificationForm } from "@/components/admin/bookings/payment-verification-form";
import { AuditTrailList } from "@/components/admin/bookings/audit-trail-list";
import { PageHeader } from "@/components/admin/page-header";
import { requireAdmin } from "@/lib/auth";
import { getBookingForAdmin } from "@/lib/admin/bookings";

type AdminBookingDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(value);
}

export default async function AdminBookingDetailPage({
  params,
}: AdminBookingDetailPageProps) {
  const adminUser = await requireAdmin();
  const { id } = await params;
  const booking = await getBookingForAdmin(adminUser, id);

  if (!booking) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Booking Detail"
        title={booking.bookingReference}
        description="Review booking, guest, payment, and audit information."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <BookingDetailCard title="Booking information">
          <div className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
            <p>Reference: {booking.bookingReference}</p>
            <div className="flex items-center gap-3">
              <span>Status:</span>
              <BookingStatusBadge status={booking.status as never} />
            </div>
            <div className="flex items-center gap-3">
              <span>Payment status:</span>
              <PaymentStatusBadge status={booking.paymentStatus as never} />
            </div>
            <p>Created: {formatDateLabel(booking.createdAt)}</p>
            <p>Check-in: {formatDateLabel(booking.checkInDate)}</p>
            <p>Check-out: {formatDateLabel(booking.checkOutDate)}</p>
            <p>Expected arrival: {formatDateLabel(booking.expectedArrivalTime)}</p>
            <p>Guests: {booking.numberOfGuests}</p>
            <p className="sm:col-span-2">
              Special requests: {booking.specialRequests || "None"}
            </p>
          </div>
        </BookingDetailCard>

        <BookingDetailCard title="Guest information">
          <div className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
            <p>First name: {booking.guest.firstName}</p>
            <p>Surname: {booking.guest.surname}</p>
            <p>ID number: {booking.guest.idNumber}</p>
            <p>Gender: {booking.guest.gender}</p>
            <p>Phone: {booking.guest.phone}</p>
            <p>Email: {booking.guest.email}</p>
          </div>
        </BookingDetailCard>

        <BookingDetailCard title="Room information">
          <div className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
            <p>Branch: {booking.branch.name}</p>
            <p>Room type: {booking.roomType.name}</p>
            <p>Room number: {booking.room?.roomNumber ?? "Not assigned"}</p>
            <p>Capacity: {booking.roomType.capacity}</p>
            <p>Price: ${Number(booking.roomType.basePrice).toFixed(2)}</p>
          </div>
        </BookingDetailCard>

        <BookingDetailCard title="Transport information">
          <div className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
            <p>Transport option: {booking.transportOption}</p>
            <p>Own car: {booking.hasOwnCar ? "Yes" : "No"}</p>
            <p>Needs parking: {booking.needsParking ? "Yes" : "No"}</p>
            <p>Needs pickup: {booking.needsPickup ? "Yes" : "No"}</p>
            <p className="sm:col-span-2">Pickup point: {booking.pickupPoint || "None"}</p>
          </div>
        </BookingDetailCard>

        <BookingDetailCard title="Payment information">
          {booking.payment ? (
            <div className="grid gap-3 text-sm leading-7 text-muted-foreground sm:grid-cols-2">
              <p>Method: {booking.payment.method}</p>
              <div className="flex items-center gap-3">
                <span>Status:</span>
                <PaymentStatusBadge status={booking.payment.status as never} />
              </div>
              <p>Amount: ${Number(booking.payment.amount).toFixed(2)}</p>
              <p>Currency: {booking.payment.currency}</p>
              <p>Transaction reference: {booking.payment.transactionReference || "None"}</p>
              <p>Provider reference: {booking.payment.providerReference || "None"}</p>
              <p>Paid date: {booking.payment.paidAt ? formatDateLabel(booking.payment.paidAt) : "Not paid"}</p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No payment record found.</p>
          )}
        </BookingDetailCard>

        <BookingDetailCard title="Guest contact panel">
          <GuestContactButtons
            bookingReference={booking.bookingReference}
            branchName={booking.branch.name}
            checkInDate={booking.checkInDate.toISOString().slice(0, 10)}
            checkOutDate={booking.checkOutDate.toISOString().slice(0, 10)}
            bookingStatus={booking.status}
            paymentStatus={booking.paymentStatus}
            guestName={`${booking.guest.firstName} ${booking.guest.surname}`}
            phone={booking.guest.phone}
            email={booking.guest.email}
          />
        </BookingDetailCard>

        <BookingDetailCard title="Payment verification panel">
          {booking.payment ? (
            <PaymentVerificationForm
              bookingId={booking.id}
              paymentId={booking.payment.id}
              paymentMethod={booking.payment.method}
              currentStatus={booking.payment.status as never}
            />
          ) : (
            <p className="text-sm text-muted-foreground">No payment record found.</p>
          )}
        </BookingDetailCard>

        <BookingDetailCard title="Booking status panel">
          <BookingStatusActions
            bookingId={booking.id}
            status={booking.status as never}
            paymentStatus={booking.paymentStatus as never}
          />
        </BookingDetailCard>

        <BookingDetailCard title="Cancellation panel">
          <CancellationForm bookingId={booking.id} status={booking.status as never} />
        </BookingDetailCard>

        <div className="xl:col-span-2">
          <BookingDetailCard title="Audit trail panel">
            <AuditTrailList logs={booking.auditLogs} />
          </BookingDetailCard>
        </div>
      </div>
    </div>
  );
}
