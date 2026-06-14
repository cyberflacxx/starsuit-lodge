"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyPaymentAction } from "@/app/admin/bookings/actions";
import { Button } from "@/components/ui/button";
import type { PaymentStatus } from "@/types";

const initialState = {
  success: false,
  message: "",
  errors: undefined as Record<string, string[]> | undefined,
};

export function PaymentVerificationForm({
  bookingId,
  paymentId,
  paymentMethod,
  currentStatus,
}: {
  bookingId: string;
  paymentId: string;
  paymentMethod: string;
  currentStatus: PaymentStatus;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(verifyPaymentAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  if (paymentMethod !== "MOCK_ECOCASH") {
    return (
      <p className="text-sm text-muted-foreground">
        Payment verification is only available for mock EcoCash payments in this module.
      </p>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="bookingId" value={bookingId} />
      <input type="hidden" name="paymentId" value={paymentId} />

      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
        Verify the EcoCash payment before marking it as paid.
      </div>

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
        <label htmlFor="newStatus" className="mb-2 block text-sm font-semibold text-foreground">
          New payment status
        </label>
        <select
          id="newStatus"
          name="newStatus"
          defaultValue={currentStatus === "PAID" ? "PAID" : "PAID"}
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        >
          <option value="PAID">PAID</option>
          <option value="FAILED">FAILED</option>
          <option value="REFUNDED">REFUNDED</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="transactionReference"
          className="mb-2 block text-sm font-semibold text-foreground"
        >
          Transaction reference
        </label>
        <input
          id="transactionReference"
          name="transactionReference"
          placeholder="Optional EcoCash reference"
          className="h-12 w-full rounded-2xl border border-border bg-white px-4 text-sm text-foreground"
        />
      </div>

      <div>
        <label htmlFor="note" className="mb-2 block text-sm font-semibold text-foreground">
          Note
        </label>
        <textarea
          id="note"
          name="note"
          rows={3}
          placeholder="Optional verification note"
          className="w-full rounded-2xl border border-border bg-white px-4 py-3 text-sm text-foreground"
        />
      </div>

      <Button disabled={isPending}>Verify Payment</Button>
    </form>
  );
}
