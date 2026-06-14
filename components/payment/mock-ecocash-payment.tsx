"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ExternalLink, Smartphone, TriangleAlert } from "lucide-react";
import { confirmMockPaymentAction } from "@/app/booking/payment/[reference]/actions";
import { Button } from "@/components/ui/button";
import {
  MOCK_ECOCASH_DISPLAY_CODE,
  MOCK_ECOCASH_USSD,
} from "@/lib/constants";
import type { PaymentStatus } from "@/types";

const initialState = {
  success: false,
  message: "",
  errors: undefined as Record<string, string[]> | undefined,
};

export function MockEcoCashPayment({
  bookingReference,
  paymentId,
  amount,
  status,
}: {
  bookingReference: string;
  paymentId: string;
  amount: number;
  status: PaymentStatus;
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(confirmMockPaymentAction, initialState);
  const [showPayment, setShowPayment] = useState(status !== "UNPAID");

  function getError(field: string) {
    return state.errors?.[field]?.[0];
  }

  const isSubmitted = status === "PENDING" || status === "PAID" || state.success;

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [router, state.success]);

  return (
    <div className="space-y-5">
      <div className="rounded-[1.8rem] border border-primary/12 bg-primary/6 px-5 py-5">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Demo payment
        </p>
        <p className="mt-3 text-sm leading-7 text-foreground sm:text-base">
          Booking total: <strong>${amount.toFixed(2)}</strong>
        </p>
        <p className="mt-2 text-sm leading-7 text-muted-foreground">
          For this demo, the EcoCash dial code uses a fixed test amount.
        </p>
      </div>

      {!showPayment ? (
        <Button type="button" size="lg" className="w-full sm:w-auto" onClick={() => setShowPayment(true)}>
          Pay Now
        </Button>
      ) : null}

      {showPayment ? (
        <div className="space-y-5 rounded-[1.8rem] border border-border bg-white px-5 py-5 shadow-[0_18px_45px_rgba(7,26,51,0.08)]">
          <div className="rounded-[1.4rem] border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 h-5 w-5" />
              <div>
                <p className="font-semibold">Desktop limitation</p>
                <p className="mt-1 leading-7">
                  If you are on desktop, open this page on your phone to complete the USSD demo.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[1.4rem] border border-primary/12 bg-muted px-4 py-4">
            <p className="text-sm font-semibold text-foreground">Demo dial code</p>
            <p className="mt-2 font-mono text-sm text-primary">{MOCK_ECOCASH_DISPLAY_CODE}</p>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">
              This opens your phone dialer with the demo EcoCash USSD code.
            </p>
          </div>

          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={MOCK_ECOCASH_USSD}>
              Open EcoCash Dialer
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>

          <form action={formAction} className="space-y-4 rounded-[1.4rem] border border-border px-4 py-5">
            <input type="hidden" name="bookingReference" value={bookingReference} />
            <input type="hidden" name="paymentId" value={paymentId} />

            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-primary" />
              <div>
                <h3 className="font-semibold text-foreground">Return after paying</h3>
                <p className="text-sm text-muted-foreground">
                  Once you confirm on your phone, submit this form to mark the payment as pending verification.
                </p>
              </div>
            </div>

            {state.message && !state.success ? (
              <div className="rounded-2xl border border-accent/20 bg-accent/8 px-4 py-3 text-sm text-accent">
                {state.message}
              </div>
            ) : null}

            {state.success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5" />
                  <div>
                    <p>{state.message}</p>
                    <div className="mt-3">
                      <Link
                        href={`/booking/success/${bookingReference}`}
                        className="font-semibold text-primary underline-offset-4 hover:underline"
                      >
                        View booking success page
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            <div>
              <label htmlFor="payerPhone" className="mb-2 block text-sm font-semibold text-foreground">
                Payer phone number
              </label>
              <input
                id="payerPhone"
                name="payerPhone"
                type="tel"
                placeholder="+263 78 000 0000"
                className="h-12 w-full rounded-[1.4rem] border border-border bg-white px-4 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <ErrorText message={getError("payerPhone")} />
            </div>

            <div>
              <label
                htmlFor="confirmationNote"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Confirmation note
              </label>
              <textarea
                id="confirmationNote"
                name="confirmationNote"
                rows={4}
                placeholder="Optional note about the payment attempt"
                className="w-full rounded-[1.4rem] border border-border bg-white px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
              <ErrorText message={getError("confirmationNote")} />
            </div>

            <Button type="submit" disabled={isPending || isSubmitted} className="w-full sm:w-auto">
              {isPending ? "Submitting..." : isSubmitted ? "Confirmation Submitted" : "I Have Paid"}
            </Button>
          </form>
        </div>
      ) : null}
    </div>
  );
}

function ErrorText({ message }: { message?: string }) {
  return message ? <p className="mt-2 text-sm text-accent">{message}</p> : null;
}
