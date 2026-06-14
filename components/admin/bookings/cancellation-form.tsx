"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cancelBookingAction } from "@/app/admin/bookings/actions";
import { Button } from "@/components/ui/button";
import type { BookingStatus } from "@/types";

const initialState = {
  success: false,
  message: "",
  errors: undefined as Record<string, string[]> | undefined,
};

export function CancellationForm({
  bookingId,
  status,
}: {
  bookingId: string;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(cancelBookingAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  if (!["PENDING", "CONFIRMED"].includes(status)) {
    return (
      <p className="text-sm text-muted-foreground">
        Only pending or confirmed bookings can be cancelled.
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className="space-y-4"
      onSubmit={(event) => {
        if (!window.confirm("Cancel this booking?")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="bookingId" value={bookingId} />

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

      <div>
        <label
          htmlFor="cancellationReason"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Cancellation reason
        </label>
        <textarea
          id="cancellationReason"
          name="cancellationReason"
          rows={4}
          required
          placeholder="Why is this booking being cancelled?"
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
        />
      </div>

      <Button disabled={isPending} className="bg-accent hover:bg-accent/90 text-white">
        Cancel Booking
      </Button>
    </form>
  );
}
