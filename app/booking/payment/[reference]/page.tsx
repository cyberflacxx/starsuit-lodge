import { notFound } from "next/navigation";
import { BookingProgress } from "@/components/booking/booking-progress";
import { BookingSummaryCard } from "@/components/booking/booking-summary-card";
import { MockEcoCashPayment } from "@/components/payment/mock-ecocash-payment";
import { PaymentInstructions } from "@/components/payment/payment-instructions";
import { PaymentStatusBadge } from "@/components/payment/payment-status-badge";
import { getPaymentBookingByReference } from "@/lib/payments";

type BookingPaymentPageProps = {
  params: Promise<{
    reference: string;
  }>;
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(value);
}

export default async function BookingPaymentPage({ params }: BookingPaymentPageProps) {
  const { reference } = await params;
  const booking = await getPaymentBookingByReference(reference);

  if (!booking || !booking.room || !booking.payment) {
    notFound();
  }

  const nights = Math.max(
    1,
    Math.round(
      (booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / 86400000,
    ),
  );

  return (
    <section className="section-gap">
      <div className="shell space-y-8">
        <BookingProgress
          currentStep={4}
          steps={["Availability", "Guest Details", "Review", "Payment"]}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="surface-card px-6 py-8 sm:px-8">
            <span className="eyebrow">Mock EcoCash Payment</span>
            <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">
              Complete Your Mock EcoCash Payment
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
              Review the booking, launch the demo EcoCash dialer, then return and confirm that you have paid.
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              A confirmation email will be sent if the email service is configured. Lodge staff may also contact you by phone or WhatsApp.
            </p>

            <div className="mt-8 grid gap-4 rounded-[1.8rem] border border-border bg-muted px-5 py-5 text-sm leading-7 text-muted-foreground sm:grid-cols-2 sm:text-base">
              <p>Booking reference: {booking.bookingReference}</p>
              <p>
                Guest: {booking.guest.firstName} {booking.guest.surname}
              </p>
              <p>Branch: {booking.branch.name}</p>
              <p>Room: {booking.room.roomNumber}</p>
              <p>Room type: {booking.roomType.name}</p>
              <p>Check-in: {formatDateLabel(booking.checkInDate)}</p>
              <p>Check-out: {formatDateLabel(booking.checkOutDate)}</p>
              <p>Nights: {nights}</p>
              <p>Total amount: ${Number(booking.totalAmount).toFixed(2)}</p>
              <div className="flex items-center gap-3">
                <span>Payment status:</span>
                <PaymentStatusBadge status={booking.payment.status} />
              </div>
              <p>Booking status: {booking.status}</p>
            </div>

            <div className="mt-8">
              <PaymentInstructions />
            </div>

            <div className="mt-8">
              <MockEcoCashPayment
                bookingReference={booking.bookingReference}
                paymentId={booking.payment.id}
                amount={Number(booking.totalAmount)}
                status={booking.payment.status}
              />
            </div>
          </div>

          <BookingSummaryCard
            summary={{
              bookingReference: booking.bookingReference,
              guestName: `${booking.guest.firstName} ${booking.guest.surname}`,
              branchName: booking.branch.name,
              roomTypeName: booking.roomType.name,
              roomNumber: booking.room.roomNumber,
              checkInDate: booking.checkInDate.toISOString().slice(0, 10),
              checkOutDate: booking.checkOutDate.toISOString().slice(0, 10),
              nights,
              numberOfGuests: booking.numberOfGuests,
              pricePerNight: Number(booking.roomType.basePrice),
              totalAmount: Number(booking.totalAmount),
              paymentStatus: booking.payment.status,
            }}
          />
        </div>
      </div>
    </section>
  );
}
