import type { BookingNotificationPayload } from "@/lib/notifications/types";

export function normalisePhoneForWhatsApp(phone: string) {
  const digits = phone.replace(/[^\d]/g, "");

  if (digits.startsWith("263")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `263${digits.slice(1)}`;
  }

  return digits;
}

export function createWhatsAppLink(phone: string, message: string) {
  return `https://wa.me/${normalisePhoneForWhatsApp(phone)}?text=${encodeURIComponent(message)}`;
}

export function createBookingWhatsAppMessage(booking: BookingNotificationPayload) {
  return [
    `Hello ${booking.guestName},`,
    `Starsuit Lodges booking update.`,
    `Reference: ${booking.bookingReference}`,
    `Branch: ${booking.branchName}`,
    `Check-in: ${booking.checkInDate}`,
    `Check-out: ${booking.checkOutDate}`,
    `Payment status: ${booking.paymentStatus}`,
    `Booking status: ${booking.bookingStatus}`,
  ].join("\n");
}
