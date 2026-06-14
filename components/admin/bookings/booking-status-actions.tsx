"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatusAction } from "@/app/admin/bookings/actions";
import { Button } from "@/components/ui/button";
import type { BookingStatus, PaymentStatus } from "@/types";

const initialState = {
  success: false,
  message: "",
  errors: undefined as Record<string, string[]> | undefined,
};

export function BookingStatusActions({
  bookingId,
  status,
  paymentStatus,
}: {
  bookingId: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(updateBookingStatusAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="space-y-4">
      {state.message ? (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            state.success
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-accent/20 bg-accent/8 text-accent"
          }`}
        >
          {state.message}
        </div>
      ) : null}

      {status === "PENDING" ? (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="status" value="CONFIRMED" />
          <Button disabled={isPending || paymentStatus !== "PAID"}>
            Confirm Booking
          </Button>
          {paymentStatus !== "PAID" ? (
            <p className="text-sm text-accent">
              Payment must be marked as paid before confirming this booking.
            </p>
          ) : null}
        </form>
      ) : null}

      {status === "CONFIRMED" ? (
        <form action={formAction}>
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="status" value="CHECKED_IN" />
          <Button disabled={isPending}>Mark Checked In</Button>
        </form>
      ) : null}

      {status === "CHECKED_IN" ? (
        <form action={formAction}>
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="status" value="CHECKED_OUT" />
          <Button disabled={isPending}>Mark Checked Out</Button>
        </form>
      ) : null}

      {(status === "PENDING" || status === "CONFIRMED") ? (
        <form action={formAction} className="space-y-3">
          <input type="hidden" name="bookingId" value={bookingId} />
          <input type="hidden" name="status" value="NO_SHOW" />
          <label htmlFor="reason" className="block text-sm font-semibold text-foreground">
            No-show note
          </label>
          <textarea
            id="reason"
            name="reason"
            rows={3}
            placeholder="Optional note about the no-show"
            className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
          />
          <Button disabled={isPending} variant="outline">Mark No Show</Button>
        </form>
      ) : null}
    </div>
  );
}
