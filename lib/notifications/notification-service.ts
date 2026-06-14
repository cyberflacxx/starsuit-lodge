import "server-only";

import { getEmailTransport, isEmailConfigured } from "@/lib/notifications/email-client";
import {
  adminNewBookingEmail,
  adminPaymentSubmittedEmail,
  bookingCancelledEmail,
  bookingConfirmedEmail,
  bookingCreatedEmail,
  guestCheckedInEmail,
  guestCheckedOutEmail,
  noShowEmail,
  paymentSubmittedEmail,
  paymentVerifiedEmail,
} from "@/lib/notifications/templates";
import type {
  AdminNotificationPayload,
  BookingNotificationPayload,
  EmailRecipient,
  NotificationResult,
  PaymentNotificationPayload,
} from "@/lib/notifications/types";
import { getPaymentBookingByReference } from "@/lib/payments";

function appUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
}

function contactEmail() {
  return process.env.SMTP_FROM?.match(/<([^>]+)>/)?.[1] ?? "bookings@starsuitlodges.com";
}

function formatDateInput(value: Date) {
  return value.toISOString().slice(0, 10);
}

function formatArrivalTime(value: Date) {
  return value.toISOString().slice(11, 16);
}

async function loadBookingPayload(reference: string) {
  const booking = await getPaymentBookingByReference(reference);

  if (!booking) {
    return null;
  }

  const guestSuccessUrl = `${appUrl()}/booking/success/${booking.bookingReference}`;
  const paymentUrl = `${appUrl()}/booking/payment/${booking.bookingReference}`;
  const detailUrl = `${appUrl()}/admin/bookings/${booking.id}`;

  const basePayload: BookingNotificationPayload = {
    bookingReference: booking.bookingReference,
    guestName: `${booking.guest.firstName} ${booking.guest.surname}`,
    guestEmail: booking.guest.email,
    guestPhone: booking.guest.phone,
    branchName: booking.branch.name,
    branchEmail: booking.branch.email,
    roomTypeName: booking.roomType.name,
    roomNumber: booking.room?.roomNumber ?? null,
    checkInDate: formatDateInput(booking.checkInDate),
    checkOutDate: formatDateInput(booking.checkOutDate),
    expectedArrivalTime: formatArrivalTime(booking.expectedArrivalTime),
    numberOfGuests: booking.numberOfGuests,
    bookingStatus: booking.status,
    paymentStatus: booking.paymentStatus,
    totalAmount: Number(booking.totalAmount),
    specialRequests: booking.specialRequests,
    guestSuccessUrl,
    paymentUrl,
    contactEmail: contactEmail(),
  };

  const paymentPayload: PaymentNotificationPayload = {
    ...basePayload,
    paymentMethod: booking.payment?.method ?? "UNKNOWN",
    transactionReference: booking.payment?.transactionReference ?? null,
    providerReference: booking.payment?.providerReference ?? null,
  };

  const adminPayload: AdminNotificationPayload = {
    branchName: booking.branch.name,
    branchEmail: booking.branch.email,
    bookingReference: booking.bookingReference,
    guestName: `${booking.guest.firstName} ${booking.guest.surname}`,
    guestPhone: booking.guest.phone,
    guestEmail: booking.guest.email,
    bookingStatus: booking.status,
    paymentStatus: booking.paymentStatus,
    checkInDate: basePayload.checkInDate,
    checkOutDate: basePayload.checkOutDate,
    totalAmount: Number(booking.totalAmount),
    detailUrl,
  };

  return {
    booking,
    basePayload,
    paymentPayload,
    adminPayload,
  };
}

export async function sendEmail(
  to: EmailRecipient,
  subject: string,
  html: string,
  text: string,
): Promise<NotificationResult> {
  if (!isEmailConfigured()) {
    const message = `Email skipped for ${to.email}: SMTP is not configured.`;
    console.info(message);
    return {
      success: true,
      skipped: true,
      message,
      channel: "email",
    };
  }

  try {
    const transport = getEmailTransport();
    await transport.sendMail({
      from: process.env.SMTP_FROM || "Starsuit Lodges <bookings@starsuitlodges.com>",
      to: to.name ? `${to.name} <${to.email}>` : to.email,
      subject,
      html,
      text,
    });

    return {
      success: true,
      message: `Email sent to ${to.email}.`,
      channel: "email",
    };
  } catch (error) {
    console.error("Notification email failed:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Email send failed.",
      channel: "email",
    };
  }
}

async function sendGuestTemplate(
  payload: BookingNotificationPayload | PaymentNotificationPayload,
  template: { subject: string; html: string; text: string },
) {
  return sendEmail(
    {
      email: payload.guestEmail,
      name: payload.guestName,
    },
    template.subject,
    template.html,
    template.text,
  );
}

async function sendAdminTemplate(payload: AdminNotificationPayload, template: { subject: string; html: string; text: string }) {
  if (!payload.branchEmail) {
    return {
      success: true,
      skipped: true,
      message: "Branch email is not configured, admin email skipped.",
      channel: "email",
    } satisfies NotificationResult;
  }

  return sendEmail(
    {
      email: payload.branchEmail,
      name: payload.branchName,
    },
    template.subject,
    template.html,
    template.text,
  );
}

export async function notifyBookingCreated(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }

  return Promise.all([
    sendGuestTemplate(payloads.basePayload, bookingCreatedEmail(payloads.basePayload)),
    sendAdminTemplate(payloads.adminPayload, adminNewBookingEmail(payloads.adminPayload)),
  ]);
}

export async function notifyMockPaymentSubmitted(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }

  return Promise.all([
    sendGuestTemplate(payloads.paymentPayload, paymentSubmittedEmail(payloads.paymentPayload)),
    sendAdminTemplate(payloads.adminPayload, adminPaymentSubmittedEmail(payloads.adminPayload)),
  ]);
}

export async function notifyPaymentVerified(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(payloads.paymentPayload, paymentVerifiedEmail(payloads.paymentPayload))];
}

export async function notifyBookingConfirmed(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(payloads.basePayload, bookingConfirmedEmail(payloads.basePayload))];
}

export async function notifyBookingCancelled(bookingReference: string, reason?: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(
    { ...payloads.basePayload, specialRequests: reason ?? payloads.basePayload.specialRequests },
    bookingCancelledEmail({ ...payloads.basePayload, specialRequests: reason ?? payloads.basePayload.specialRequests }),
  )];
}

export async function notifyGuestCheckedIn(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(payloads.basePayload, guestCheckedInEmail(payloads.basePayload))];
}

export async function notifyGuestCheckedOut(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(payloads.basePayload, guestCheckedOutEmail(payloads.basePayload))];
}

export async function notifyBookingNoShow(bookingReference: string) {
  const payloads = await loadBookingPayload(bookingReference);
  if (!payloads) {
    return [{ success: false, message: "Booking not found for notification.", channel: "email" } satisfies NotificationResult];
  }
  return [await sendGuestTemplate(payloads.basePayload, noShowEmail(payloads.basePayload))];
}
