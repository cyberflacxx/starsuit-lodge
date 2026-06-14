"use server";

import { ZodError } from "zod";
import { markMockPaymentPending } from "@/lib/payments";
import { mockPaymentConfirmationSchema } from "@/lib/validations/payment";

type MockPaymentActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function confirmMockPaymentAction(
  _state: MockPaymentActionState,
  formData: FormData,
): Promise<MockPaymentActionState> {
  const values = {
    bookingReference: String(formData.get("bookingReference") ?? ""),
    paymentId: String(formData.get("paymentId") ?? ""),
    payerPhone: String(formData.get("payerPhone") ?? ""),
    confirmationNote: String(formData.get("confirmationNote") ?? ""),
  };

  const parsed = mockPaymentConfirmationSchema.safeParse(values);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please correct the highlighted fields and try again.",
      errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await markMockPaymentPending(parsed.data);

    return {
      success: true,
      message:
        "Payment confirmation submitted. Starsuit Lodges will verify and confirm your booking.",
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
      message:
        error instanceof Error
          ? error.message
          : "Payment confirmation could not be submitted right now.",
    };
  }
}
