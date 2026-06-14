import type { BookingStatus, PaymentStatus } from "@/types";
import type { Prisma } from "@prisma/client";
import Link from "next/link";
import { BookingStatusBadge } from "@/components/admin/bookings/booking-status-badge";
import { GuestContactButtons } from "@/components/admin/bookings/guest-contact-buttons";
import { PaymentStatusBadge } from "@/components/admin/bookings/payment-status-badge";

type BookingRow = {
  id: string;
  bookingReference: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalAmount: Prisma.Decimal | number;
  branch: {
    name: string;
  };
  room: {
    roomNumber: string;
  } | null;
  roomType: {
    name: string;
  };
  guest: {
    firstName: string;
    surname: string;
    phone: string;
    email: string;
  };
};

function formatDateLabel(value: Date) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeZone: "UTC",
  }).format(value);
}

export function BookingsTable({ bookings }: { bookings: BookingRow[] }) {
  if (!bookings.length) {
    return (
      <div className="surface-card px-6 py-10 text-center sm:px-8">
        <h2 className="text-2xl font-semibold text-foreground">No bookings found</h2>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">
          Try changing your filters or search terms to find matching bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="surface-card overflow-x-auto px-2 py-2 sm:px-4">
      <table className="min-w-full divide-y divide-border">
        <thead>
          <tr className="text-left text-xs uppercase tracking-[0.18em] text-muted-foreground">
            <th className="px-4 py-4">Reference</th>
            <th className="px-4 py-4">Guest</th>
            <th className="px-4 py-4">Branch</th>
            <th className="px-4 py-4">Room</th>
            <th className="px-4 py-4">Check-in</th>
            <th className="px-4 py-4">Check-out</th>
            <th className="px-4 py-4">Booking status</th>
            <th className="px-4 py-4">Payment status</th>
            <th className="px-4 py-4">Total amount</th>
            <th className="px-4 py-4">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border text-sm text-foreground">
          {bookings.map((booking) => (
            <tr key={booking.id} className="align-top">
              <td className="px-4 py-4 font-semibold">{booking.bookingReference}</td>
              <td className="px-4 py-4">
                <p className="font-medium">
                  {booking.guest.firstName} {booking.guest.surname}
                </p>
                <p className="mt-1 text-muted-foreground">{booking.guest.phone}</p>
              </td>
              <td className="px-4 py-4">{booking.branch.name}</td>
              <td className="px-4 py-4">
                {booking.roomType.name} | Room {booking.room?.roomNumber ?? "Not assigned"}
              </td>
              <td className="px-4 py-4">{formatDateLabel(booking.checkInDate)}</td>
              <td className="px-4 py-4">{formatDateLabel(booking.checkOutDate)}</td>
              <td className="px-4 py-4">
                <BookingStatusBadge status={booking.status} />
              </td>
              <td className="px-4 py-4">
                <PaymentStatusBadge status={booking.paymentStatus} />
              </td>
              <td className="px-4 py-4">${Number(booking.totalAmount).toFixed(2)}</td>
              <td className="px-4 py-4">
                <div className="space-y-3">
                  <Link
                    href={`/admin/bookings/${booking.id}`}
                    className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    View Details
                  </Link>
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
