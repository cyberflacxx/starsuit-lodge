"use server";

import { revalidatePath } from "next/cache";
import { ZodError } from "zod";
import { requireAdmin } from "@/lib/auth";
import {
  notifyBookingCancelled,
  notifyBookingConfirmed,
  notifyBookingNoShow,
  notifyGuestCheckedIn,
  notifyGuestCheckedOut,
  notifyPaymentVerified,
} from "@/lib/notifications/notification-service";
import {
  cancelBookingForAdmin,
  confirmMockPaymentForAdmin,
  getBookingForAdmin,
  updateBookingStatusForAdmin,
} from "@/lib/admin/bookings";
import {
  bookingStatusUpdateSchema,
  cancelBookingSchema,
  paymentVerificationSchema,
} from "@/lib/validations/admin-booking";

type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

function revalidateBookingPaths(bookingId: string, bookingReference?: string) {
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${bookingId}`);
  revalidatePath("/admin/payments");

  if (bookingReference) {
    revalidatePath(`/booking/success/${bookingReference}`);
  }
}

function logNotificationFailures(context: string, results: Awaited<ReturnType<typeof notifyBookingConfirmed>>) {
  results
    .filter((item) => !item.success)
    .forEach((item) => console.error(`${context} notification failed:`, item.message));
}

export async function updateBookingStatusAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = bookingStatusUpdateSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
    status: String(formData.get("status") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const booking = await updateBookingStatusForAdmin(
      adminUser,
      parsed.data.bookingId,
      parsed.data.status,
      parsed.data.reason,
    );

    if (parsed.data.status === "CONFIRMED") {
      void notifyBookingConfirmed(booking.bookingReference).then((results) =>
        logNotificationFailures("Booking confirmed", results),
      );
    }

    if (parsed.data.status === "CHECKED_IN") {
      void notifyGuestCheckedIn(booking.bookingReference).then((results) =>
        logNotificationFailures("Guest checked in", results),
      );
    }

    if (parsed.data.status === "CHECKED_OUT") {
      void notifyGuestCheckedOut(booking.bookingReference).then((results) =>
        logNotificationFailures("Guest checked out", results),
      );
    }

    if (parsed.data.status === "NO_SHOW") {
      void notifyBookingNoShow(booking.bookingReference).then((results) =>
        logNotificationFailures("Booking no-show", results),
      );
    }

    revalidateBookingPaths(booking.id, booking.bookingReference);

    return {
      success: true,
      message: `Booking marked as ${parsed.data.status.replaceAll("_", " ").toLowerCase()}.`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Booking status could not be updated.",
    };
  }
}

export async function cancelBookingAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = cancelBookingSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
    cancellationReason: String(formData.get("cancellationReason") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const booking = await cancelBookingForAdmin(
      adminUser,
      parsed.data.bookingId,
      parsed.data.cancellationReason,
    );

    void notifyBookingCancelled(
      booking.bookingReference,
      parsed.data.cancellationReason,
    ).then((results) => logNotificationFailures("Booking cancelled", results));

    revalidateBookingPaths(booking.id, booking.bookingReference);

    return {
      success: true,
      message: "Booking cancelled successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Booking could not be cancelled.",
    };
  }
}

export async function verifyPaymentAction(
  _state: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const adminUser = await requireAdmin();
  const parsed = paymentVerificationSchema.safeParse({
    bookingId: String(formData.get("bookingId") ?? ""),
    paymentId: String(formData.get("paymentId") ?? ""),
    newStatus: String(formData.get("newStatus") ?? ""),
    transactionReference: String(formData.get("transactionReference") ?? ""),
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    const payment = await confirmMockPaymentForAdmin(adminUser, parsed.data.bookingId, parsed.data);
    const booking = await getBookingForAdmin(adminUser, parsed.data.bookingId);

    if (parsed.data.newStatus === "PAID" && booking) {
      void notifyPaymentVerified(booking.bookingReference).then((results) =>
        logNotificationFailures("Payment verified", results),
      );
    }

    revalidateBookingPaths(parsed.data.bookingId, booking?.bookingReference);

    return {
      success: true,
      message: `Payment marked as ${payment.status.toLowerCase()}.`,
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        success: false,
        message: "Please correct the highlighted fields and try again.",
        errors: error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    return {
      success: false,
      message: error instanceof Error ? error.message : "Payment could not be verified.",
    };
  }
}
