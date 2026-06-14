import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { PaymentStatusBadge } from "@/components/payment/payment-status-badge";
import { Button } from "@/components/ui/button";
import { getPaymentBookingByReference } from "@/lib/payments";

type BookingSuccessPageProps = {
  params: Promise<{
    reference: string;
  }>;
};

export default async function BookingSuccessPage({ params }: BookingSuccessPageProps) {
  const { reference } = await params;
  const booking = await getPaymentBookingByReference(reference);

  if (!booking || !booking.room || !booking.payment) {
    notFound();
  }

  const statusMessage =
    booking.status === "CONFIRMED"
      ? "Your booking has been confirmed."
      : booking.status === "CANCELLED"
        ? "Your booking has been cancelled. Please contact Starsuit Lodges for support."
        : booking.payment.status === "PAID" && booking.status === "PENDING"
          ? "Your payment has been verified. Starsuit Lodges will confirm your booking shortly."
          : "Your payment confirmation has been received and is awaiting verification.";
  const heading =
    booking.status === "CONFIRMED"
      ? "Booking confirmed"
      : booking.status === "CANCELLED"
        ? "Booking cancelled"
        : booking.payment.status === "PAID" && booking.status === "PENDING"
          ? "Payment verified"
          : "Payment verification pending";

  return (
    <section className="section-gap">
      <div className="shell">
        <div className="surface-card px-6 py-10 sm:px-8 lg:px-12 lg:py-14">
          <div className="flex items-center gap-3 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold uppercase tracking-[0.18em]">
              Booking received
            </span>
          </div>

          <h1 className="mt-5 text-4xl font-semibold sm:text-5xl">{heading}</h1>
          <p className="mt-4 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
            {statusMessage}
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
            <div className="flex items-center gap-3">
              <span>Payment status:</span>
              <PaymentStatusBadge status={booking.payment.status} />
            </div>
            <p>Booking status: {booking.status}</p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild>
              <Link href="/">Back to Home</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/contact">Contact Starsuit Lodges</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/booking/payment/${booking.bookingReference}`}>View Payment Page</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
